import { useState } from "react";

export function useModal(initiallyVisible = false) {
  const [visible, setVisible] = useState(initiallyVisible);

  function toggle() {
    setVisible(!visible);
  }

  function hide() {
    if (visible) setVisible(false);
  }

  function show() {
    if (!visible) setVisible(true);
  }

  return {
    visible,
    toggle,
    hide,
    show,
  };
}
