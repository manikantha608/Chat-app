import React, { useState, useEffect, useContext } from 'react';
import './myStyles.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { myContext } from './MainContainer';

const Sidebar = () => {
  const navigate = useNavigate();
  const { refresh, setRefresh } = useContext(myContext);
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const userData = JSON.parse(localStorage.getItem('userData'));

  useEffect(() => {
    if (!userData) {
      console.log('User not Authenticated');
      navigate('/');
    }
  }, [userData, navigate]);

  const user = userData?.data;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const response = await axios.get('http://localhost:9000/chat/', config);
        console.log('Data refresh in sidebar', response.data);
        setConversations(response.data);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      }
    };

    fetchData();
  }, [refresh, conversations]);

  const getChatName = (conversation) => {
    if (conversation.isGroupChat) {
      return conversation.chatName;
    }

    const otherUser = conversation.users.find(
      (user) => user._id !== userData.data._id
    );

    return otherUser ? otherUser.name : 'Unknown User';
  };

  const filteredConversations = conversations.filter((conversation) => {
    const chatName = getChatName(conversation);
    return chatName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className='sidebar-container'>
      <div className='sb-header'>
        <div className='other-icons'>
          <Tooltip title='Home Page'>
            <IconButton onClick={() => navigate('/app/welcome')}>
              <AccountCircleIcon />
            </IconButton>
          </Tooltip>
        </div>
        <div>
          <Tooltip title='Add User'>
            <IconButton onClick={() => navigate('users')}>
              <PersonAddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Add Group'>
            <IconButton onClick={() => navigate('groups')}>
              <GroupAddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Create Group'>
            <IconButton onClick={() => navigate('create-groups')}>
              <AddCircleIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Logout'>
            <IconButton
              onClick={() => {
                localStorage.removeItem('userData');
                navigate('/');
              }}
            >
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
        </div>
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
      <div className='sb-conversation'>
        {filteredConversations.map((conversation, index) => {
          const chatName = getChatName(conversation);

          return (
            <div
              key={index}
              className='conversation-container'
              onClick={() => navigate(`chat/${conversation._id}&${chatName}`)}
            >
              <p className='con-icon'>{chatName[0]}</p>
              <p className='con-title'>{chatName}</p>
              <p className='con-lastMessage'>
                {conversation.latestMessage
                  ? conversation.latestMessage.content
                  : 'No previous Messages, click here to start a new chat'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;

