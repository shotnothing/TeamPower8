import React from 'react';
import { FaSearch } from "react-icons/fa";
import './search_bar.css'

const search_bar = () => {
    // const [input, setInput] = useState("");
    return (
        <div className='input-wrapper'>
            <FaSearch id="search-icon" />
            <input placeholder='Type to search...' />
        </div>
    )
}

export default search_bar

// https://www.youtube.com/watch?v=sWVgMcz8Q44