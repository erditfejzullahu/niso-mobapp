import { create } from "zustand";

interface ToggleState {
    isOpened: boolean;
    toggle: () => void;
    setToggled: (value: boolean) => void;
}

export const useToggleNotifications = create<ToggleState>((set) => ({
    isOpened: false,
    toggle: () => set((state) => ({isOpened: !state.isOpened})),
    setToggled: (value) => set({isOpened: value})
}))