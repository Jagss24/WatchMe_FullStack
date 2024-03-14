import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'
import NotFound from '../assets/notFound.svg'
import axios from 'axios'
import basePort from './basePort'

const Category = () => {
    const [loading, setLoading] = useState(false)
    const [pins, setPins] = useState(null)
    const port = basePort
    const categoryId = useParams()
    const categoryName = categoryId.categoryId

    const fetchByCategory = async (categoryname) => {
        // setLoading(true)
        await axios.post(`${port}/api/v2/category`, { categoryId: categoryname }).then(res => {
            setPins(res.data.pins)
            setLoading(false)
        })
    }

    useEffect(() => {
        setLoading(true)
        fetchByCategory(categoryName)

    }, [categoryName])

    if (loading) return <Spinner msg={'New Feeds are loading...'} />

    if (!pins?.length) return (
        <div className='w-full h-screen flex flex-col justify-center items-center'>
            <p>Sorry No Feed Available</p>
            <img src={NotFound} alt="notFound" className='mt-5 md:w-[30%] w-[80%]' />
        </div>
    )
    return (
        <div>
            {<MasonryLayout pins={pins} />}
        </div>
    )
}

export default Category