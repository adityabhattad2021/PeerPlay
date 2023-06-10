import { useContext,createContext } from "react";


const StateContext = createContext();

export function StateContextProvider({children}){

    const working = true;

    return (
        <StateContext.Provider value={{
            working
        }}>
            {children}
        </StateContext.Provider>
    )
}


export function useStateContext(){
    return useContext(StateContext);
}