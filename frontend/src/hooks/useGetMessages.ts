import { useEffect, useState } from "react";
import useConversation from "/Users/juntrax/Desktop/Chatapp/frontend/src/zustand/useConversation";
import toast from "react-hot-toast";

interface IMessage {
  _id: string;
  senderId: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

const useGetMessages = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      if (!selectedConversation?._id) return; // Prevent fetching if selectedConversation is null

      setLoading(true);
      try {
        const res = await fetch(`/api/messages/${selectedConversation._id}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setMessages(data);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [selectedConversation, setMessages]); // Include selectedConversation in the dependency array

  return { messages, loading };
};

export default useGetMessages;
