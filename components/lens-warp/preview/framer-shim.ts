export const ControlType = {
    Number: "number",
    Boolean: "boolean",
    Color: "color",
    String: "string",
    ResponsiveImage: "responsiveimage",
    Array: "array",
    Object: "object",
} as const

export function addPropertyControls(
    _component: unknown,
    _controls: unknown
): void {}

export function useIsStaticRenderer(): boolean {
    return false
}
