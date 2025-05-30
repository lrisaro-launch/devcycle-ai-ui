import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type ProcessedFileContextType = {
  result: any;
  setResult: (result: any) => void;
};

const ProcessedFileContext = createContext<ProcessedFileContextType | undefined>(undefined);

export const useProcessedFile = () => {
  const context = useContext(ProcessedFileContext);
  if (!context) throw new Error("useProcessedFile must be used within a ProcessedFileProvider");
  return context;
};

export const ProcessedFileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [result, setResultState] = useState<any>(() => {
    const saved = localStorage.getItem("processedFileResult");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (result) {
      localStorage.setItem("processedFileResult", JSON.stringify(result));
    } else {
      localStorage.removeItem("processedFileResult");
    }
  }, [result]);

  const setResult = (data: any) => {
    setResultState(data);
  };

  return (
    <ProcessedFileContext.Provider value={{ result, setResult }}>
      {children}
    </ProcessedFileContext.Provider>
  );
};