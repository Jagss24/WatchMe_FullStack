import React from 'react'
import { Route, Routes } from "react-router-dom";
import Pin from './Pin';


const Home = () => {

    const user = JSON.parse(sessionStorage.getItem('userData'))
    // if (!user) {
    //     window.location.href = "/login";
    //     return null;
    // }
    return (
        <Routes>
            <Route path="/*" element={<Pin user={user} />} />
        </Routes>
    )
}

export default Home