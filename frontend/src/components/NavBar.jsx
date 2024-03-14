import React, { useState, useRef, useEffect } from "react";
import { generateAvatar } from "./avatarGenerator";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Modal from "./Modal";
import {
    BiSearchAlt,
    BiPlus,
    BiChevronRight,
    BiChevronLeft,
    BiLogInCircle
} from "react-icons/bi";
import { RiHome7Fill } from "react-icons/ri";
import logo from "../assets/watchme.png";
import { categories } from '../utils/data'
import basePort from "./basePort";


const port = basePort

const NavBar = ({ searchTerm, setsearchTerm, user }) => {
    const navigate = useNavigate();

    const [Scroll, setScroll] = useState(false);
    const [avatar, setAvatar] = useState(null)
    const scrollRef = useRef()
    const scrollClick = (side) => {
        setScroll(true)
        side === 'right' ? scrollRef.current.scrollLeft += 200 : scrollRef.current.scrollLeft -= 200

        scrollRef.current.scrollLeft < 199 ? setScroll(false) : setScroll(true)
    }

    useEffect(() => {
        if (user) {
            if (user?.image) {
                return
            } else {
                setAvatar(generateAvatar(user?.userName.charAt(0), 50));
            }
        }

    }, [user])

    const isACtiveStyles =
        "flex items-center px-2 md:px-5 gap-2 md:gap-3 font-bold transition-all duration-200 ease-in-out capitalize";
    const isNotACtiveStyle =
        "flex items-center px-2 md:px-5 gap-2 md:gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize";
    return (
        <div className="flex flex-col">
            {!user && <Modal />}
            <div className="flex  items-center w-full py-2">
                <Link to="/">
                    <img src={logo} alt="Logo" className="w-40 cursor-pointer" />
                </Link>
                {/* SearchBox */}
                <div className="flex justify-between items-center w-full bg-white p-2 shadow-md rounded-lg mx-4">
                    <BiSearchAlt fontSize={30} className="text-gray-700" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full outline-none border-none px-3 text-gray-800 font-semibold text-base"
                        onFocus={() => navigate("/search")}
                        value={searchTerm}
                        onChange={(e) => setsearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex justify-center items-center">
                    {user ? <Link to="/create-pin">
                        <button
                            type="button"
                            className=" w-36 min-w-36 p-2 text-center hover:bg-red-500 hover:text-white text-gray-700 border border-gray-300 rounded-md hover:shadow-x duration-150 ease-in-out md:flex hidden"
                        >
                            Post a photo
                        </button>
                        {/* small screen add button */}
                        <div className="bg-black w-9 h-9 rounded-md md:hidden flex items-center justify-center">
                            <BiPlus fontSize={24} className="text-white" />
                        </div>
                    </Link> : <Link onClick={() => document.getElementById('login_modal').showModal()} >
                        <button
                            type="button"
                            className=" w-36 min-w-36 p-2 text-center hover:bg-red-500 hover:text-white text-gray-700 border border-gray-300 rounded-md hover:shadow-x duration-150 ease-in-out md:flex hidden"
                        >
                            Post a photo
                        </button>
                        {/* small screen add button */}
                        <div className="bg-black w-9 h-9 rounded-md md:hidden flex items-center justify-center">
                            <BiPlus fontSize={24} className="text-white" />
                        </div>
                    </Link>}

                    {/* USer profile */}

                    {user ? <Link
                        to={`user-profile/${user?._id}`}
                        className="flex items-center justify-center w-10 min-w-10 h-10 min-h-10 shadow-lg rounded-full bg-slate-500 ml-4"
                    >
                        <img src={avatar ? avatar : `${port}/${user?.image}`} alt="Pic" />
                    </Link> :
                        <Link to="/login"  >
                            <button className="ml-2 min-w-16 w-16 p-2 text-center bg-blue-500 text-white  border border-gray-300 rounded-md hover:shadow-x duration-150 ease-in-out md:flex hidden">
                                Login
                            </button>
                            {/* for small screen */}
                            <div className="bg-blue-500 ml-3 w-8 h-9 rounded-md md:hidden flex items-center justify-center">
                                <BiLogInCircle fontSize={24} className="text-white" />
                            </div>
                        </Link>
                    }
                </div>
            </div>

            {/* Categories */}

            <div className="flex items-center w-full py-2">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? isACtiveStyles : isNotACtiveStyle
                    }
                >
                    <RiHome7Fill fontSize={30} />
                </NavLink>

                <div className="h-6 w-[1px] bg-slate-500 "></div>

                <div className="flex items-center w-full h-10 overflow-y-scroll hide_scrollbar relative ">
                    <div
                        className={` ${Scroll ? 'flex' : 'hidden'}  absolute left-0 w-auto  justify-start items-center bg-gradient-to-r from-gray-50 cursor-pointer`}
                        onClick={() => scrollClick('left')}
                    >
                        <BiChevronLeft fontSize={30} />
                    </div>
                    <div className="flex items-center w-full overflow-y-scroll hide_scrollbar scroll-smooth duration-150 ease-in-out"
                        ref={scrollRef}
                    >
                        {categories.map((category) => (
                            <NavLink
                                to={`/category/${category.name}`}
                                key={category.name}
                                className={({ isActive }) =>
                                    isActive ? isACtiveStyles : isNotACtiveStyle
                                }
                            >
                                {category.name}
                            </NavLink>
                        ))}
                    </div>
                    <div
                        className={` absolute right-0 w-auto h-10 md:flex hidden justify-end items-center bg-gradient-to-l from-gray-50 cursor-pointer`}
                        onClick={() => scrollClick('right')}
                    >
                        <BiChevronRight fontSize={30} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavBar;
