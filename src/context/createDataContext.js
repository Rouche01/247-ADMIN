import React, { createContext, useEffect, useReducer } from "react";

const createDataContext = (
  reducer,
  initialState,
  actions,
  persist,
  storeData
) => {
  const Context = createContext();

  const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState, () => {
      if (persist) {
        const localData = localStorage.getItem("247auth");
        return localData ? JSON.parse(localData) : {};
      } else {
        return { ...initialState };
      }
    });

    useEffect(() => {
      if (persist) {
        storeData(state);
      }
    }, [state]);

    const boundActions = {};

    for (let key in actions) {
      boundActions[key] = actions[key](dispatch);
    }

    return (
      <Context.Provider value={{ state, ...boundActions }}>
        {children}
      </Context.Provider>
    );
  };

  return { Context, Provider };
};

export default createDataContext;
