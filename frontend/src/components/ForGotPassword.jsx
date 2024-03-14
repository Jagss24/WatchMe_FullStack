import { React, useState } from 'react'
import watchVideo from '../assets/watchme.mp4'
import logo from '../assets/watchme_white.png'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import basePort from './basePort'


const ForGotPassword = () => {
    const navigate = useNavigate()
    const port = basePort
    const [inputs, setinputs] = useState({
        emailId: "",
        newPassword: "",
        userOTP: ''
    })
    const change = (e) => {
        const { name, value } = e.target
        setinputs({ ...inputs, [name]: value })
    }

    const handleSubmit = async () => {
        await axios.post(`${port}/api/v1/forgotPassword`, inputs).then((res) => {
            if (res.data.message === "This emailId doesn't exit") {
                alert(res.data.message)
                return
            }
            else if (res.data.message === "Email sent successfully") {
                document.getElementById('otp_modal').showModal()
            }
        })
    }

    const handleOTP = async () => {
        await axios.post(`${port}/api/v1/forgotOTP`, inputs).then((res) => {
            if (res.data.message === 'INCORRECT OTP') {
                alert(res.data.message)
                return
            }
            else if (res.data.message === 'CORRECT OTP') {
                document.getElementById('otp_modal').close()
                document.getElementById('newPassword_modal').showModal()
            }
            else {
                alert('Some error on our side')
            }
        })
    }

    const handlenewPassword = async () => {
        await axios.post(`${port}/api/v1/updatePassword`, inputs).then((res) => {
            if (res.data.message === 'Password changed Successfully') {
                alert(res.data.message)
                navigate('/login')
            }
            else {
                alert('Some error on our side')
            }
        })
    }
    return (
        <div className='flex justify-start items-center flex-col h-screen'>
            <div className='relative w-full h-full'>
                {/* Login Video */}
                <video

                    src={watchVideo}
                    type="video/mp4"
                    loop
                    controls={false}
                    muted
                    autoPlay
                    className='w-full h-full object-cover'
                ></video>
            </div>

            <div className='absolute flex flex-col justify-center items-center top-0 left-0 right-0 bottom-0 bg-blackOverlay'>

                <div className='flex border border-red-500 rounded-lg p-3 px-5' id="error">
                    <h4 className='text-red-500'>Please fill all the fields</h4>
                </div>
                <div className='p-5'>
                    {/* Logo */}
                    <img src={logo} alt="logo" width={"180px"} />
                </div>

                <div className='flex flex-col justify-start items-center w-350 gap-5'>
                    <div className='w-full'>
                        <label htmlFor="emailId" className='text-white'>Enter your EmailId below : </label>
                        <input type="email" className='border w-full mt-3 border-gray-300 text-white rounded-lg p-3 px-5 bg-transparent focus:outline-none focus:border-blue-500' name='emailId' placeholder='Email Id' value={inputs.emailId} onChange={change} />

                    </div>
                    <input type='submit' className=' bg-black text-white cursor-pointer rounded-md px-4 py-2 transition duration-300 ease-in-out hover:bg-blue-500' value="Submit" onClick={handleSubmit} />
                    <h3 className='text-white text-center w-full'>Go back to<Link className='text-blue-500 hover:text-blue-700' to='/login'> Login Page</Link></h3>
                    <dialog id="otp_modal" className="modal ">
                        <div className="modal-box bg-black">
                            <h3 className="font-bold text-lg mb-4 text-center text-white">Enter the OTP sent to your mail</h3>
                            <label className="input input-bordered flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                                <input type="password" className="grow" placeholder='OTP' value={inputs.userOTP} name='userOTP' onChange={change} />
                            </label>
                            <button className="w-full my-3 bg-black text-center text-white outline-none py-2 rounded-md border border-gray-300 hover:shadow-x duration-150 ease-in-out hover:bg-red-500 focus:bg-red-500" onClick={handleOTP}>Submit</button>
                            <div className="modal-action">
                                <form method="dialog">
                                    {/* if there is a button in form, it will close the modal */}
                                    <button className="btn">Close</button>
                                </form>
                            </div>
                        </div>
                    </dialog>

                    <dialog id="newPassword_modal" className="modal ">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg mb-4 text-center text-white">Enter your New Password</h3>
                            <label className="input input-bordered flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                                <input type="password" className="grow" placeholder='New password' value={inputs.newPassword} name='newPassword' onChange={change} />
                            </label>
                            <button className="w-full my-3 bg-black text-center text-white outline-none py-2 rounded-md border border-gray-300 hover:shadow-x duration-150 ease-in-out hover:bg-red-500 focus:bg-red-500" onClick={handlenewPassword}>Submit</button>
                            <div className="modal-action">
                                <form method="dialog">
                                    {/* if there is a button in form, it will close the modal */}
                                    <button className="btn">Close</button>
                                </form>
                            </div>
                        </div>
                    </dialog>
                </div>


            </div>
        </div>
    )
}

export default ForGotPassword