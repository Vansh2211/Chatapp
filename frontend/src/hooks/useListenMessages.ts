// import { useEffect } from "react";
// import { useSocket } from "../context/SocketContext";
// import useConversation from "../zustand/useConversation";
// import notificationSound from "../assets/sounds/notification.mp3";

// interface IMessage {
//   _id: string;
//   senderId: string;
//   message: string;
//   createdAt: string;
//   updatedAt: string;
//   shouldShake?: boolean;
// }

// const useListenMessages = () => {
//   const { socket } = useSocket();
//   const { messages, setMessages } = useConversation();

//   useEffect(() => {
//     const handleNewMessage = (newMessage: IMessage) => {
//       newMessage.shouldShake = true;
//       const sound = new Audio(notificationSound);
//       sound.play();
//       setMessages([...messages, newMessage]);
//     };

//     socket?.on("newMessage", handleNewMessage);

//     return () => {
//       socket?.off("newMessage", handleNewMessage);
//     };
//   }, [socket, setMessages, messages]);

// };

// export default useListenMessages;
