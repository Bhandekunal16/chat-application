import React, { useState, useEffect } from "react";
import io from "socket.io-client";

function ChatApp() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const socket = io("https://message-emiter.vercel.app", {
    transports: ["websocket"],
  });

  useEffect(() => {
    socket.on("chats", (newChats) => {
      console.log("Received chats from server:", newChats);
      const updatedChats = newChats.map(
        (chat) => `${chat.username}: ${chat.message}`
      );
      setChats(updatedChats);
    });
    return () => {
      socket.off("chats");
    };
  }, [chats, socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    console.log("i am here", message);

    socket.emit("message", {
      username: localStorage.getItem("username"),
      message,
    });

    setMessage("");
  };

  return (
    <div>
      <h1>Chat ChatApp</h1>
      <div>
        <ul>
          {chats.map((chat, index) => (
            <li key={index}>{chat}</li>
          ))}
        </ul>
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatApp;
