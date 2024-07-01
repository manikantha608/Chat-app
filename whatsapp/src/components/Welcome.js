import React from 'react'
import logo from "../Images/whatsapp-logo.png";
import {motion} from "framer-motion";
import { useNavigate } from 'react-router-dom';

const Welcome = () => {

  //if user not authenticated then go to login page
  const userData = JSON.parse(localStorage.getItem("userData"));
  const nav = useNavigate();
  if(!userData){
    console.log("User not Authenticated");
    nav("/")
  }

 
  return (
    <div className='welcome-container'>
      <motion.img 
      drag
      whileTap={{scale:1.05,rotate:360}}
      src={logo}
      alt='Logo'
      className='welcome-logo'
      />
      <b>Welcome, {userData.data.name} 👋</b>
      <p>Send and receive messages without keeping your phone online. </p>
        <p>Use WhatsApp on up to 4 linked devices and 1 phone at the same time.</p>
    </div>
  )
}

export default Welcome;
