import { useEffect, useState } from "react";
import io,{ Socket } from "socket.io-client";

type User = {
  id: string;
  name: string;
};

const OnlineUsers = () => {
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const socket: typeof Socket = io("http://localhost:5000");

  useEffect(() => {
    socket.emit("user-joined", { id: "user1", name: "John Doe" }); // Send user info

    // Listen for updates to the online users
    socket.on("update-online-users", (users: User[]) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Online Users</h1>
      <ul>
        {onlineUsers.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUsers;
