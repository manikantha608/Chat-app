import React, { useContext, useEffect, useState } from 'react';
import './myStyles.css';
import logo from "../Images/whatsapp-logo.png";
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { AnimatePresence, motion } from "framer-motion";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { myContext } from "./MainContainer";

const Users = () => {
  const { refresh, setRefresh } = useContext(myContext);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const userData = JSON.parse(localStorage.getItem("userData"));
  const nav = useNavigate();
  
  if (!userData) {
    console.log("User not Authenticated");
    nav(-1);
  }

  useEffect(() => {
    console.log("User refreshed");
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };
    axios.get("http://localhost:9000/user/fetchUsers", config).then((data) => {
      console.log("user Data from API", data);
      setUsers(data.data);
    });
  }, [refresh]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: "0.3" }}
        className='list-container'
      >
        <div className='ug-header'>
          <img src={logo} style={{ height: "32px", width: "32px" }} alt='logo'/>
          <p className='ug-title'>Available Users</p>
          <IconButton
            className='icon'
            onClick={() => {
              setRefresh(!refresh);
              console.log("first click");
            }}
          >
            <RefreshIcon />
          </IconButton>
        </div>
        <div className='sb-search'>
          <IconButton>
            <SearchIcon />
          </IconButton>
          <input
            placeholder='search'
            className='search-box'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className='ug-list'>
          {filteredUsers.map((user, index) => (
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className='list-item'
              key={index}
              onClick={() => {
                console.log("Creating chat with", user.name);
                console.log("second click");
                const config = {
                  headers: {
                    Authorization: `Bearer ${userData.data.token}`
                  }
                };
                axios.post(
                  "http://localhost:9000/chat/",
                  { userId: user._id },
                  config
                );
              }}
            >
              <p className='con-icon'>{user.name[0]}</p>
              <p className='con-title'>{user.name}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Users;
