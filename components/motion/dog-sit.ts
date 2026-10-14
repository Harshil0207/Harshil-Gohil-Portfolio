import * as THREE from "three";

export type SitPose = {
  offsets: [string, number, number, number][];
  bones: [string, number][];
};

export const SIT_POSE: SitPose = {
  offsets: [
    ["Body", 0, -1, 0.4],
    ["IKBackLegL", 0, 0, 0.45],
    ["IKBackLegR", 0, 0, 0.45],
  ],
  bones: [
    ["Back", -40],
    ["FrontShoulderL", 40],
    ["FrontShoulderR", 40],
    ["BackLegL", -55],
    ["BackLegR", -55],
    ["Neck1", 12],
    ["Head", 18],
  ],
};

export type SitRig = {
  root: THREE.Object3D;
  offsets: { bone: THREE.Object3D; delta: THREE.Vector3 }[];
  bones: { bone: THREE.Object3D; angle: number }[];
  rest: { bone: THREE.Object3D; position: THREE.Vector3; quaternion: THREE.Quaternion }[];
};

export function createSitRig(root: THREE.Object3D, pose: SitPose = SIT_POSE): SitRig {
  const offsets = pose.offsets
    .map(([name, x, y, z]) => ({ bone: root.getObjectByName(name), delta: new THREE.Vector3(x, y, z) }))
    .filter((entry): entry is { bone: THREE.Object3D; delta: THREE.Vector3 } => Boolean(entry.bone));
  const bones = pose.bones
    .map(([name, angle]) => ({ bone: root.getObjectByName(name), angle: THREE.MathUtils.degToRad(angle) }))
    .filter((entry): entry is { bone: THREE.Object3D; angle: number } => Boolean(entry.bone));
  const touched = new Set<THREE.Object3D>([...offsets.map((o) => o.bone), ...bones.map((b) => b.bone)]);
  const rest = [...touched].map((bone) => ({
    bone,
    position: bone.position.clone(),
    quaternion: bone.quaternion.clone(),
  }));
  return { root, offsets, bones, rest };
}

export function restoreSit(rig: SitRig) {
  for (const { bone, position, quaternion } of rig.rest) {
    bone.position.copy(position);
    bone.quaternion.copy(quaternion);
  }
}

const rootInverse = new THREE.Quaternion();
const parentQuat = new THREE.Quaternion();
const twist = new THREE.Quaternion();
const axis = new THREE.Vector3(1, 0, 0);
const local = new THREE.Quaternion();

export function applySit(rig: SitRig, weight: number) {
  if (weight <= 0.0001) return;
  const w = weight * weight * (3 - 2 * weight);
  rig.root.updateWorldMatrix(true, false);
  rig.root.getWorldQuaternion(rootInverse).invert();
  for (const { bone, delta } of rig.offsets) bone.position.addScaledVector(delta, w);
  for (const { bone, angle } of rig.bones) {
    const parent = bone.parent;
    if (!parent) continue;
    parent.updateWorldMatrix(true, false);
    parent.getWorldQuaternion(parentQuat).premultiply(rootInverse);
    twist.setFromAxisAngle(axis, angle * w);
    local.copy(parentQuat).invert().multiply(twist).multiply(parentQuat);
    bone.quaternion.premultiply(local);
  }
}
