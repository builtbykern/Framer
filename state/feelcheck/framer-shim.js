export const ControlType = new Proxy({}, { get: (_t, key) => String(key) })
export function addPropertyControls() {}
export function useIsStaticRenderer() { return false }
