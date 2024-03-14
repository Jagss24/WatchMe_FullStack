import React, { useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'
import { IoIosMail } from "react-icons/io";
import basePort from './basePort';

const Modal = ({ user, loggedInUser }) => {
    const port = basePort
    const [inputs, setinputs] = useState({
        firstName: "",
        lastName: "",
        emailId: "",
        userName: "",
        password: "",
        userPassword: "",
        userOTP: "",
        msgContent: ""
    })
    const [sendingData, setSendingData] = useState(false)
    const change = (e) => {
        const { name, value } = e.target
        setinputs({ ...inputs, [name]: value })
    }
    const handleLogin = async (e) => {
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
                        window.location.reload()
                    }
                })
        }

    }

    const handleSignup = async (e) => {
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
                window.location.reload()
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
    const handleMessage = async () => {
        setSendingData(true);
        try {
            const res = await axios.post(`${port}/api/v7/sentMsg`, { senderemailId: loggedInUser.emailId, receipentemailId: user.emailId, msgContent: inputs.msgContent });
            if (res.data.message === "Email sent successfully") {
                setTimeout(() => {
                    setSendingData(false);
                    document.getElementById('msg_modal').close();
                    setinputs({ msgContent: '' })
                    toast.success("Message sent successfully");
                }, 500);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setSendingData(false);
        }
    };
    return (
        <>
            <ToastContainer icon={false} />
            <dialog id="login_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4 text-center">Please Login First!</h3>
                    <label className="input input-bordered flex items-center gap-2 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                        <input type="email" className="grow" placeholder="Email" value={inputs.emailId} name="emailId" onChange={change} />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                        <input type="password" className="grow" placeholder='Password' value={inputs.password} name='password' onChange={change} />
                    </label>
                    <Link className='text-blue-500 hover:text-underline' to='/forgotPassword'>Forgot Password?</Link>
                    <button className="w-full my-3 bg-black text-center text-white outline-none py-2 rounded-md border border-gray-300 hover:shadow-x duration-150 ease-in-out hover:bg-red-500 focus:bg-red-500" onClick={handleLogin}>Login</button>
                    <p className='text-center'>Doesn't have an account? <button className='text-blue-500 cursor-pointer' onClick={() => {
                        document.getElementById('signup_modal').showModal()
                        document.getElementById('login_modal').close()
                    }
                    }
                    >Create one</button></p>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
            <dialog id="signup_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4 text-center">Fill the details below</h3>
                    <label className="input input-bordered flex items-center gap-2 mb-3">
                        <input type="text" className="grow" placeholder="FirstName" name='firstName' value={inputs.firstName} onChange={change} />
                    </label>
                    <label className="input input-bordered flex items-center gap-2 mb-3">
                        <input type="text" className="grow" placeholder='LastName' name='lastName' value={inputs.lastName} onChange={change} />
                    </label>
                    <label className="input input-bordered flex items-center gap-2 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                        <input type="email" className="grow" placeholder="Email" value={inputs.emailId} name="emailId" onChange={change} />
                    </label>
                    <label className="input input-bordered flex items-center gap-2 mb-3">

                        <input type="text" className="grow" placeholder="UserName" name='userName' value={inputs.userName} onChange={change} />
                    </label>
                    <label className="input input-bordered flex items-center gap-2 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                        <input type="password" className="grow" placeholder="Password" value={inputs.userPassword} name='userPassword' onChange={change} />
                    </label>
                    <button className="w-full my-3 bg-black text-center text-white outline-none py-2 rounded-md border border-gray-300 hover:shadow-x duration-150 ease-in-out hover:bg-red-500 focus:bg-red-500" onClick={handleSignup}>SignUp</button>
                    <p className='text-center'>Already have an account? <button className='text-blue-500 cursor-pointer' onClick={() => {
                        document.getElementById('login_modal').showModal()
                        document.getElementById('signup_modal').close()
                    }}>Login</button></p>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
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
            <dialog id="msg_modal" className="modal ">
                <div className="modal-box">
                    <h3 className="text-lg text-center font-semibold mb-4"> Write your message here </h3>
                    <label className="input input-bordered flex items-center gap-2">
                        <IoIosMail fontSize={20} />
                        <input type="text" className="grow" placeholder='Write your message' value={inputs.msgContent} name='msgContent' onChange={change} />
                    </label>
                    <button className="w-full my-3 bg-black text-center text-white outline-none py-2 rounded-md border border-gray-300 hover:shadow-x duration-150 ease-in-out hover:bg-red-500 focus:bg-red-500" onClick={handleMessage} >
                        <span className={sendingData ? 'loading loading-spinner' : ''}>Send</span> </button>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>

        </>
    )
}

export default Modal