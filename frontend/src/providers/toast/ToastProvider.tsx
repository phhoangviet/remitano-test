import React, { ReactElement, useState } from "react";
import { ToastContext } from "./useToast";
import { Alert, AlertColor, Snackbar } from "@mui/material";
export interface IToastContext {
  error: (message: string) => void;
  warn: (message: string) => void;
  info: (message: string) => void;
  success: (message: string) => void;
  hide: (message: string) => void;
}

export const ToastProvider = (props: { children: ReactElement }) => {
  const { children } = props;
  const [state, setState] = useState<{
    isOpen: boolean;
    message?: { type: string; text: string };
  }>({
    isOpen: false,
  });

  const show = (message: { type: string; text: string }) => {
    setState({ isOpen: true, message });
  };

  const hide = () => setState({ isOpen: false });

  const error = (message: string) => {
    show({ type: "error", text: message });
  };

  const warn = (message: string) => {
    show({ type: "warning", text: message });
  };

  const info = (message: string) => {
    show({ type: "info", text: message });
  };

  const success = (message: string) => {
    show({ type: "success", text: message });
  };
  const { isOpen, message } = state;
  return (
    <ToastContext.Provider
      value={{
        error: error,
        warn: warn,
        info: info,
        success: success,
        hide: hide,
      }}
    >
      {children}
      {message && (
        <Snackbar
          open={isOpen}
          autoHideDuration={3000}
          onClose={hide}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          style={{ width: "50%", maxWidth: "200px" }}
        >
          <Alert
            variant="filled"
            onClose={hide}
            severity={(message?.type || "") as AlertColor}
          >
            {message?.text || ""}
          </Alert>
        </Snackbar>
      )}
    </ToastContext.Provider>
  );
};
