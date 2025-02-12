import { create } from 'zustand';

interface IMessage {
  _id: string;
  senderId: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

interface IConversation {
  _id: string;
  participants: string[];
  messages: IMessage[];
}

interface ConversationState {
  messages: IMessage[];
  setMessages: (messages: IMessage[]) => void;
  selectedConversation: IConversation | null;
  setSelectedConversation: (conversation: IConversation | null) => void;
}

const useConversation = create<ConversationState>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  selectedConversation: null,
  setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),
}));

export default useConversation;