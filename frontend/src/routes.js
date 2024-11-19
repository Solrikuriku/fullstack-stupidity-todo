import React from "react";
import { Route, Routes, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage'
import Login from './components/Login'
import Registration from "./components/Registration";

export const useRoutes = (isLogin) => {
    if (isLogin) {
        return (
            <Routes>
                <Route path="/todo" element={<MainPage/>}/>
                <Route path="/login" element={<Navigate replace to="/todo"/>}/>
                <Route path="/registration" element={<Navigate replace to="/todo"/>}/>
                <Route path="/" element={<Navigate replace to="/todo"/>}/>
            </Routes>
        )
    }

    else {
        return (
            <Routes>
                <Route path="/login" element={<Login/>} />
                <Route path="/todo" element={<Navigate replace to="/login"/>}/>
                <Route path="/" element={<Navigate replace to="/login"/>}/>
                <Route path="/registration" element={<Registration/>} />
            </Routes>
        )
    }
}