import { React, useState } from 'react'
import watchVideo from '../assets/watchme.mp4'
import logo from '../assets/watchme_white.png'
import axios from 'axios'
import './login.css'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import basePort from './basePort'

const Login = () => {
    const navigate = useNavigate()
    const port = basePort
    const [inputs, setinputs] = useState({
        emailId: "",
        password: "",
    })
    const change = (e) => {
        const { name, value } = e.target
        setinputs({ ...inputs, [name]: value })
    }
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const submit = async (e) => {
        e.preventDefault()
        if (!inputs.emailId || !inputs.password) {
            alert("Fill all the details")
            return
        } 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inputs.emailId)) {
            alert("Please enter a valid email address");
            return;
        } 
        else {
            await axios.post(`${port}/api/v1/signin`, inputs)
                .then((res) => {
                    if (res.data.message === "Please signup first")
                        alert(res.data.message)
                    else if (res.data.message === "Password is not correct")
                        alert(res.data.message)
                    else {
                        sessionStorage.setItem('userData', JSON.stringify(res.data.others))
                        navigate("/")
                    }
                })
        }

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
                        <input type="email" className='border w-full border-gray-300 text-white rounded-lg p-3 px-5 bg-transparent focus:outline-none focus:border-blue-500' name='emailId' placeholder='Email Id' value={inputs.emailId} onChange={change} />
                    </div>
                    <div className='w-full flex border border-gray-300 text-white rounded-lg p-3 px-5 bg-transparent   focus:border-blue-50'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className='w-full bg-transparent focus:outline-none'
                            placeholder='Password'
                            name='password'
                            value={inputs.password}
                            onChange={change}
                            required
                        />
                        <span
                            className='cursor-pointer relative right-0 flex items-center'
                            style={{ fontSize: '28px', color: '#9CA3AF' }}
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <FaEye style={{ color: "tomato" }} /> : <FaEyeSlash />}
                        </span>

                    </div>
                    <input type='submit' className=' bg-black text-white cursor-pointer rounded-md px-4 py-2 transition duration-300 ease-in-out hover:bg-blue-500' value="Log in" onClick={submit} />


                </div>

                <div className='py-3 flex justify-start items-center flex-col text-lg '>
                    <h3 className='text-white w-full'>Doesn't have an account? <Link to='/signup' className='text-blue-500 hover:text-blue-700'>Create One</Link> </h3>
                    <h3 className='text-white text-center w-full'>Forgot Password?<Link className='text-blue-500 hover:text-blue-700' to='/forgotPassword'>Click here</Link></h3>
                </div>
            </div>
        </div>
    )
}

export default Login