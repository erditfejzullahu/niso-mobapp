import type { AppToastShowInput } from "@/store/useAppToastStore";
import { useAppToastStore } from "@/store/useAppToastStore";

const Toast = {
  show(params: AppToastShowInput) {
    useAppToastStore.getState().show(params);
  },
  hide() {
    useAppToastStore.getState().hide();
  },
};

export default Toast;
