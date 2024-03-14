import React, { useState, useEffect, useRef } from 'react'
import { generateAvatar } from './avatarGenerator';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { IoCloudDownload } from "react-icons/io5";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { AiTwotoneDelete } from "react-icons/ai";
import Modal from './Modal';
import basePort from './basePort';

const Pin = ({ pin: { userId, image, _id, destination, save, postedBy } }) => {
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem('userData'))
    const port = basePort
    const [postHovered, setPostHovered] = useState(false);
    const [savedByUser, setSavedByUser] = useState(false)
    const [likedByUser, setLikedByUser] = useState(false)
    const [likes, setLikes] = useState(0)
    const [saves, setSaves] = useState(0)
    const [userImage, setuserImage] = useState(null)
    const [avatar, setavatar] = useState(null)
    const [userName, setuserName] = useState(null)

    const pinRef = useRef(null);
    const downloadImage = (url) => {
        const imageUrl = url;

        fetch(imageUrl)
            .then((response) => response.blob())
            .then((blob) => {

                const blobUrl = URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = blobUrl;
                // Set the filename for the downloaded file
                a.download = `${image.slice(8, 21)}${image.slice(-4)}`;

                document.body.appendChild(a);
                // Trigger a click on the anchor tag to initiate the download
                a.click();
                // Remove the anchor tag from the document
                document.body.removeChild(a);
            });
    }

    const savePin = async (imageID, user) => {
        if (user) {
            await axios.post(`${port}/api/v2/savePin`, { imageId: imageID, userId: user._id })
                .then((res) => {
                    if (res.data.message === "Saved the post") {
                        getSaved(imageID, user)
                        return
                    }

                })
        }
        else {
            document.getElementById('login_modal').showModal()
        }
    }
    const deletePin = async (id) => {
        console.log(id)
        await axios.delete(`${port}/api/v2/delete`, { params: { imageId: id } }).then(() => {
            window.location.reload()
        })
    }
    const getSaved = async (imageID, user) => {
        if (user) {
            await axios.post(`${port}/api/v2/get-save`, { imageId: imageID, userId: user._id }).then((res) => {
                setSavedByUser(res.data.savedByUser)
                setSaves(res.data.saves)

            }).catch((error) => console.log(error))
        }
        else {
            await axios.post(`${port}/api/v2/get-save`, { imageId: imageID }).then((res) => {
                // setSavedByUser(res.data.savedByUser)
                setSaves(res.data.saves)

            }).catch((error) => console.log(error))
        }
    }

    const removeSave = async (imageID, user) => {
        await axios.post(`${port}/api/v2/remove-save`, { imageId: imageID, userId: user._id }).then((res) => {
            if (res.data.message === "Removed from Saved") {
                getSaved(imageID, user)
                return
            }
        })
    }
    const findUser = async (id) => {
        await axios.post(`${port}/api/v2/postedBy`, { imageId: id }).then((res) => {
            if (res.data.userImage) {
                setuserImage(res.data.userImage)
            } else {
                const userNameAvatar = generateAvatar(res.data.userName.charAt(0), 50);
                setavatar(userNameAvatar)
            }
            setuserName(res.data.userName)
        })
    }

    const getLikes = async (imageID, user) => {
        if (user) {
            await axios.post(`${port}/api/v2/get-likes`, { imageId: imageID, userId: user._id }).then((res) => {
                setLikedByUser(res.data.likedByUser)
                setLikes(res.data.like)
            })
        }
        else {
            await axios.post(`${port}/api/v2/get-likes`, { imageId: imageID }).then((res) => {
                setLikes(res.data.like)
            })
        }
    }

    const addLikes = async (id, user) => {
        if (user) {
            await axios.post(`${port}/api/v2/add-like`, { imageId: id, userId: user._id }).then((res => {
                if (res.data.message === "Liked the post") {
                    getLikes(id, user)
                }
            }))
        }
        else {
            document.getElementById('login_modal').showModal()
        }
    }

    const removeLikes = async (id, user) => {
        await axios.post(`${port}/api/v2/remove-like`, { imageId: id, userId: user._id }).then((res) => {
            if (res.data.message === "Removed Liked") {
                getLikes(id, user)
            }
        })
    }
    useEffect(() => {
        getSaved(_id, user)
        findUser(_id)
        getLikes(_id, user)
    }, [_id])


    return (
        <>
            <Modal />
            <div className='m-2' ref={pinRef}>
                <div
                    onMouseEnter={() => setPostHovered(true)}
                    onMouseLeave={() => setPostHovered(false)}
                    onClick={() => navigate(`/pin-detail/${_id}`)}
                    className="relative cursor-pointer w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
                >
                    <img
                        src={`${port}/${image}`}
                        className="rounded-lg w-full"
                        alt=""
                    />

                    {
                        postHovered && (
                            <div className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pt-2 pb-2 z-50'>
                                <div className="flex justify-between items-center">
                                    <div className='flex gap-2' >
                                        <p className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                downloadImage(`${port}/${image}`)
                                            }}
                                        >
                                            <IoCloudDownload /></p>

                                    </div>

                                    {savedByUser ? (
                                        <button
                                            type="button"
                                            className="bg-gray-500 opacity-70 hover:opacity-100 text-black font-bold px-5 py-1 text-base rounded-3xl shadow-md outline-none"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeSave(_id, user)

                                            }}
                                        >
                                            {saves} Saved
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl shadow-md outline-none"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                savePin(_id, user);
                                            }}
                                        >
                                            {saves} Save
                                        </button>
                                    )}
                                </div>

                                <div className='flex justify-between items-center gap-2 w-full'>

                                    {likedByUser ? <span className='bg-white flex items-center gap-2 text-red font-bold p-2 rounded-full opacity-70 hover:opacity-100 hover:shadow-md' onClick={(e) => {
                                        e.stopPropagation()
                                        removeLikes(_id, user)
                                    }} > {likes}<FaHeart color='red' /></span> : <span className='bg-white flex items-center gap-2 text-red font-bold p-2 rounded-full opacity-70 hover:opacity-100 hover:shadow-md' onClick={(e) => {
                                        e.stopPropagation()
                                        addLikes(_id, user)
                                    }} > {likes}<FaRegHeart /></span>}

                                    {postedBy === user?._id && (
                                        <button type="button"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                deletePin(_id)
                                            }}
                                            className="bg-white flex p-2 opacity-70 hover:opacity-100 text-red-500 font-bold  text-base rounded-full shadow-md outline-none">
                                            <AiTwotoneDelete />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    }
                </div>

                <Link to={`/user-profile/${postedBy}`}
                    className="flex gap-2 mt-2 items-center">
                    <img src={userImage ? `${port}/${userImage}` : avatar} alt="user-pic" className="w-8 h-8 rounded-full object-cover" />
                    <p className="capitalize">{userName}</p>
                </Link>
            </div>
        </>
    )
}

export default Pin