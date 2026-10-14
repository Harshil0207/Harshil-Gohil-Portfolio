"use client";

import "@/lib/three-console";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Color, ShaderMaterial, Texture } from "three";

const vertexShader = /* glsl */ `
varying vec2 vUv;
uniform float uVelocity;
void main(){
  vUv = uv;
  vec3 pos = position;
  // A gentle cylindrical bow, deepened by scroll velocity.
  float bow = sin(uv.x * 3.14159);
  pos.z += bow * (0.06 + uVelocity * 0.35);
  pos.y += bow * uVelocity * 0.12;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uVelocity;
uniform vec3 uAccent;

void main(){
  vec2 uv = vUv;
  float split = clamp(abs(uVelocity), 0.0, 1.0) * 0.014;

  float r = texture2D(uTexture, uv + vec2(split, 0.0)).r;
  float g = texture2D(uTexture, uv).g;
  float b = texture2D(uTexture, uv - vec2(split, 0.0)).b;
  vec3 color = vec3(r, g, b);

  // Accent bleeds in from the edges, strongest while moving.
  float edge = 1.0 - smoothstep(0.0, 0.42, min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y)));
  color = mix(color, uAccent, edge * (0.10 + abs(uVelocity) * 0.25));

  gl_FragColor = vec4(color, 1.0);
}
`;

function Plane({ image, accent }: { image: string; accent: string }) {
  const material = useRef<ShaderMaterial>(null);
  const texture = useTexture(image);
  const { viewport } = useThree();
  const lastScroll = useRef(0);
  const velocity = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uVelocity: { value: 0 },
      uAccent: { value: new Color(accent) },
    }),
    [texture, accent],
  );

  useFrame((_, delta) => {
    const shader = material.current;
    if (!shader) return;

    const current = window.scrollY;
    const raw = (current - lastScroll.current) / Math.max(delta, 0.001) / 4000;
    lastScroll.current = current;

    velocity.current += (raw - velocity.current) * Math.min(1, delta * 5);
    shader.uniforms.uVelocity.value = velocity.current;
    (shader.uniforms.uTexture.value as Texture) = texture;
    shader.uniforms.uAccent.value.set(accent);
  });

  const width = viewport.width;

  return (
    // Matched to the capture viewport the shot pipeline uses, which is also the
    // ratio `.shot-plate` reserves.
    <mesh scale={[width, (width * 780) / 1440, 1]}>
      <planeGeometry args={[1, 1, 48, 32]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function CaseHero({
  image,
  accent,
  onContextLost,
}: {
  image: string;
  accent: string;
  onContextLost?: () => void;
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5], fov: 30 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", () =>
          onContextLost?.(),
        );
      }}
    >
      <Plane image={image} accent={accent} />
    </Canvas>
  );
}
