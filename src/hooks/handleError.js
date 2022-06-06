import { useEffect } from "react";
import { toast } from "react-hot-toast";

const ERROR_DISPLAY_DURATION = 3000;

export const useToastError = (error, cb) => {
  useEffect(() => {
    if (error) {
      toast.error(error, { duration: ERROR_DISPLAY_DURATION });
    }

    setTimeout(() => cb(), ERROR_DISPLAY_DURATION);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);
};
