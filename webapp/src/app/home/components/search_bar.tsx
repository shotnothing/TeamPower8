"use client"
import React, {useState} from 'react';
import { FaSearch } from "react-icons/fa";
import './search_bar.css'

// include relevant edits based on our defined API: https://github.com/shotnothing/TeamPower8/blob/main/docs/API.md

const search_bar = ({setResults}) => {
    const [input, set_input] = useState("");

    // /product/all --> get product_name
    // render all if nothing is typed in text box (don't have value && in return section of results) - confirm if filter is done frontend

    const fetchData = (value) => {
        fetch("https://jsonplaceholder.typicode.com/users").then((response) => response.json())
        .then((json) => {
            // console.log(json);

            if (value === "") {
                setResults(json); // Return all data
                return;
            }
            const regex = new RegExp(value);
            const results = json.filter((row_data) => {
                return (
                    row_data &&
                    row_data.name &&
                    regex.test(row_data.name)
                  );
            });
            // console.log(results)
            setResults(results)
        });
    };

    const handleChange = (value) => {
        set_input(value);
        fetchData(value);
      };

    return (
        <div className='input-wrapper'>
            <FaSearch id="search-icon" />
            <input 
            placeholder='Type to search...' 
            value={input}
            onChange={(e) => handleChange(e.target.value)}
            />
        </div>
    )
}

export default search_bar
