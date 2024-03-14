import { React, useState } from 'react'
import watchVideo from '../assets/share.mp4'
import logo from '../assets/watchme_white.png'
import axios from 'axios'
import './login.css'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import basePort from './basePort';

const Signup = () => {

    const [inputs, setinputs] = useState({
        firstName: "",
        lastName: "",
        emailId: "",
        userName: "",
        userPassword: "",
        userOTP: ""
    })
    const port = basePort
    const navigate = useNavigate()
    const change = (e) => {
        const { name, value } = e.target
        setinputs({ ...inputs, [name]: value })
    }
    const [showuserPassword, setShowuserPassword] = useState(false);

    const toggleuserPasswordVisibility = () => {
        setShowuserPassword(!showuserPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputs.firstName || !inputs.lastName || !inputs.userName || !inputs.emailId || !inputs.userPassword) {
            alert("Fill all the details")
            return
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inputs.emailId)) {
            alert("Please enter a valid email address");
            return;
        }
        await axios.post(`${port}/api/v1/signup`, inputs)
            .then((res) => {
                if (res.data.message === "EmailID is already in use") {
                    alert(res.data.message + " Try another")
                }
                else if (res.data.message === "Username is already in use") {
                    alert(res.data.message + " Try another")
                }
                else if (res.data.message === "Email sent successfully") {
                    document.getElementById('otp_modal').showModal()
                }
                else {
                    alert(res.data.message)
                }
            })

    }

    const handleOTP = async (e) => {
        e.preventDefault();
        await axios.post(`${port}/api/v1/signupotp`, inputs).then((res) => {
            if (res.data.message === "Signup Successful") {
                sessionStorage.setItem('userData', JSON.stringify(res.data.others))
                navigate('/')
            }
            else if (res.data.message === "INCORRECT OTP") {
                alert("Incorrect OTP. Enter again")
                return
            }
            else {
                alert("Some error on our side")
                return
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

                <div className='p-5'>
                    {/* Logo */}
                    <img src={logo} alt="logo" width={"180px"} />
                </div>

                <form className='flex flex-col justify-start items-center gap-5 w-350' onSubmit={handleSubmit}>
                    <input type="text" className='border w-full  border-gray-300 text-white rounded-lg p-3 px-5 bg-transparent focus:outline-none focus:border-blue-500'
                        name='firstName' value={inputs.firstName} onChange={change} placeholder='Firstname' required />
                    <input type="text" className='border w-full  border-gray-300 text-white rounded-lg p-3 px-5 bg-transparent focus:outline-none focus:border-blue-500'
                        name='lastName' value={inputs.lastName} onChange={change} placeholder='Lastname' required />
                    <input type="email" className='border w-full  border-gray-300 text-white rounded-lg p-3 px-5 bg-transparent focus:outline-none focus:border-blue-500'
                        name='emailId' value={inputs.emailId} onChange={change} placeholder='EmailId' required />
                    <input type="text" className='border w-full border-gray-300 text-white rounded-lg p-3 px-5 bg-transparent focus:outline-none focus:border-blue-500'
                        name='userName' value={inputs.userName} onChange={change} placeholder='Username' required />
                    <div className='w-full flex border border-gray-300 text-white rounded-lg p-3 px-5 bg-transparent   focus:border-blue-500 '>
                        <input
                            type={showuserPassword ? 'text' : 'password'}
                            className='w-full bg-transparent focus:outline-none'
                            name='userPassword' value={inputs.userPassword} onChange={change}
                            placeholder='Password'
                            required
                        />
                        <span
                            className='cursor-pointer relative right-0 flex items-center'
                            style={{ fontSize: '28px', color: '#9CA3AF' }}
                            onClick={toggleuserPasswordVisibility}
                        >
                            {showuserPassword ? <FaEye style={{ color: "tomato" }} /> : <FaEyeSlash />}
                        </span>
                    </div>
                    <input type='submit' className=' bg-black text-white cursor-pointer rounded-md px-4 py-2 transition duration-300 ease-in-out hover:bg-blue-500' value="Sign up" />
                </form>

                <div className='py-3 flex justify-start items-center text-lg '>
                    <h3 className='text-white w-full'>Already have an account? <Link to='/login' className='text-blue-500 hover:text-blue-700' >Login</Link> </h3>
                </div>

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
            </div>
        </div>
    )
}

export default Signup