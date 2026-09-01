// state/feelcheck/framer-shim.js
var ControlType = new Proxy({}, { get: (_t, key) => String(key) });
function addPropertyControls() {
}
function useIsStaticRenderer() {
  return false;
}

// code-components/Kern_FillingPoint.tsx
import {
  motion,
  useReducedMotion
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var MAX_COLORS = 3;
var MAX_DELAY_MS = 280;
var DEFAULT_DELAY_STEP_MS = 90;
var SCALE_HIDDEN = 0.06;
var EASE_OUT = [0.23, 1, 0.32, 1];
var CINEMATIC_ENTER = {
  type: "tween",
  duration: 0.48,
  ease: EASE_OUT
};
var CINEMATIC_EXIT = {
  type: "tween",
  duration: 0.6,
  ease: EASE_OUT
};
var BALANCED_ENTER = {
  type: "tween",
  duration: 0.36,
  ease: EASE_OUT
};
var BALANCED_EXIT = {
  type: "tween",
  duration: 0.44,
  ease: EASE_OUT
};
var SNAPPY_ENTER = {
  type: "tween",
  duration: 0.24,
  ease: EASE_OUT
};
var SNAPPY_EXIT = {
  type: "tween",
  duration: 0.3,
  ease: EASE_OUT
};
var MOTION_PRESETS = {
  cinematic: {
    enter: CINEMATIC_ENTER,
    exit: CINEMATIC_EXIT,
    exitDurationMs: 600
  },
  balanced: {
    enter: BALANCED_ENTER,
    exit: BALANCED_EXIT,
    exitDurationMs: 440
  },
  snappy: {
    enter: SNAPPY_ENTER,
    exit: SNAPPY_EXIT,
    exitDurationMs: 300
  }
};
var ENTER_OPACITY_DURATION = 0.09;
var EXIT_OPACITY_DURATION = 0.1;
var EXIT_LOCK_BUFFER_MS = 80;
var REDUCED_FILL_DURATION = 0.2;
var PRESS_FILL_IN = 0.12;
var PRESS_FILL_OUT = 0.08;
var FINE_POINTER_MQ = "(hover: hover) and (pointer: fine)";
var LABEL_INK = "#FFFFFF";
function washBackground(color) {
  return `radial-gradient(circle at center, ${color} 0%, ${color} 48%, transparent 72%)`;
}
var DEFAULT_FILLS = [
  { color: "#FFFFFF", delay: 0 },
  { color: "#6FD3FF", delay: 90 },
  { color: "#276BFF", delay: 180 }
];
function transitionDurationMs(transition, fallbackMs) {
  const duration = transition.duration;
  return typeof duration === "number" && Number.isFinite(duration) ? Math.max(0, duration * 1e3) : fallbackMs;
}
function resolveMotion(preset, enterTransition, exitTransition, legacyTransition) {
  if (preset !== "custom") return MOTION_PRESETS[preset];
  const legacyShared = legacyTransition ?? enterTransition;
  const enter = enterTransition ?? legacyShared ?? CINEMATIC_ENTER;
  const exit = exitTransition ?? legacyShared ?? CINEMATIC_EXIT;
  return {
    enter,
    exit,
    exitDurationMs: transitionDurationMs(exit, 600)
  };
}
function clampDelay(value, fallback = 0) {
  const n = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  return Math.max(0, Math.min(MAX_DELAY_MS, Math.round(n)));
}
function pointInElement(el, clientX, clientY) {
  const rect = el.getBoundingClientRect();
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}
function coverForElement(el) {
  const rect = el.getBoundingClientRect();
  return Math.max(rect.width, rect.height) * 3.4 || 960;
}
function resolveFills(fills, fillColors, fillColor) {
  if (Array.isArray(fills) && fills.length > 0) {
    return fills.slice(0, MAX_COLORS).map((item, index) => ({
      color: typeof item?.color === "string" && item.color.length > 0 ? item.color : DEFAULT_FILLS[index]?.color ?? "#FFFFFF",
      delay: clampDelay(item?.delay, index * DEFAULT_DELAY_STEP_MS)
    }));
  }
  if (Array.isArray(fillColors) && fillColors.length > 0) {
    return fillColors.slice(0, MAX_COLORS).map((color, index) => ({
      color: typeof color === "string" ? color : "#FFFFFF",
      delay: clampDelay(index * DEFAULT_DELAY_STEP_MS)
    }));
  }
  if (typeof fillColor === "string" && fillColor.length > 0) {
    return [{ color: fillColor, delay: 0 }];
  }
  return DEFAULT_FILLS.map((f) => ({ ...f }));
}
function emptyLayers(stops) {
  return stops.map((stop) => ({
    color: stop.color,
    delay: stop.delay,
    originX: 0,
    originY: 0,
    coverSize: 960,
    filled: false
  }));
}
function fillsKey(stops) {
  return stops.map((s) => `${s.color}:${s.delay}`).join("|");
}
function Kern_FillingPoint(props) {
  const {
    label = "Get started",
    link = "",
    newTab = false,
    baseFill = "#060606",
    fills: fillsProp,
    fillStyle = "solid",
    motionPreset: motionPresetProp,
    fillColors,
    fillColor,
    labelColor: _labelColor = "#FFFFFF",
    padding = "14px 28px",
    borderRadius = "999px",
    font = {},
    fillTransition,
    enterTransition,
    exitTransition,
    style
  } = props;
  const fills = resolveFills(fillsProp, fillColors, fillColor);
  const motionPreset = motionPresetProp ?? (fillTransition || enterTransition || exitTransition ? "custom" : "cinematic");
  const {
    enter: resolvedEnterTransition,
    exit: resolvedExitTransition,
    exitDurationMs: resolvedExitDurationMs
  } = resolveMotion(
    motionPreset,
    enterTransition,
    exitTransition,
    fillTransition
  );
  const isStatic = useIsStaticRenderer();
  const prefersReducedMotion = useReducedMotion();
  const key = fillsKey(fills);
  const rootRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const timersRef = useRef([]);
  const hoveringRef = useRef(false);
  const exitingRef = useRef(false);
  const fillsKeyRef = useRef(key);
  const fillsRef = useRef(fills);
  fillsRef.current = fills;
  const originLocksRef = useRef([]);
  const [layers, setLayers] = useState(() => emptyLayers(fills));
  const [pressed, setPressed] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [forcedFill, setForcedFill] = useState(false);
  const accessibleName = (label || "").trim() || "Button";
  const hasLink = typeof link === "string" && link.length > 0;
  const isFixedWidth = style?.width === "100%";
  const useOpacityPath = Boolean(prefersReducedMotion) || forcedFill || !canHover;
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(FINE_POINTER_MQ);
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    if (fillsKeyRef.current === key) return;
    if (hoveringRef.current || exitingRef.current) return;
    fillsKeyRef.current = key;
    originLocksRef.current = [];
    setLayers(emptyLayers(fillsRef.current));
  }, [key]);
  useEffect(() => {
    return () => {
      if (typeof window === "undefined") return;
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, []);
  const clearTimers = useCallback(() => {
    if (typeof window === "undefined") return;
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);
  const resolveElement = useCallback(
    (target) => {
      if (target instanceof Element) return target;
      return rootRef.current;
    },
    []
  );
  const syncFromEvent = useCallback(
    (event) => {
      const el = resolveElement(event.currentTarget);
      if (!el) return;
      pointerRef.current = pointInElement(
        el,
        event.clientX,
        event.clientY
      );
    },
    [resolveElement]
  );
  const activateLayer = useCallback(
    (index, point, coverSize) => {
      originLocksRef.current[index] = {
        x: point.x,
        y: point.y,
        coverSize
      };
      setLayers((prev) => {
        const next = [...prev];
        const base = next[index];
        if (!base) return prev;
        next[index] = {
          ...base,
          originX: point.x,
          originY: point.y,
          coverSize,
          filled: true
        };
        return next;
      });
    },
    []
  );
  const deactivateLayer = useCallback((index) => {
    setLayers((prev) => {
      const next = [...prev];
      const base = next[index];
      if (!base) return prev;
      const lock = originLocksRef.current[index];
      next[index] = {
        ...base,
        originX: lock?.x ?? base.originX,
        originY: lock?.y ?? base.originY,
        coverSize: lock?.coverSize ?? base.coverSize,
        filled: false
      };
      return next;
    });
  }, []);
  const schedule = useCallback((delayMs, run) => {
    if (delayMs <= 0) {
      run();
      return;
    }
    if (typeof window === "undefined") return;
    const id = window.setTimeout(run, delayMs);
    timersRef.current.push(id);
  }, []);
  const startCascadeIn = useCallback(
    (event) => {
      if (isStatic || !canHover) return;
      if (hoveringRef.current) {
        syncFromEvent(event);
        return;
      }
      clearTimers();
      exitingRef.current = false;
      hoveringRef.current = true;
      syncFromEvent(event);
      const el = resolveElement(event.currentTarget);
      const coverSize = el ? coverForElement(el) : 800;
      const start = { ...pointerRef.current };
      originLocksRef.current = fills.map(() => ({
        x: start.x,
        y: start.y,
        coverSize
      }));
      setLayers(
        fills.map((stop) => ({
          color: stop.color,
          delay: stop.delay,
          originX: start.x,
          originY: start.y,
          coverSize,
          filled: false
        }))
      );
      fills.forEach((stop, index) => {
        schedule(stop.delay, () => {
          if (!hoveringRef.current) return;
          const live = rootRef.current;
          const size = live ? coverForElement(live) : coverSize;
          activateLayer(index, start, size);
        });
      });
    },
    [
      activateLayer,
      canHover,
      clearTimers,
      fills,
      isStatic,
      resolveElement,
      schedule,
      syncFromEvent
    ]
  );
  const startCascadeOut = useCallback(() => {
    if (!hoveringRef.current) return;
    clearTimers();
    hoveringRef.current = false;
    exitingRef.current = true;
    const maxDelay = fills.reduce(
      (max, stop) => Math.max(max, stop.delay),
      0
    );
    fills.forEach((_stop, index) => {
      const reverseDelay = fills[fills.length - 1 - index]?.delay ?? maxDelay;
      schedule(reverseDelay, () => {
        deactivateLayer(index);
      });
    });
    schedule(
      maxDelay + resolvedExitDurationMs + EXIT_LOCK_BUFFER_MS,
      () => {
        exitingRef.current = false;
      }
    );
  }, [
    clearTimers,
    deactivateLayer,
    fills,
    resolvedExitDurationMs,
    schedule
  ]);
  const onPointerEnter = useCallback(
    (event) => {
      if (!canHover) return;
      startCascadeIn(event);
    },
    [canHover, startCascadeIn]
  );
  const onPointerLeave = useCallback(() => {
    setPressed(false);
    setForcedFill(false);
    if (canHover) startCascadeOut();
  }, [canHover, startCascadeOut]);
  const onPointerMove = useCallback(
    (event) => {
      if (!canHover || !hoveringRef.current) return;
      syncFromEvent(event);
    },
    [canHover, syncFromEvent]
  );
  const onPointerDown = useCallback(() => {
    setPressed(true);
    if (!canHover) setForcedFill(true);
  }, [canHover]);
  const onPointerUp = useCallback(() => {
    setPressed(false);
    if (!canHover) setForcedFill(false);
  }, [canHover]);
  const onKeyDown = useCallback(
    (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      if (!hasLink) event.preventDefault();
      if (event.repeat) return;
      setPressed(true);
      setForcedFill(true);
    },
    [hasLink]
  );
  const onKeyUp = useCallback((event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    setPressed(false);
    setForcedFill(false);
  }, []);
  const onFocus = useCallback(
    (event) => {
      if (!canHover) {
        setForcedFill(true);
        return;
      }
      if (event.currentTarget.matches(":focus-visible")) {
        setForcedFill(true);
      }
    },
    [canHover]
  );
  const onBlur = useCallback(() => {
    setPressed(false);
    setForcedFill(false);
  }, []);
  const rootStyle = {
    ...style,
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    margin: 0,
    padding,
    overflow: "hidden",
    cursor: "pointer",
    userSelect: "none",
    textDecoration: "none",
    border: "none",
    appearance: "none",
    WebkitAppearance: "none",
    backgroundColor: baseFill,
    borderRadius,
    color: LABEL_INK,
    isolation: "isolate",
    width: isFixedWidth ? "100%" : style?.width ?? "auto",
    height: style?.height ?? "auto",
    minWidth: isFixedWidth ? void 0 : "max-content",
    outline: "none",
    WebkitTapHighlightColor: "transparent"
  };
  const labelStyle = {
    position: "relative",
    zIndex: 2,
    pointerEvents: "none",
    whiteSpace: "nowrap",
    ...font,
    // Locked white ink — difference flips to dark over light fills and stays light on base
    color: LABEL_INK,
    mixBlendMode: "difference"
  };
  const pressTransition = {
    duration: pressed ? 0.14 : 0.18,
    ease: EASE_OUT
  };
  const sharedMotion = {
    ref: rootRef,
    onPointerEnter,
    onPointerLeave,
    onPointerMove,
    onPointerDown,
    onPointerUp,
    onPointerCancel: onPointerUp,
    onKeyDown,
    onKeyUp,
    onFocus,
    onBlur,
    style: rootStyle,
    className: "kern-filling-point",
    initial: false,
    animate: { scale: isStatic ? 1 : pressed ? 0.97 : 1 },
    transition: pressTransition
  };
  const fillLayerNodes = (() => {
    if (isStatic) {
      return null;
    }
    if (useOpacityPath) {
      return layers.map((layer, index) => {
        const opacityOn = layer.filled || forcedFill;
        return /* @__PURE__ */ jsx(
          motion.div,
          {
            "aria-hidden": true,
            initial: false,
            animate: { opacity: opacityOn ? 1 : 0 },
            transition: {
              duration: opacityOn ? forcedFill ? PRESS_FILL_IN : REDUCED_FILL_DURATION : PRESS_FILL_OUT,
              ease: EASE_OUT
            },
            style: {
              position: "absolute",
              inset: 0,
              borderRadius,
              backgroundColor: layer.color,
              pointerEvents: "none",
              zIndex: index
            }
          },
          `opacity-${layer.color}-${index}`
        );
      });
    }
    return layers.map((layer, index) => {
      const lock = originLocksRef.current[index];
      const originX = lock?.x ?? layer.originX;
      const originY = lock?.y ?? layer.originY;
      const coverSize = lock?.coverSize ?? layer.coverSize;
      const transformTransition = layer.filled ? resolvedEnterTransition : resolvedExitTransition;
      const opacityTransition = layer.filled ? {
        duration: ENTER_OPACITY_DURATION,
        ease: EASE_OUT
      } : {
        duration: EXIT_OPACITY_DURATION,
        delay: Math.max(
          0,
          resolvedExitDurationMs / 1e3 - EXIT_OPACITY_DURATION
        ),
        ease: EASE_OUT
      };
      return /* @__PURE__ */ jsx(
        motion.div,
        {
          "aria-hidden": true,
          initial: false,
          animate: {
            transform: `scale(${layer.filled ? 1 : SCALE_HIDDEN})`,
            opacity: layer.filled ? 1 : 0
          },
          transition: {
            transform: transformTransition,
            opacity: opacityTransition
          },
          style: {
            position: "absolute",
            left: originX,
            top: originY,
            width: coverSize,
            height: coverSize,
            marginLeft: -coverSize / 2,
            marginTop: -coverSize / 2,
            borderRadius: "50%",
            background: fillStyle === "soft" ? washBackground(layer.color) : layer.color,
            pointerEvents: "none",
            zIndex: index,
            transformOrigin: "50% 50%",
            willChange: "transform, opacity"
          }
        },
        `origin-${layer.color}-${index}`
      );
    });
  })();
  const children = /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("style", { children: `
                .kern-filling-point:focus-visible {
                    outline: 2px solid Highlight;
                    outline-offset: 3px;
                }
            ` }),
    fillLayerNodes,
    /* @__PURE__ */ jsx("span", { style: labelStyle, children: accessibleName })
  ] });
  if (hasLink) {
    return /* @__PURE__ */ jsx(
      motion.a,
      {
        ...sharedMotion,
        href: link,
        target: newTab ? "_blank" : void 0,
        rel: newTab ? "noopener noreferrer" : void 0,
        children
      }
    );
  }
  return /* @__PURE__ */ jsx(motion.button, { ...sharedMotion, type: "button", children });
}
addPropertyControls(Kern_FillingPoint, {
  label: {
    type: ControlType.String,
    title: "Label",
    defaultValue: "Get started",
    description: "Button text shown on the CTA."
  },
  link: {
    type: ControlType.Link,
    title: "Link",
    defaultValue: "",
    description: "Optional URL. Empty = button without navigation."
  },
  newTab: {
    type: ControlType.Boolean,
    title: "New Tab",
    defaultValue: false,
    description: "Open the link in a new browser tab.",
    hidden: (props) => !props.link
  },
  baseFill: {
    type: ControlType.Color,
    title: "Base",
    defaultValue: "#060606",
    description: "Idle background behind the fill layers."
  },
  fillStyle: {
    type: ControlType.Enum,
    title: "Fill Style",
    options: ["solid", "soft"],
    optionTitles: ["Solid", "Soft"],
    displaySegmentedControl: true,
    defaultValue: "solid",
    description: "Solid gives a crisp paint edge. Soft keeps the feathered legacy wash."
  },
  fills: {
    type: ControlType.Array,
    title: "Fills",
    maxCount: MAX_COLORS,
    description: "Pointer-origin paint layers (max 3). Delay range 0\u2013280ms.",
    control: {
      type: ControlType.Object,
      controls: {
        color: {
          type: ControlType.Color,
          title: "Color",
          defaultValue: "#FFFFFF",
          description: "Fill color for this cascade layer."
        },
        delay: {
          type: ControlType.Number,
          title: "Delay",
          defaultValue: 0,
          min: 0,
          max: MAX_DELAY_MS,
          step: 10,
          unit: "ms",
          description: "Ms after hover before this layer expands (0\u2013280)."
        }
      }
    },
    defaultValue: DEFAULT_FILLS
  },
  labelColor: {
    type: ControlType.Color,
    title: "Label ink",
    defaultValue: "#FFFFFF",
    description: "Ignored \u2014 difference blend locks ink to white so text stays readable on any fill.",
    hidden: () => true
  },
  padding: {
    type: ControlType.Padding,
    title: "Padding",
    defaultValue: "14px 28px",
    description: "Inner spacing around the label."
  },
  borderRadius: {
    type: ControlType.BorderRadius,
    title: "Radius",
    defaultValue: "999px",
    description: "Corner radius of the CTA shape."
  },
  font: {
    type: ControlType.Font,
    title: "Font",
    controls: "extended",
    defaultFontType: "sans-serif",
    displayTextAlignment: false,
    description: "Typography for the label (family, size, weight).",
    defaultValue: {
      fontSize: "16px",
      variant: "Semibold",
      letterSpacing: "-0.01em",
      lineHeight: "1.2em"
    }
  },
  motionPreset: {
    type: ControlType.Enum,
    title: "Motion",
    options: ["cinematic", "balanced", "snappy", "custom"],
    optionTitles: ["Cinematic", "Balanced", "Snappy", "Custom"],
    defaultValue: "cinematic",
    description: "Authored enter/exit pacing. Custom reveals directional controls."
  },
  enterTransition: {
    type: ControlType.Transition,
    title: "Enter",
    defaultValue: CINEMATIC_ENTER,
    description: "Custom transition for the forward paint cascade.",
    hidden: (props) => props.motionPreset !== "custom"
  },
  exitTransition: {
    type: ControlType.Transition,
    title: "Exit",
    defaultValue: CINEMATIC_EXIT,
    description: "Custom transition for the reverse paint cascade.",
    hidden: (props) => props.motionPreset !== "custom"
  },
  fillTransition: {
    type: ControlType.Transition,
    title: "Legacy motion",
    defaultValue: CINEMATIC_ENTER,
    description: "Compatibility control for existing instances.",
    hidden: () => true
  }
});
Kern_FillingPoint.displayName = "Filling Point";
export {
  Kern_FillingPoint as default
};
