import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';


const HomePage = () => {
const navigate = useNavigate();
const handleClick =  () => {
    navigate('/analysis');
}


    return(
        <>
        <h1>This is the homepage mannnnnnnn</h1>
        <button onClick={handleClick}>Take me to Analysis</button>
        
        <h3 style={{color:'white'}}> I am the all spark </h3> ok
        </>
    )
};

export default HomePage;