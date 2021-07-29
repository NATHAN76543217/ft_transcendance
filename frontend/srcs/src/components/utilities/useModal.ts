import { useState } from "react";

export function useModal(initiallyVisible = false) {
  const [visible, _setVisible] = useState(initiallyVisible);

  function setVisible(visible: boolean) {
    if (visible) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "unset";
    }
    _setVisible(visible);
  }

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
