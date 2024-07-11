"use client";

import React, { createContext, useState } from 'react';

export const MainContext = createContext({})

const MainContextContainer = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLogin, setIsLogin] = useState(false);
    const [isAdmin, setIsAdmin] = useState(0);
    const [forceGetUserInfo, setForceGetUserInfo] = useState(0);
    console.log(forceGetUserInfo);

    return (
        <MainContext.Provider value={{
            user,
            setUser,
            isLogin,
            setIsLogin,
            isLoading,
            setIsLoading,
            isAdmin,
            setIsAdmin,
            forceGetUserInfo,
            setForceGetUserInfo,
        }}>
            {children}
        </MainContext.Provider>
    );
}

export default MainContextContainer;
