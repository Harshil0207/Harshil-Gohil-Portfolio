import { setConsoleFunction } from "three";

// @react-three/fiber (<=9.8) still constructs THREE.Clock internally, which
// three r183+ flags as deprecated on every <Canvas> mount. Drop that one
// message; everything else passes through untouched.
const SILENCED = "THREE.Clock: This module has been deprecated";

setConsoleFunction((type, message, ...params) => {
  if (typeof message === "string" && message.startsWith(SILENCED)) return;
  console[type as "log" | "warn" | "error"](message, ...params);
});
