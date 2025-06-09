import { useEffect } from "react";
import { useCodeModal } from "./CodeModalContext";

export function CodeModalInitializer() {
  const { openModal } = useCodeModal();

  useEffect(() => {
    window.__codeModalContext = { openModal };
    return () => {
      delete window.__codeModalContext;
    };
  }, [openModal]);

  return null;
}