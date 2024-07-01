import React, { useState,useEffect,useContext } from 'react'
import "./myStyles.css"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
// import BedtimeIcon from '@mui/icons-material/Bedtime';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { IconButton } from '@mui/material';
// import Conversationitem from './Conversationitem';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import { myContext } from "./MainContainer";
const Sidebar = () => {
  
  const navigate = useNavigate();
  const { refresh, setRefresh } = useContext(myContext);
  const [conversations, setConversations] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));
  // const nav = useNavigate();
  if (!userData) {
    console.log("User not Authenticated");
    navigate("/");
  }
  const user = userData.data;
  useEffect(() => {
    // console.log("Sidebar : ", user.token);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    axios.get("http://localhost:9000/chat/", config).then((response) => {
      console.log("Data refresh in sidebar ", response.data);
      setConversations(response.data);
      // setRefresh(!refresh);
    });
  }, [refresh]);
  return (
    <div className='sidebar-container'>
      <div className='sb-header'>
        <div className='other-icons'>
          <IconButton onClick={()=>{navigate("/app/welcome")}}>
            <AccountCircleIcon />
          </IconButton>
        </div>
        <div>
          <IconButton onClick={()=>{navigate("users")}}>
            <PersonAddIcon />
          </IconButton>
          <IconButton onClick={()=>{navigate("groups")}}>
            <GroupAddIcon />
          </IconButton>
          <IconButton onClick={()=>{navigate("create-groups")}}>
            <AddCircleIcon />
          </IconButton>
          {/* <IconButton >
            <BedtimeIcon />
          </IconButton> */}

          <IconButton onClick={()=>{
            localStorage.removeItem("userData");
            navigate("/")
          }}>
            <ExitToAppIcon />
          </IconButton>
        </div>
      </div>
      <div className='sb-search'>
        <IconButton>
          <SearchIcon />
        </IconButton>
        <input placeholder='search' className='search-box' />
      </div>
      <div className='sb-conversation'>
        {conversations.map((conversation,index) => {
          // if (conversation.users.length === 1) {
          //   return <div key={index}></div>;
          // }
            var chatName="";
          if(conversation.isGroupChat){
            chatName= conversation.chatName;
          }else{
            conversation.users.map((user)=>{
              if(user._id !== userData.data._id){
                chatName = user.name
              }
            })
          }
          if (conversation.latestMessage === undefined) {
            // console.log("No Latest Message with ", conversation.users[1]);
            return (
              <div
                key={index}
                onClick={() => {
                  console.log("Refresh fired from sidebar");
                  setRefresh(!refresh);
                }}
              >
                 <div
                  key={index}
                  className="conversation-container"
                  //for accsesing specific chat
                  onClick={() => {
                    navigate(
                      "chat/" +
                        conversation._id +
                        "&" +
                        chatName
                    );
                  }}
                  
                >
                <p className="con-icon">
                    {chatName[0]}
                  </p>
                  <p className="con-title">
                    {chatName}
                  </p>

                  <p className="con-lastMessage">
                    No previous Messages, click here to start a new chat
                  </p>

                  </div>
              </div>
            );
          } else {
            return (
              <div
                key={index}
                className="conversation-container"
                onClick={() => {
                  navigate(
                    "chat/" +
                      conversation._id +
                      "&" +
                      chatName
                  );
                  
                }}
              >
                
                 <p className="con-icon">
                  {chatName[0]}
                </p>
                <p className="con-title">
                  {chatName}
                </p>
                <p className="con-lastMessage">
                  {conversation.latestMessage.content}
                 
                </p>

                </div>
            );
          }
        })}
      </div>
    </div>
  );
}

export default Sidebar;
