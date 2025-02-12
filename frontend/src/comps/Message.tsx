// import React from "react";
// import  useAuthContext  from "/Users/juntrax/Desktop/Chatapp/frontend/src/context/AuthContext.ts";
// import { extractTime } from "/Users/juntrax/Desktop/Chatapp/frontend/src/utils/extractTime.ts";
// import useConversation  from "/Users/juntrax/Desktop/Chatapp/frontend/src/zustand/useConversation.ts";

// // Define the message type
// interface IMessage {
//   senderId: string;
//   message: string;
//   createdAt: string;
//   shouldShake?: boolean; // Optional, as it might not always be present
// }

// // Define the props for the Message component
// interface MessageProps {
//   message: IMessage;
// }

// const Message: React.FC<MessageProps> = ({ message }) => {
//   const { authUser } = useAuthContext();
//   const { selectedConversation } = useConversation();

//   // Ensure that authUser and selectedConversation are defined before using them
//   if (!authUser) {
//     return null; // or render some fallback UI
//   }

//   const fromMe = message.senderId === authUser._id;
//   const formattedTime = extractTime(message.createdAt);
//   const chatClassName = fromMe ? "chat-end" : "chat-start";
//   const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
//   const bubbleBgColor = fromMe ? "bg-blue-500" : "";

//   const shakeClass = message.shouldShake ? "shake" : "";

//   return (
//     <div className={`chat ${chatClassName}`}>
//       <div className="chat-image avatar">
//         <div className="w-10 rounded-full">
//           <img alt="Profile" src={profilePic || "/default-avatar.png"} /> {/* Fallback image */}
//         </div>
//       </div>
//       <div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}>
//         {message.message}
//       </div>
//       <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">{formattedTime}</div>
//     </div>
//   );
// };

// export default Message;
