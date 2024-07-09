import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("https://message-emiter.vercel.app/", {
  transports: ["websocket"],
});

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");

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
      <h1>Chat Application</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
}

export default ChatApp;
