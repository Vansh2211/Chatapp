// import { useEffect, useRef } from "react";
// import useGetMessages from "/Users/juntrax/Desktop/Chatapp/frontend/src/hooks/useGetMessages.ts";
// import MessageSkeleton from "/Users/juntrax/Desktop/Chatapp/frontend/src/components/MessageSkeleton.tsx";
// import Message from "./Message";
// import useListenMessages from "/Users/juntrax/Desktop/Chatapp/frontend/src/hooks/useListenMessages.ts";

// interface IMessage {
//   _id: string;
//   senderId: string;
//   message: string;
//   createdAt: string;
//   shouldShake?: boolean;
// }

// const Messages: React.FC = () => {
//   const { messages, loading } = useGetMessages();
//   useListenMessages();
//   const lastMessageRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     setTimeout(() => {
//       lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, 100);
//   }, [messages]);

//   return (
//     <div className="px-4 flex-1 overflow-auto">
//       {!loading &&
//         messages.length > 0 &&
//         messages.map((message: IMessage) => (
//           <div key={message._id} ref={lastMessageRef}>
//             <Message message={message} />
//           </div>
//         ))}

//       {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}

//       {!loading && messages.length === 0 && (
//         <p className="text-center">Send a message to start the conversation</p>
//       )}
//     </div>
//   );
// };

// export default Messages;
