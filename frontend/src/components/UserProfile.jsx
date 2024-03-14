import React, { useState, useEffect } from "react";
import { generateAvatar } from './avatarGenerator';
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Modal from "./Modal";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import basePort from './basePort';


const activeBtnStyles =
    "bg-red-500 text-white mx-3 font-bold p-2 rounded-lg shadow-lg w-20 outline-none";
const notActiveBtnStyles =
    "bg-gray-400 text-black mx-3 font-bold p-2 rounded-lg w-20 outline-none";


const UserProfile = () => {
    const port = basePort
    const [pins, setPins] = useState(null);
    const [user, setUser] = useState(null);
    const [avatar, setAvatar] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isImageClicked, setIsImageClicked] = useState(false);
    const [followers, setFollowers] = useState(0)
    const [text, setText] = useState("Created");
    const [activeBtn, setActiveBtn] = useState("created");
    const [followText, setFollowText] = useState('Follow')
    const [totalLikes, setTotalLikes] = useState(0)
    const navigate = useNavigate();
    const { userId } = useParams();


    const fetchUserImages = async (userId) => {
        await axios.post(`${port}/api/v2/fetchuserimg`, { userId }).then((res) => {
            setPins(res.data.pins)
        })
    }

    const savedUserImage = async (userId) => {
        await axios.post(`${port}/api/v2/userSavedimage`, { userId }).then((res) => {
            if (res.data.message === "No pins saved") {
                setPins(res.data.pins)
                setLoading(false)
                return
            }
            setPins(res.data.pins)
            setLoading(false)
        })
    }
    const getFollowerCount = async (userId) => {
        await axios.get(`${port}/api/v6/getfollowerCounts?userId=${userId}`).then((res) => {
            setFollowers(res.data.count)
        })
    }
    const knowFollowBack = async (userId, loggedInUser) => {
        if(loggedInUser){
        await axios.get(`${port}/api/v6/followBack?loggedInuserId=${loggedInUser._id}&viewingUserId=${userId}`).then((res) => {
            if (res.data.message === "Follow") {
                setFollowText("Follow")
                return
            }
            if (res.data.message === "Follow back") {
                setFollowText("Follow back")
                return
            }
            if (res.data.message === "Unfollow") {
                setFollowText("Unfollow")
                return
            }
        })
        }
        else{
            await axios.get(`${port}/api/v6/followBack?viewingUserId=${userId}`).then((res) => {
                if (res.data.message === "Follow") {
                    setFollowText("Follow")
                    return
                }
                if (res.data.message === "Follow back") {
                    setFollowText("Follow back")
                    return
                }
                if (res.data.message === "Unfollow") {
                    setFollowText("Unfollow")
                    return
                }
            })
        }
    }
    const getUser = async (userId) => {
        setLoading(true)
        await axios.post(`${port}/api/v1/getUser`, { userId }).then((res) => {
            setUser(res.data.user)
            if (res.data.user.userImage) {
                return
            }
            else {
                setAvatar(generateAvatar(res.data.user.userName.charAt(0), 50))
            }
        })
    }


    const loggedInUser = JSON.parse(sessionStorage.getItem('userData'))
    const logout = () => {
        sessionStorage.removeItem('userData')
        navigate('/')
        window.location.reload()
    }
    const handleFollow = async (userId, loggedInUser) => {
        await axios.post(`${port}/api/v6/follow`, { followerId: loggedInUser._id, followingId: userId }).then((res) => {
            if (res.data.message === "Followed Successfully") {
                knowFollowBack(userId, loggedInUser)
            }
        })
    }
    const gettotalLikes = async(userId) => {
        await axios.post(`${port}/api/v2/total-like`,{userId}).then((res)=>{
            setTotalLikes(res.data.totalLikes)
        })
    }
    const unhandleFollow = async (userId, loggedInUser) => {
        await axios.post(`${port}/api/v6/unfollow`, { unfollowerId: loggedInUser._id, unfollowingId: userId }).then((res) => {
            if (res.data.message === "UnFollowed Successfully") {
                knowFollowBack(userId, loggedInUser)
            }
        })
    }
    useEffect(() => {
        getUser(userId)
        knowFollowBack(userId, loggedInUser)
        getFollowerCount(userId)
        gettotalLikes(userId)
        if (text === "Created") {
            setLoading(true)
            fetchUserImages(userId).then(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 300);
            })
            setLoading(false)
        } else {
            setLoading(true)
            savedUserImage(userId)
        }
    }, [text, userId, followText])

    return (
        <div className="relative pb-2 h-full justify-center items-center">
            <div className="flex flex-col pb-5 mt-10">
                <Modal user={user} loggedInUser={loggedInUser} />
                {user ? ( // Conditionally render only when user is not null
                    <div className="relative flex flex-col mb-7">
                        <div className="flex flex-col justify-center items-center ">

                            <img
                                src={user.image ? `${port}/${user.image}` : avatar}
                                className={`rounded-xl w-48 mt-10 shadow-2xl object-cover`}
                                // style={{ scale: '3', border: '2px solid white' }}
                                alt=""
                                onClick={() => {
                                    setIsImageClicked(!isImageClicked);
                                }}
                            />

                            <div className="flex gap-2">
                                <h1 className="font-bold text-3xl text-center mt-3">
                                    {user.firstName}
                                </h1>

                                <h1 className="font-bold text-3xl text-center mt-3">
                                    {user.lastName}
                                </h1>
                            </div>


                            <i className="text-xl text-center mt-3">
                                {user.userName}
                            </i>


                            <h4 className=" text-center my-3 text-lg lg:w-10/12 w-full">
                                {user.about}
                            </h4>

                            {loggedInUser && userId !== loggedInUser._id && (
                                <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
                                    {followText === "Unfollow" ? <button className="bg-gray-500 text-black mx-3 font-bold py-3 px-4 rounded-lg shadow-lg w-24 outline-none" onClick={() => unhandleFollow(userId, loggedInUser)} >
                                        {followText}
                                    </button> : <button className="bg-red-500 text-white mx-3 font-bold py-3 px-4 rounded-lg shadow-lg w-32 outline-none" onClick={() => handleFollow(userId, loggedInUser)}>{followText}</button>}
                                    <button className="bg-white border hover:border-gray-400 text-black mx-3 font-bold py-3 px-4 rounded-lg shadow-lg w-24 outline-none" onClick={() => document.getElementById('msg_modal').showModal()}>
                                        Message
                                    </button>
                                </div>
                            )}
                            <div className="flex  flex-row justify-center items-center mb-5">
                                {loggedInUser ? userId === loggedInUser._id && (
                                    <Link to={`/updateProfile/${userId}`} className="bg-red-500 ml-2 text-white p-2 font-bold rounded-lg shadow-lg outline-none">Update Profile</Link>
                                ) : <></>}
                            </div>
                            <div className="flex justify-center items-center gap-4 mb-5">
                                <div className="flex flex-col md:flex-row justify-center items-center text-gray-500 text-md gap-1">
                                    <span>{followers}</span>
                                    <h3>Followers</h3>
                                </div>
                                <div className="flex flex-col md:flex-row justify-center items-center text-gray-500 text-md gap-1">
                                    <span>Total {totalLikes}</span>
                                    <h3>Likes</h3>
                                </div>
                            </div>
                            <div className="absolute top-2 z-1 right-2">
                                {loggedInUser ? userId === loggedInUser._id && (
                                    <button
                                        type="button"
                                        className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                                        onClick={logout}
                                    >
                                        <AiOutlineLogout color="red" fontSize={21} />

                                    </button>
                                ) : <></>}
                            </div>
                        </div>

                        <div className="text-center mb-7">
                            <button
                                type="button"
                                onClick={(e) => {
                                    setText(e.target.textContent);
                                    setActiveBtn("created");
                                }}
                                className={`${activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
                                    }`}
                            >
                                Created
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    setText(e.target.textContent);
                                    setActiveBtn("saved");
                                }}
                                className={`${activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
                                    }`}
                            >
                                Saved
                            </button>
                        </div>

                        {/* Displaying pins */}
                        {loading ? (<Spinner msg="Loading images" />) : (pins && pins.length ? (
                            <div className="px-2">
                                <MasonryLayout pins={pins} />
                            </div>
                        ) : (
                            <div className="flex justify-center items-center font-bold w-full text-xl mt-2">
                                No Pins Found
                            </div>
                        ))}
                    </div>
                ) : (<Spinner msg="Loading user details" />)}
            </div>
        </div>
    )
}
export default UserProfile