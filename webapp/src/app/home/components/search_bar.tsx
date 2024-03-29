"use client"
import React, {useState} from 'react';
import { FaSearch } from "react-icons/fa";
import './search_bar.css'

// include relevant edits based on our defined API: https://github.com/shotnothing/TeamPower8/blob/main/docs/API.md

const search_bar = ({setInput, fetchData}) => {
    
    const handleChange = (value) => {
        setInput(value);
        fetchData(value);
      };

    return (
        <div className='input-wrapper'>
            <FaSearch id="search-icon" />
            <input 
            placeholder='Type to search...' 
            onChange={(e) => handleChange(e.target.value)}
            />
        </div>
    )
}

export default search_bar
