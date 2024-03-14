import React, { useEffect, useState } from 'react'
import { IoCloudDownload, IoSend } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import { generateAvatar } from './avatarGenerator';
import MasonryLayout from './MasonryLayout';
import Anonymous from '../assets/anonymous.png'
import Modal from './Modal';
import axios from 'axios';
import Spinner from "./Spinner";
import basePort from './basePort';

const PinDetail = ({ user }) => {
    const port = basePort
    const { pinId } = useParams()
    const [title, setTitle] = useState('')
    let category = ''
    const [pins, setPins] = useState(null)
    const [about, setAbout] = useState('')
    const [image, setImage] = useState('')
    const [userName, setUserName] = useState('')
    const [userImg, setuserImg] = useState('')
    const [avatar, setAvatar] = useState(null)
    const [userId, setuserId] = useState('')
    const [Comments, setComments] = useState([])
    const [commentContent, setCommentContent] = useState('')
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

    const getPinDetail = async (pinId) => {
        await axios.post(`${port}/api/v2/pin-detail`, { imageId: pinId }).then((res) => {
            console.log(res.data)
            setTitle(res.data.pins.title)
            setAbout(res.data.pins.about)
            setImage(res.data.pins.image)
            setUserName(res.data.userName)
            if (res.data.userImage) {
                setuserImg(res.data.userImage)
            }
            else {
                setAvatar(generateAvatar(res.data.userName.charAt(0), 50))
            }
            setuserId(res.data.userId)
            category = res.data.pins.category
        })
    }

    const getComments = async (imageId) => {
        await axios.post(`${port}/api/v4/getComments`, { imageId }).then((res) => {
            console.log(res.data)
            if (res.data.message === "No comments here") {
                return
            }
            setComments([res.data])
        })
    }

    const addComment = async (imageId, postedBy, comment) => {
        if (comment) {
            await axios.post(`${port}/api/v4/addComment`, { imageId, postedBy, comment }).then((res) =>
                setCommentContent('')
            )
            getComments(pinId)
        }
        else {
            if (comment.length === 0) {
                alert('Please write anything in comment box')
            }
        }

    }

    const getmorePins = async (categoryName) => {
        await axios.post(`${port}/api/v2/category`, { categoryId: categoryName }).then(res => {
            console.log(res.data.pins)
            setPins(res.data.pins)
        })
    }
    useEffect(() => {
        const fetchData = async () => {
            await getPinDetail(pinId);
            await getComments(pinId);
            await getmorePins(category);
        };

        fetchData();
    }, [pinId])

    return (
        <>
            <div
                className="flex xl:flex-row flex-col m-auto bg-white p-4"
                style={{ maxWidth: "1500px", borderRadius: "35px" }}
            >
                {/* image */}
                <div className="flex justify-center items-center md:items-start flex-initial">
                    <img
                        src={`${port}/${image}`}
                        alt=""
                        className="rounded-t-3xl rounded-b-lg"
                    />
                </div>

                {/* pin details */}
                <div className="w-full p-5 flex-1 xl:min-w-620">
                    {/* url detinations and download */}
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                            <p

                                onClick={(e) => {
                                    e.stopPropagation()
                                    downloadImage(`${port}/${image}`)
                                }}
                                className="bg-white w-9 h-9 rounded-full flex items-center justify-center 
                  text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                            >
                                <IoCloudDownload />
                            </p>
                        </div>
                    </div>
                    {/* pin title */}
                    <div>
                        <h1 className="text-4xl font-bold mt-3 break-words">
                            {title}
                        </h1>
                        <p className="mt-3">{about}</p>
                    </div>
                    {/* user detail */}
                    <Link
                        to={`/user-profile/${userId}`}
                        className="flex gap-2 mt-5 w-24 items-center bg-white rounded-lg"
                    >
                        <img
                            src={avatar ? avatar : `${port}/${userImg}`}
                            className="w-8 h-8 rounded-full object-cover"
                            alt=""
                        />
                        <p className="font-semibold capitalize">
                            {userName}
                        </p>
                    </Link>

                    {/* comments */}
                    <h2 className="mt-5 text-2xl">Comments </h2>
                    <div className="max-h-370 overflow-y-auto">
                        {Comments ? (
                            Array.isArray(Comments) && Comments.length > 0 ? (
                                Comments.map((commentGroup, i) => (
                                    <div key={i}>
                                        {commentGroup.comment.map((comment, j) => (
                                            <div
                                                className="flex gap-2 mt-5 items-center bg-white rounded-lg"
                                                key={`${i}-${j}`}
                                            >
                                                <Link to={`/user-profile/${comment.userId}`}>
                                                    <img
                                                        src={comment.userImg ? `${port}/${comment.userImg}` : generateAvatar(comment.userName.charAt(0), 50)}
                                                        alt=""
                                                        className="w-10 h-10 rounded-full cursor-pointer"
                                                    />
                                                </Link>
                                                <div className="flex flex-col">
                                                    <p className="font-bold">{comment.userName}</p>
                                                    <p>{comment.comment}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))
                            ) : (
                                <p>No comments available.</p>
                            )
                        ) : (
                            <Spinner msg="Loading comments..." />
                        )}
                    </div>

                    {/* container to create comment */}
                    <div className="flex flex-wrap items-center mt-6 gap-3">
                        {user ? <Link to={`/user-profile/${user._id}`} className="">
                            <img
                                src={user.image ? `${port}/${user.image}` : generateAvatar(user?.userName.charAt(0), 50)}
                                className="md:w-10 md:h-10 w-3 h-3 rounded-full cursor-pointer"
                                alt="user"
                            />
                        </Link> : <img src={Anonymous} alt="Anonymous user" className='w-10 h-10 rounded-full' />}
                        <input
                            type="text"
                            className="lg:flex-1 md:flex-l w-48 border-gray-100 outline-none
             border-2 p-2 rounded-2xl focus:border-gray-300"
                            placeholder="Add a comment"
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            required
                        />
                        <IoSend
                            fontSize={25}
                            className="cursor-pointer"
                            onClick={user ? () => addComment(pinId, user._id, commentContent) : () => document.getElementById('login_modal').showModal()}
                        />
                        {!user && <Modal />}
                    </div>
                </div>
            </div>
            {/* recommended pins */}
            {/* {console.log(pins)} */}
            {pins?.length > 0 ? (
                <>
                    <h2 className="text-center font-bold text-2xl mt-8 mb-4">
                        More Like this
                    </h2>
                    <MasonryLayout pins={pins} />
                </>
            ) : (
                <Spinner msg={"Loading More Pins"} />
            )}
        </>

    )
}

export default PinDetail