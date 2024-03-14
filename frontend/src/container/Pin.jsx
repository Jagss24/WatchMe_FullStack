import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { NavBar, Feed, PinDetail, CreatePin, Search, UserProfile, Category, UpdateProfile, ForGotPassword } from '../components'

const Pin = ({ user }) => {

    const [searchTerm, setsearchTerm] = useState("");
    return (
        <div className='px-2 md:px-5'>
            <div className='bg-white'>
                {/* NavBAr */}
                <NavBar searchTerm={searchTerm} setsearchTerm={setsearchTerm} user={user} />
            </div>
            <div className='h-full'>
                <Routes>
                    <Route path='/' element={<Feed />} />
                    <Route path='/user-profile/:userId' element={<UserProfile />} />
                    <Route path='/category/:categoryId' element={<Category />} />
                    <Route path='/pin-detail/:pinId' element={<PinDetail user={user} />} />
                    <Route path='/create-pin' element={<CreatePin user={user} />} />
                    <Route path='/search' element={<Search searchTerm={searchTerm} setsearchTerm={setsearchTerm} />} />
                    <Route path='/updateProfile/:userId' element={<UpdateProfile />} />
                    <Route path='/forgotPassword' element={<ForGotPassword />} />
                </Routes>
            </div>
        </div >
    )
}

export default Pin