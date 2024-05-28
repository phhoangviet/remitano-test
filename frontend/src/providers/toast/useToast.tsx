import React, { useContext } from "react";
import { IToastContext } from "./ToastProvider";

export const ToastContext = React.createContext<IToastContext>({
  error: (message: string) => {},
  warn: (message: string) => {},
  info: (message: string) => {},
  success: (message: string) => {},
  hide: (message: string) => {},
});

export const useToast = () => useContext(ToastContext);
