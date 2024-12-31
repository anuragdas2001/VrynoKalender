import { toast, ToastOptions } from "react-toastify";
import InformationFillIcon from "remixicon-react/InformationFillIcon";
import ErrorWarningFillIcon from "remixicon-react/ErrorWarningFillIcon";
import AlertFillIcon from "remixicon-react/AlertFillIcon";
import CheckboxCircleFillIcon from "remixicon-react/CheckboxCircleFillIcon";

export const Toast: {
  error: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
  success: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
} = {
  error(message: string, options?: ToastOptions) {
    return toast.error(message, {
      ...{
        icon: <ErrorWarningFillIcon />,
      },
      ...options,
    });
  },
  warning(message: string, options?: ToastOptions) {
    return toast.warn(message, {
      ...{
        icon: <AlertFillIcon />,
      },
      ...options,
    });
  },
  success(message: string, options?: ToastOptions) {
    return toast.success(message, {
      ...{
        icon: <CheckboxCircleFillIcon />,
      },
      ...options,
    });
  },
  info(message: string, options?: ToastOptions) {
    return toast.info(message, {
      ...{
        icon: <InformationFillIcon />,
      },
      ...options,
    });
  },
};
