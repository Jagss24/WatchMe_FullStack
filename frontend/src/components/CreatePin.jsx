import React, { useState, useEffect } from 'react'
import { generateAvatar } from './avatarGenerator'
import { BiCloudUpload } from 'react-icons/bi'
import { MdDelete } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import Spinner from './Spinner'
import { categories } from '../utils/data'
import basePort from './basePort'

const CreatPin = ({ user }) => {
    const [title, setTitle] = useState('')
    const [about, setAbout] = useState('')
    const [loading, setLoading] = useState(false)
    const [fields, setFields] = useState(false)
    const [category, setCategory] = useState(null)
    const [avatar, setAvatar] = useState(null)
    const [imageAsset, setImageAsset] = useState(null)
    const [wrongImageType, setWrongImageType] = useState(false)

    const port = basePort

    const navigate = useNavigate()
    useEffect(() => {
        const source = axios.CancelToken.source();

        if (user?.image) {
            return () => {
                source.cancel(); // Cancel any ongoing axios requests on component unmount
                return user?.image;
            };
        } else {
            setAvatar(generateAvatar(user?.userName.charAt(0), 50));
            return () => source.cancel(); // Cleanup axios requests on component unmount
        }
    }, [user?.image, user?.userName]);


    const uploadImage = (e) => {
        const file = e.target.files[0]
        if (file.type === "image/png" ||
            file.type === "image/svg" ||
            file.type === "image/jpeg" ||
            file.type === "image/gif" ||
            file.type === "image/tiff") {
            setWrongImageType(false)
            setLoading(true)
            const imageUrl = URL.createObjectURL(file);
            setImageAsset({ url: imageUrl, file });
            setLoading(false)
        }
        else {
            setWrongImageType(true)
        }

    }

    const savePin = async (t, a, c, u, p, i) => {
        if (t && a && c && u && p && i) {
            try {
                const formData = new FormData();
                formData.append("title", t);
                formData.append("about", a);
                formData.append("category", c);
                formData.append("userId", u);
                formData.append("postedBy", p);
                formData.append("image", i);
                await axios.post(`${port}/api/v2/post`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
                    },
                }).then((res) => {
                    if (res.data.message === "Posted Successfully")
                        navigate('/')
                    console.log(res.data)
                });

            } catch (error) {
                console.error("Error saving pin:", error);
            }
        }
        else {
            setFields(true)
            setTimeout(() => {
                setFields(false)
            }, 2000);
        }

    };


    return (
        <div className='flex-col flex justify-center items-center mt-5 lg:h-4/5'>
            {fields && (
                <p className="text-red-500 text-xl transition-all duration-150 ease-in-out">
                    please fill in all the fields
                </p>
            )}

            <div className='flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full'>
                <div className='bg-secondaryColor p-3 flex flex-0.7 w-full'>
                    <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 w-full h-420'>
                        {loading && <Spinner />}
                        {wrongImageType && <p>Wrong Image Type</p>}
                        {
                            !imageAsset ? <label>
                                <div className='flex flex-col items-center justify-center h-full'>
                                    <div className='flex flex-col justify-center items-center cursor-pointer'>
                                        <p className="font-bold text-2xl">
                                            <BiCloudUpload />
                                        </p>
                                        <p className="text-lg"> click to upload</p>
                                    </div>
                                    <p className="mt-32 text-gray-400 ">
                                        Use High Quality Images less than 20MB
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    name="upload-image"
                                    onChange={uploadImage}
                                    className="w-0 h-0"
                                />
                            </label> : <div className='relative h-full'>
                                <img src={imageAsset?.url} className='w-full h-full' alt="" />
                                <button type='button' className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md duration-500 transition-all ease-in-out'
                                    onClick={() => setImageAsset(null)}>
                                    <MdDelete />
                                </button>
                            </div>
                        }
                    </div>
                </div>

                <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
                    {/* title */}
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Add your title here"
                        className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
                    />

                    {/* user */}
                    {user && (
                        <div className="flex gap-2 my-2 items-center bg-white rounded-lg">
                            <img
                                src={avatar ? avatar : `${port}/${user?.image}`}
                                alt=""
                                className="w-10 h-10 rounded-full"
                            />
                            <p className="font-bold">{user?.userName}</p>
                        </div>
                    )}

                    {/* about */}
                    <input
                        type="text"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        placeholder="What is your pin about"
                        className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
                    />


                    <div className='flex flex-col'>
                        <div>
                            <p className="mb-2 font-semibold text-lg sm:text-xl">
                                Choose pin category
                            </p>
                            <select
                                onChange={(e) => setCategory(e.target.value)}
                                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
                            >
                                <option value="other" className="bg-white">
                                    Select Category
                                </option>
                                {categories.map((category) => (
                                    <option
                                        className="text-base border-0 outline-none capitalize bg-white text-black"
                                        value={category.name}
                                        key={category.name}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end items-end mt-5">
                            <button
                                type="button"
                                onClick={() =>
                                    savePin(title, about, category, user._id, user._id, imageAsset?.file)}
                                className="bg-red-500 text-white font-bold rounded-md w-28 outline-none p-2 hover:shadow-lg duration-150 transition-all ease-in-out"
                            >
                                Save Pin
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default CreatPin