import React from 'react'
import { Circles } from 'react-loader-spinner'

const Spinner = ({ msg }) => {
    return (
        <div className=' flex flex-col justify-center items-center w-full h-full'>
            <Circles
                color='#00BFFF'
                height={60}
                width={60}
            />
            <p className='text-lg text-center'>{msg}</p>
        </div>
    )
}

export default Spinner