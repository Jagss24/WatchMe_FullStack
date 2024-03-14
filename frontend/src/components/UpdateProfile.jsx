import React, { useState, useEffect } from 'react'
import { MdDelete } from 'react-icons/md'
import { BiCloudUpload } from 'react-icons/bi'
import { useNavigate, useParams } from 'react-router-dom'
import axios from "axios"
import Spinner from './Spinner'
import basePort from './basePort';

const UpdateProfile = () => {
    const [firstName, setfirstName] = useState('')
    const [lastName, setlastName] = useState('')
    const [about, setAbout] = useState('')
    const [userName, setuserName] = useState('')
    const [emailId, setEmailId] = useState('')
    const [loading, setLoading] = useState(false)
    const [fields, setFields] = useState(false)
    const [wrongImageType, setWrongImageType] = useState(false)
    const [imageAsset, setImageAsset] = useState(null)
    const navigate = useNavigate()
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

    const port = basePort
    const { userId } = useParams()
    const userInfo = async (userId) => {
        await axios.post(`${port}/api/v1/userInfo`, { userId }).then((res) => {
            setLoading(true)
            setfirstName(res.data.user.firstName)
            setlastName(res.data.user.lastName)
            setAbout(res.data.user.about)
            setuserName(res.data.user.userName)
            setEmailId(res.data.user.emailId)
            setImageAsset({ url: `${port}/${res.data.user.image}` })
            setLoading(false)
        })
    }

    const editProfile = async (id, f, l, a, u, e, i) => {
        if (id && f && l && u && e) {
            try {
                const formData = new FormData();
                formData.append("userId", id);
                formData.append("firstName", f);
                formData.append("lastName", l);
                formData.append("about", a);
                formData.append("userName", u);
                formData.append("emailId", e);
                formData.append("image", i);
                await axios.post(`${port}/api/v1/updateProfile`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
                    },
                }).then((res) => {
                    if (res.data.message === "Updated successfully") {
                        navigate(`/user-profile/${userId}`)
                    }
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
    useEffect(() => {
        userInfo(userId)
    }, [])

    return (

        <div className='flex lg:flex-row flex-col justify-center items-center mt-5 lg:h-4/5'>
            <div className='flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-3/5 '>
                <div className='bg-secondaryColor p-3 flex flex-0.7 w-full '>
                    <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 w-full h-420'>
                        {loading && <Spinner />}
                        {wrongImageType && <p>Wrong Image Type</p>}
                        {
                            !imageAsset ? <label>
                                <div className='flex flex-col items-center justify-center h-full '>
                                    <div className='flex flex-col justify-center items-center cursor-pointer '>
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
            </div>


            <div className='flex flex-1 flex-col gap-6 lg:p-9 mr-10 p-3 mt-5 w-full'>
                {fields && (
                    <p className="text-red-500 text-xl transition-all duration-150 ease-in-out">
                        Only about can be empty
                    </p>
                )}
                {/* firstName */}
                <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setfirstName(e.target.value)}
                    placeholder="FirstName"
                    className="outline-none text-base sm:text-lg border-b-2 lg:text-left text-center border-gray-200 p-2"
                />


                {/* lastName */}
                <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setlastName(e.target.value)}
                    placeholder="LastName"
                    className="outline-none text-base sm:text-lg lg:text-left text-center border-b-2 border-gray-200 p-2"
                />

                {/* About */}
                <input
                    type="text"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="About here"
                    className="outline-none text-base sm:text-lg lg:text-left text-center border-b-2 border-gray-200 p-2"
                />

                {/* userName */}
                <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setuserName(e.target.value)}
                    placeholder="Username"
                    className="outline-none text-base sm:text-lg lg:text-left text-center border-b-2 border-gray-200 p-2"
                />

                {/* EmailId */}

                <input
                    type="email"
                    required
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    placeholder="EmailId"
                    className="outline-none text-base sm:text-lg lg:text-left text-center border-b-2 border-gray-200 p-2"
                />
                <div className="flex justify-end items-end mt-5">
                    <button
                        type="button"
                        className="bg-red-500 text-white font-bold rounded-md w-28 outline-none p-2 hover:shadow-lg duration-150 transition-all ease-in-out"
                        onClick={() => editProfile(userId, firstName, lastName, about, userName, emailId, imageAsset?.file)}
                    >
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>


    )
}

export default UpdateProfile