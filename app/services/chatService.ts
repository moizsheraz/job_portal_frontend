import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Get all chats for the current user
export const getUserChats = async () => {
  const response = await axios.get(`${API_URL}/api/v1/chats`, {
    withCredentials: true
  });
  return response.data;
};

// Get or create a chat with another user
export const getOrCreateChat = async (otherUserId: string, jobId: string) => {
  const response = await axios.post(`${API_URL}/api/v1/chats`, {
    otherUserId,
    jobId
  }, {
    withCredentials: true
  });
  return response.data;
};

// Get messages for a specific chat
export const getChatMessages = async (chatId: string) => {
  const response = await axios.get(`${API_URL}/api/v1/chats/${chatId}/messages`,{
    withCredentials: true
  });
  return response.data;
};

// Mark messages as read
export const markMessagesAsRead = async (chatId: string) => {
  const response = await axios.put(`${API_URL}/api/v1/chats/${chatId}/messages/read-all`, {}, {
    withCredentials: true
  });
  return response.data;
};

// Delete a chat
export const deleteChat = async (chatId: string) => {
  const response = await axios.delete(`${API_URL}/api/v1/chats/${chatId}`, {
    withCredentials: true
  });
  return response.data;
}; 