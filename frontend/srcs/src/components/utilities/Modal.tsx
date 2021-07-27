import React, { useEffect } from "react";
import ReactDOM from "react-dom";

function ModalOverlay() {
  return (
    <div className="fixed top-0 left-0 z-40 w-full h-full bg-black opacity-25" />
  );
}

type ModalWrapperProps = {
  children?: JSX.Element | JSX.Element[];
};

function ModalWrapper({ children }: ModalWrapperProps) {
  return (
    <div
      className="fixed top-0 left-0 z-50 w-full h-full p-4 overflow-x-hidden overflow-y-auto outline-none"
      aria-modal
      aria-hidden
      tabIndex={-1}
      role="dialog"
    >
      {children}
    </div>
  );
}

type ModalCloseButtonProps = {
  onClick: () => void;
};

function ModalCloseButton({ onClick }: ModalCloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-dismiss="modal"
      aria-label="Close"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  );
}

type ModalHeaderProps = {
  hide: () => void;
  title: string;
};

function ModalHeader({ hide, title }: ModalHeaderProps) {
  return (
    <div className="flex justify-between">
      <span>{title}</span>
      <ModalCloseButton onClick={hide}></ModalCloseButton>
    </div>
  );
}

export type ModalProps = {
  visible: boolean;
  hide: () => void;
  title: string;
  children?: JSX.Element | JSX.Element[];
};

export function Modal({ visible, hide, title, children }: ModalProps) {
  useEffect(() => {
    // Disable scrolling if invisible
    if (visible) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [visible]);

  if (!visible) return null;

  return ReactDOM.createPortal(
    <React.Fragment>
      <ModalOverlay />
      <ModalWrapper>
        <div className="relative z-30 max-w-xl p-4 m-auto bg-white border-r-2">
          <ModalHeader hide={hide} title={title} />
          {children}
        </div>
      </ModalWrapper>
    </React.Fragment>,
    document.body
  );
}

Modal.defaultProps = {
  title: "",
};
