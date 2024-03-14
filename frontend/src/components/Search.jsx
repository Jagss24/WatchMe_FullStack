import React, { useState, useEffect } from "react";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import NotFound from "../assets/notFound.svg";
import axios from "axios";
import basePort from './basePort';

const Search = ({ searchTerm, setSearchTerm }) => {
    const port = basePort
    const [pins, setPins] = useState(null)
    const [loading, setLoading] = useState(false)

    const getSearchPins = async (searchTerm) => {
        await axios.post(`${port}/api/v5/search`, { searchTerm }).then((res) => {
            setPins(res.data.pins)
            setLoading(false)
        })
    }

    useEffect(() => {
        setLoading(true)
        getSearchPins(searchTerm)

    }, [searchTerm])

    return (
        <div>
            {loading && <Spinner msg={"Searching for Pins"} />}
            {pins?.length !== 0 && <MasonryLayout pins={pins} />}
            {pins?.length === 0 && searchTerm !== "" && !loading && (
                <div className="w-full h-screen flex flex-col justify-center items-center">
                    <p>Sorry 🙇 No Pins found</p>
                    <img src={NotFound} className="w-[30%] mt-5" alt="" />
                </div>
            )}
        </div>
    )
}

export default Search