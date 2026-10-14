"use client";

import "@/lib/three-console";

import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { applySit, createSitRig, restoreSit, type SitRig } from "./dog-sit";

const MODEL = "/models/dog.glb";
const HEIGHT = 64;
const STOP = 72;
const MAX_SPEED = 620;
const GALLOP_AT = 230;
const WALK_AT = 18;
const WALK_PACE = 105;
const GALLOP_PACE = 360;
const SIT_AFTER = 0.55;
const SIT_DOWN = 1.7;
const SIT_UP = 3.6;

const pointer = { x: 0, y: 0, seen: false, moved: 0 };
const pace = { busy: true };

function shadowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(0,0,0,0.55)");
    gradient.addColorStop(0.55, "rgba(0,0,0,0.22)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }
  return new THREE.CanvasTexture(canvas);
}

function shortestAngle(from: number, to: number) {
  let delta = (to - from) % (Math.PI * 2);
  if (delta > Math.PI) delta -= Math.PI * 2;
  if (delta < -Math.PI) delta += Math.PI * 2;
  return delta;
}

function Dog() {
  const group = useRef<THREE.Group>(null);
  const fit = useRef<THREE.Group>(null);
  const rig = useRef<{
    mixer: THREE.AnimationMixer;
    actions: Record<string, THREE.AnimationAction>;
    sit: SitRig;
  } | null>(null);
  const state = useRef({
    pos: new THREE.Vector3(),
    target: new THREE.Vector3(),
    heading: 0,
    speed: 0,
    clip: "",
    placed: false,
    sit: 0,
    still: 0,
    ray: new THREE.Raycaster(),
    ndc: new THREE.Vector2(),
    plane: new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
  });
  const { scene, animations } = useGLTF(MODEL);
  const { camera, size } = useThree();

  useEffect(() => {
    const holder = fit.current;
    if (!holder) return;
    const box = new THREE.Box3().setFromObject(scene);
    const height = box.max.y - box.min.y || 1;
    const scale = HEIGHT / height;
    holder.scale.setScalar(scale);
    holder.position.y = -box.min.y * scale;
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) child.frustumCulled = false;
    });

    const mixer = new THREE.AnimationMixer(scene);
    const actions: Record<string, THREE.AnimationAction> = {};
    for (const clip of animations) actions[clip.name] = mixer.clipAction(clip);
    actions.Idle?.play();
    rig.current = { mixer, actions, sit: createSitRig(scene) };
    state.current.clip = "Idle";
    return () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(scene);
      rig.current = null;
    };
  }, [scene, animations]);

  const shadow = useMemo(() => shadowTexture(), []);

  useFrame((_, delta) => {
    const s = state.current;
    const node = group.current;
    const animation = rig.current;
    if (!node || !animation) return;
    const dt = Math.min(delta, 0.05);
    restoreSit(animation.sit);
    animation.mixer.update(dt);
    const actions = animation.actions;

    const toGround = (x: number, y: number, out: THREE.Vector3) => {
      s.ndc.set((x / size.width) * 2 - 1, -(y / size.height) * 2 + 1);
      s.ray.setFromCamera(s.ndc, camera);
      return s.ray.ray.intersectPlane(s.plane, out);
    };

    if (!s.placed) {
      if (!pointer.seen) {
        node.visible = false;
        return;
      }
      toGround(Math.max(40, pointer.x - 160), Math.min(size.height - 30, pointer.y + 120), s.pos);
      s.placed = true;
      node.visible = true;
    }

    toGround(pointer.x, pointer.y, s.target);

    const dx = s.target.x - s.pos.x;
    const dz = s.target.z - s.pos.z;
    const distance = Math.hypot(dx, dz);
    const want = Math.atan2(dx, dz);
    const facing = Math.abs(shortestAngle(s.heading, want));
    let desired = distance > STOP ? Math.min(MAX_SPEED, (distance - STOP) * 3.2) : 0;
    const restless = desired > 0 || (distance > 12 && facing > 0.9);
    s.still = restless || s.speed > 0 ? 0 : s.still + dt;
    const sitTarget = !restless && s.still > SIT_AFTER ? 1 : 0;
    s.sit = sitTarget === 1 ? Math.min(1, s.sit + dt * SIT_DOWN) : Math.max(0, s.sit - dt * SIT_UP);
    if (s.sit > 0.12) desired = 0;
    const accel = desired > s.speed ? 5 : 7;
    s.speed += (desired - s.speed) * Math.min(1, dt * accel);
    if (s.speed < 2 && desired === 0) s.speed = 0;

    if (s.speed > 0 && distance > 0.001) {
      const step = Math.min(distance, s.speed * dt);
      s.pos.x += (dx / distance) * step;
      s.pos.z += (dz / distance) * step;
      if (distance > STOP * 0.6) {
        const turn = 1 - Math.exp(-dt * (s.speed > GALLOP_AT ? 7 : 10));
        s.heading += shortestAngle(s.heading, want) * turn;
      }
    } else if (distance > 12 && s.sit < 0.05) {
      s.heading += shortestAngle(s.heading, want) * (1 - Math.exp(-dt * 2.5));
    }

    node.position.set(s.pos.x, 0, s.pos.z);
    node.rotation.y = s.heading;

    const next = s.speed > GALLOP_AT ? "Gallop" : s.speed > WALK_AT ? "Walk" : "Idle";
    if (next !== s.clip) {
      const from = actions[s.clip];
      const to = actions[next];
      if (to) {
        to.reset().setEffectiveWeight(1).play();
        if (from) to.crossFadeFrom(from, next === "Idle" ? 0.35 : 0.22, true);
      }
      s.clip = next;
    }
    const current = actions[s.clip];
    if (current) {
      if (s.clip === "Walk") current.timeScale = THREE.MathUtils.clamp(s.speed / WALK_PACE, 0.6, 1.8);
      else if (s.clip === "Gallop") current.timeScale = THREE.MathUtils.clamp(s.speed / GALLOP_PACE, 0.75, 1.5);
      else current.timeScale = 1;
    }

    applySit(animation.sit, s.sit);
    pace.busy = s.speed > 0 || (s.sit > 0 && s.sit < 1) || performance.now() - pointer.moved < 400;
  });

  return (
    <group ref={group} visible={false}>
      <group ref={fit}>
        <primitive object={scene} />
      </group>
      <mesh rotation-x={-Math.PI / 2} position-y={0.4} scale={[HEIGHT * 1.15, HEIGHT * 0.75, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} opacity={0.75} />
      </mesh>
    </group>
  );
}

function Pacer() {
  const invalidate = useThree((three) => three.invalidate);
  useEffect(() => {
    let frame = 0;
    let count = 0;
    const tick = () => {
      count += 1;
      if (pace.busy || count % 2 === 0) invalidate();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [invalidate]);
  return null;
}

useGLTF.preload(MODEL);

export default function DogCursor() {
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.seen = true;
      pointer.moved = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[69]">
      <Canvas
        orthographic
        dpr={1}
        frameloop="demand"
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        camera={{ position: [0, 820, 620], zoom: 1, near: 1, far: 4000 }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
        style={{ pointerEvents: "none" }}
      >
        <hemisphereLight args={["#fffaf2", "#6b6157", 1.25]} />
        <directionalLight position={[260, 900, 520]} intensity={1.7} />
        <directionalLight position={[-400, 300, -300]} intensity={0.5} color="#bcd7ff" />
        <Pacer />
        <Dog />
      </Canvas>
    </div>
  );
}
