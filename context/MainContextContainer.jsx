"use client";

import React, { createContext, useState } from 'react';

export const MainContext = createContext({})

const MainContextContainer = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLogin, setIsLogin] = useState(false);

    return (
        <MainContext.Provider value={{
            user,
            setUser,
            isLogin,
            setIsLogin,
            isLoading,
            setIsLoading,
        }}>
            {children}
        </MainContext.Provider>
    );
}

export default MainContextContainer;
