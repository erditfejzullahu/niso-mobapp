import { create } from "zustand";

export type AppToastType = "success" | "error" | "info";

export type AppToastShowInput = {
  type?: AppToastType | string;
  text1?: string;
  text2?: string;
  visibilityTime?: number;
  autoHide?: boolean;
  /** Fired when the user taps the toast (before it hides). */
  onPress?: () => void;
};

type State = {
  visible: boolean;
  /** True while playing the close animation; content is still shown. */
  exiting: boolean;
  toastType: AppToastType;
  text1?: string;
  text2?: string;
  toastOnPress?: () => void;
  hideTimer: ReturnType<typeof setTimeout> | null;
  show: (p: AppToastShowInput) => void;
  /** Starts close animation (host calls finishDismiss when done). */
  hide: () => void;
  finishDismiss: () => void;
};

function normalizeType(t?: string | null): AppToastType {
  if (t === "error" || t === "info" || t === "success") return t;
  return "success";
}

export const useAppToastStore = create<State>((set, get) => ({
  visible: false,
  exiting: false,
  toastType: "success",
  text1: undefined,
  text2: undefined,
  toastOnPress: undefined,
  hideTimer: null,

  show: (p) => {
    const prev = get().hideTimer;
    if (prev) clearTimeout(prev);

    const autoHide = p.autoHide !== false;
    const ms = autoHide ? Math.max(800, p.visibilityTime ?? 4000) : 0;

    set({
      visible: true,
      exiting: false,
      toastType: normalizeType(p.type),
      text1: p.text1,
      text2: p.text2,
      toastOnPress: p.onPress,
      hideTimer: null,
    });

    if (ms > 0) {
      const t = setTimeout(() => get().hide(), ms);
      set({ hideTimer: t });
    }
  },

  hide: () => {
    const t = get().hideTimer;
    if (t) clearTimeout(t);
    const { visible, exiting } = get();
    if (!visible || exiting) return;
    set({ hideTimer: null, exiting: true });
  },

  finishDismiss: () => {
    set({
      visible: false,
      exiting: false,
      hideTimer: null,
      text1: undefined,
      text2: undefined,
      toastOnPress: undefined,
    });
  },
}));
