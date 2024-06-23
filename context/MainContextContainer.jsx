"use client";

import React, { createContext, useState } from 'react';

export const MainContext = createContext({})

const MainContextContainer = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <MainContext.Provider value={{
            user,
            setUser
        }}>
            {children}
        </MainContext.Provider>
    );
}

export default MainContextContainer;
