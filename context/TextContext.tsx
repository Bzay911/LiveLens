import React, {useState, createContext, useContext, ReactNode} from 'react'

interface TextContextType {
    text: string;
    setText: (text: string) => void;
}

interface TextContextProviderProps {
  children: ReactNode; 
}

const TextContext = createContext<TextContextType | undefined>(undefined);

export const TextContextProvider: React.FC<TextContextProviderProps> = ({ children }) => {
    const [text, setText] = useState("");

    return(
        <TextContext.Provider value={{text, setText}}>
            {children}
        </TextContext.Provider>
    )
}

export const useTextContext = () => {
    const context = useContext(TextContext);
    if(!context){
        throw new Error("useTextContext must be used within a TextContextProvider");
    }
    return context;
}