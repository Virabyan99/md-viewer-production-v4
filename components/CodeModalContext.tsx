import { createContext, useContext, useState } from "react";

interface CodeModalContextType {
  openModal: (code: string, language: string) => void;
  closeModal: () => void;
  isOpen: boolean;
  code: string;
  language: string;
}

const CodeModalContext = createContext<CodeModalContextType | undefined>(undefined);

export function CodeModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");

  const openModal = (code: string, language: string) => {
    setCode(code);
    setLanguage(language);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <CodeModalContext.Provider value={{ openModal, closeModal, isOpen, code, language }}>
      {children}
    </CodeModalContext.Provider>
  );
}

export function useCodeModal() {
  const context = useContext(CodeModalContext);
  if (!context) {
    throw new Error("useCodeModal must be used within a CodeModalProvider");
  }
  return context;
}