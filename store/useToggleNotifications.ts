import { create } from "zustand";

interface ToggleState {
    isClosed: boolean;
    toggle: () => void;
    setToggled: (value: boolean) => void;
}

export const useToggleNotifications = create<ToggleState>((set) => ({
    isClosed: true,
    toggle: () => set((state) => ({isClosed: !state.isClosed})),
    setToggled: (value) => set({isClosed: value})
}))