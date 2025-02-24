import axios from "axios";
import { useEffect, useState } from "react";
import io,{ Socket } from "socket.io-client";

type User = {
  id: string;
  name: string;
};


const socket: typeof Socket = io("http://localhost:3000", {
  transports: ["websocket"]
  
});

const OnlineUsers = () => {
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null); // Store authenticated user

  useEffect(() => {
    
    axios
      .get("/api/auth/me")
      .then((response) => {
        setLoggedInUser(response.data);
        socket.emit("user-joined", response.data); 
      })
      .catch((error) => {
        console.error("Error fetching logged-in user:", error);
      });

    //  Fetch online users list
    axios
      .get("/api/users/online")
      .then((response) => {
        setOnlineUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching online users:", error);
        setOnlineUsers([]);
      });

    socket.on("update-online-users", (users: User[]) => {
      
      console.log("Updated online users:", users);
      setOnlineUsers(users);
    });

    return () => { 
      socket.off("update-online-users");
    };
  }, []);

  return (
    <div>
      <h1>Online Users</h1>
      {loggedInUser && <p>Welcome, {loggedInUser.name}!</p>} {/* Show logged-in user */}
      <ul>
        {onlineUsers.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}: (
          <p>No users online</p> 
        )
      </ul>
    </div>
  );
};

export default OnlineUsers;
