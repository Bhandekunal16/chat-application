import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";

import "../style/dashboard.css";

const socket = io("https://message-emiter.vercel.app/", {
  transports: ["websocket"],
});

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");

  const remove = (id, value) => {
    console.log({ id, value });
  };

  useEffect(() => {
    const usernameFromStorage = localStorage.getItem("username");

    if (usernameFromStorage) {
      setUsername(usernameFromStorage);
    } else {
      const usernamePrompt = prompt("Enter your username:");
      if (usernamePrompt) {
        setUsername(usernamePrompt);
        localStorage.setItem("username", usernamePrompt);
      }
    }
  }, []);

  useEffect(() => {
    axios
      .get("https://message-emiter.vercel.app/api/messages")
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch messages:", err);
      });

    socket.on("chat message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [newMessage]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    axios
      .post("http://message-emiter.vercel.app/api/messages", {
        username,
        message: newMessage,
      })
      .then((res) => {
        console.log(res.data);
        setNewMessage("");
      })
      .catch((err) => {
        console.error("Failed to send message:", err);
      });
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>Robotic</h1>
      </div>

      <div className="messages-dashboard">
        {messages.map((msg, index) => (
          <p key={index}>
            <strong onClick={() => remove(msg.username, msg.message)}>
              {msg.username}
            </strong>
            : {msg.message}
          </p>
        ))}
      </div>
      <div className="messages-sender-dashboard">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatApp;
