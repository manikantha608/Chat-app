import React, { useContext, useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MessageSelf from "./MessageSelf";
import MessageOthers from "./MessageOthers";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import { myContext } from "./MainContainer";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:9000";

var socket;

function ChatArea() {
  const [messageContent, setMessageContent] = useState("");
  const [isTyping, setIsTyping] = useState(false); // Track if there's content in the input
  const dyParams = useParams();
  const [chat_id, chat_user] = dyParams._id.split("&");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [allMessages, setAllMessages] = useState([]);
  const { refresh, setRefresh } = useContext(myContext);
  const [loaded, setLoaded] = useState(false);
  const [socketConnectionStatus, setSocketConnectionStatus] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };
    axios
      .post(
        "http://localhost:9000/message/",
        {
          content: messageContent,
          chatId: chat_id,
        },
        config
      )
      .then(({ response }) => {
        console.log("Message Fired", response);
      });
    setMessageContent("");
    setIsTyping(false); // Reset typing state after sending message
    setRefresh(!refresh);
  };

  const clearMessages = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };
    axios
      .delete(`http://localhost:9000/message/${chat_id}`, config)
      .then(() => {
        setAllMessages([]);
      })
      .catch((error) => {
        console.error("Error clearing messages: ", error);
      });
  };

  // Connect to socket
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userData);
    socket.on("connected", () => {
      setSocketConnectionStatus(true);
    });
  }, [userData]);

  // New message received
  useEffect(() => {
    socket.on("message received", (newMessage) => {
      if (!allMessages || allMessages._id !== newMessage._id) {
        setAllMessages((prevMessages) => [...prevMessages, newMessage]);
        scrollToBottom();
      }
    });
  }, [allMessages]);

  // Fetch data
  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };
    axios
      .get(`http://localhost:9000/message/${chat_id}`, config)
      .then(({ data }) => {
        setAllMessages(data);
        setLoaded(true);
        socket.emit("join chat", chat_id);
        scrollToBottom();
      });
  }, [refresh, chat_id, userData.data.token]);

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  if (!loaded) {
    return (
      <div
        style={{
          border: "20px",
          padding: "10px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
        <Skeleton
          variant="rectangular"
          sx={{
            width: "100%",
            borderRadius: "10px",
            flexGrow: "1",
          }}
        />
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
      </div>
    );
  } else {
    return (
      <div className="chatArea-container">
        <div className="chatArea-header">
          <p className="con-icon">{chat_user[0]}</p>
          <div className="header-text">
            <p className="con-title">{chat_user}</p>
          </div>
          <Tooltip title="Clear">
            <IconButton onClick={clearMessages}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
        <div className="message-container">
          {allMessages.map((message, index) => {
            const sender = message.sender;
            const self_id = userData.data._id;
            return sender._id === self_id ? (
              <MessageSelf props={message} key={index} />
            ) : (
              <MessageOthers props={message} key={index} />
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <div className="text-input-area">
          <input
            placeholder="Type a Message"
            className="search-box"
            value={messageContent}
            onChange={(e) => {
              setMessageContent(e.target.value);
              setIsTyping(e.target.value.length > 0); // Set typing state based on input content
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                sendMessage();
              }
            }}
          />
          {isTyping && (
            <Tooltip title="Send">
              <IconButton
                className="icon"
                onClick={() => {
                  sendMessage();
                }}
              >
                <SendIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </div>
    );
  }
}

export default ChatArea;
