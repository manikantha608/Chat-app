import React, { useEffect, useContext, useState } from 'react';
import './myStyles.css';
import logo from "../Images/whatsapp-logo.png";
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { AnimatePresence, motion } from "framer-motion";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { myContext } from "./MainContainer";

const Groups = () => {
  const { refresh, setRefresh } = useContext(myContext);
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const userData = JSON.parse(localStorage.getItem("userData"));

  const nav = useNavigate();
  if (!userData) {
    console.log("User not Authenticated");
    nav("/");
  }
  const user = userData.data;

  useEffect(() => {
    console.log("Users refreshed : ", user.token);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    axios
      .get("http://localhost:9000/chat/fetchGroups", config)
      .then((response) => {
        console.log("Group Data from API ", response.data);
        setGroups(response.data);
      });
  }, [refresh]);

  const filteredGroups = groups.filter(group =>
    group.chatName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ ease: "anticipate", duration: "0.3" }}
        className='list-container'
      >
        <div className='ug-header'>
          <img src={logo} style={{ height: "32px", width: "32px" }} alt="logo"/>
          <p className='ug-title'>Groups</p>
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
        <div className="ug-list">
          {filteredGroups.map((group, index) => {
            return (
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="list-item"
                key={index}
                onClick={() => {
                  console.log("Creating chat with group", group.name);
                  const config = {
                    headers: {
                      Authorization: `Bearer ${userData.data.token}`,
                    },
                  };
                  axios.put(
                    "http://localhost:9000/chat/addSelfToGroup",
                    {
                      chatId: group._id,
                      userId: user._id,
                    },
                    config
                  );
                }}
              >
                <p className="con-icon">{group.chatName[0]}</p>
                <p className="con-title">{group.chatName}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Groups;
