"use client";

import React, { createContext, useState } from 'react';

export const MainContext = createContext({})

const MainContextContainer = ({ children }) => {
    const [user, setUser] = useState(null);
    const [check, setCheck] = useState(0);

    return (
        <MainContext.Provider value={{
            user,
            setUser,
            check,
            setCheck,
        }}>
            {children}
        </MainContext.Provider>
    );
}

export default MainContextContainer;
