import { useEffect } from "react";

const useBeforeUnload = (callback: () => void, message?: string) => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      callback();

      event.preventDefault();
      if (message) {
        event.returnValue = message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [callback, message]);
};

export default useBeforeUnload;
