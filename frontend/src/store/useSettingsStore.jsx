import { create } from "zustand";

export const useSettingsStore = create((set, get) => ({
  soundNotification: localStorage.getItem("sound-notification") === "true",
  setSoundNotification: (value) => {
    localStorage.setItem("sound-notification", value);
    set({ soundNotification: value });
  },
}));