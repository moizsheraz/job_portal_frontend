"use client";
import React, { useState, useEffect, useRef, FormEvent, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { getUserChats, getChatMessages, markMessagesAsRead } from '../services/chatService';
import { userService } from '../services/userService';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { 
  Send, 
  Image, 
  Paperclip, 
  ChevronLeft, 
  Search, 
  MoreVertical,
  CheckCheck,
  MessageSquare,
  Users
} from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface User {
  _id: string;
  name: string;
  profilePicture?: string;
}

interface Participant {
  _id: string;
  name: string;
  profilePicture?: string;
}

interface Chat {
  _id: string;
  participants: Participant[];
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
}

interface Message {
  _id: string;
  content: string;
  sender: User;
  chatId: string;
  createdAt: Date;
  read?: boolean;
}

const ChatComponent = () => {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Helper functions
  const getOtherParticipant = useCallback((chat: Chat): Participant => {
    if (!user || !chat?.participants || chat.participants.length === 0) {
      return { _id: '', name: 'Unknown', profilePicture: '' };
    }
    return chat.participants.find(p => p._id !== user._id) || chat.participants[0];
  }, [user]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  const filteredChats = useCallback(() => {
    try {
      return chats.filter(chat => {
        const participant = getOtherParticipant(chat);
        return participant?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      });
    } catch (error) {
      console.error('Error filtering chats:', error);
      return [];
    }
  }, [chats, searchQuery, getOtherParticipant]);

  // Effects
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const userData = await userService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    socketRef.current = io(process.env.NEXT_PUBLIC_API_BASE_URL || '', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      autoConnect: true,
      path: '/socket.io',
    });

    const socket = socketRef.current;

    const onConnect = () => {
      setIsConnected(true);
      loadChats();
    };

    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      if (selectedChat) {
        socket.emit('leave_room', selectedChat._id);
      }
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!selectedChat || !socketRef.current) return;
    
    const loadAndJoinChat = async () => {
      try {
        setIsLoading(true);
        await loadMessages();
        socketRef.current?.emit('join_room', selectedChat._id);
        await markMessagesAsRead(selectedChat._id);
        setChats(prev => prev.map(chat => 
          chat._id === selectedChat._id ? { ...chat, unreadCount: 0 } : chat
        ));
      } catch (error) {
        console.error('Error loading chat:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAndJoinChat();
  }, [selectedChat]);

  useEffect(() => {
    if (!socketRef.current || !selectedChat || !user) return;

    const socket = socketRef.current;

    const handleReceiveMessage = (message: Message) => {
      if (!message?._id || !message.chatId) return;
      
      if (selectedChat && message.chatId === selectedChat._id) {
        setMessages(prev => {
          if (prev.some(msg => msg._id === message._id)) return prev;
          return [...prev, message];
        });
        
        if (message?.sender?._id !== user._id) {
          markMessagesAsRead(selectedChat._id);
          audioRef.current?.play().catch(error => console.log('Error playing sound:', error));
        }
      }

      setChats(prev => prev.map(chat => 
        chat._id === message.chatId
          ? { 
              ...chat, 
              lastMessage: message.content, 
              lastMessageTime: new Date(),
              unreadCount: chat._id === selectedChat?._id ? 0 : (chat.unreadCount || 0) + 1
            }
          : chat
      ));
    };

    const handleUserTyping = (data: { roomId: string; userId: string; isTyping: boolean }) => {
      if (!data || !selectedChat || !user) return;
      if (data.roomId === selectedChat._id && data.userId !== user._id) {
        setIsTyping(data.isTyping);
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_typing', handleUserTyping);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_typing', handleUserTyping);
    };
  }, [selectedChat, user]);

  useEffect(() => {
    audioRef.current = new Audio('/message-sound.mp3');
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handlers
  const loadChats = async () => {
    try {
      setIsLoading(true);
      const data = await getUserChats();
      setChats(data || []);
    } catch (error) {
      console.error('Error loading chats:', error);
      setChats([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!selectedChat) return;
    try {
      const data = await getChatMessages(selectedChat._id);
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    }
  };

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !user || !socketRef.current) return;

    const socket = socketRef.current;
    const messageToSend = {
      roomId: selectedChat._id,
      sender: user._id,
      message: newMessage.trim()
    };

    socket.emit('send_message', messageToSend);
    
    const otherParticipant = selectedChat.participants.find(p => p._id !== user._id);
    if (otherParticipant) {
      socket.emit('send-notification', {
        recipientId: otherParticipant._id,
        message: `You have a new message from ${user.name}`,
        type: "Message!"
      });
    }
    
    const optimisticMessage: Message = {
      _id: Date.now().toString(),
      content: newMessage.trim(),
      sender: user,
      chatId: selectedChat._id,
      createdAt: new Date(),
      read: false
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');
    scrollToBottom();
  };

  const handleTyping = () => {
    if (!selectedChat || !user || !socketRef.current) return;
    
    const socket = socketRef.current;
    
    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', {
        roomId: selectedChat._id,
        userId: user._id,
        isTyping: true
      });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('typing', {
        roomId: selectedChat._id,
        userId: user._id,
        isTyping: false
      });
    }, 1000);
  };

  // Render
  if (isLoading && !user) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <div className="w-full md:w-1/3 border-r border-gray-200 bg-gray-200 shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <Skeleton className="h-8 w-1/2 mb-4" />
              <Skeleton className="h-10 w-full rounded-full" />
            </div>
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-white shadow-lg p-8">
            <Skeleton className="h-16 w-16 rounded-full mb-6" />
            <Skeleton className="h-6 w-3/4 mb-3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Chat List */}
        <div className="w-full md:w-1/3 border-r border-gray-200 bg-gray-200 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center">
                <Users className="mr-2 text-yellow-600" />
                Messages
              </h2>
            </div>
            <div className="relative rounded-full">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 text-black border-gray-200 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-220px)]">
            {isLoading ? (
              <div className="p-4 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))}
              </div>
            ) : filteredChats().length > 0 ? (
              filteredChats().map((chat) => {
                const participant = getOtherParticipant(chat);
                return (
                  <div
                    key={chat._id}
                    className={cn(
                      "p-4 cursor-pointer hover:bg-[#00214D]/90 transition-all duration-200 border-b border-gray-100 group",
                      selectedChat?._id === chat._id ? 'bg-[#004080]' : 'bg-[#00214D] text-white'
                    )}
                    onClick={() => setSelectedChat(chat)}
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 ring-2 ring-opacity-50 group-hover:ring-blue-300 transition-all duration-300 group-hover:scale-105">
                        <AvatarImage src={participant.profilePicture} />
                        <AvatarFallback className="bg-blue-500 text-white font-semibold">
                          {participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-xl text-white text-md truncate transition-colors">
                            {participant.name}
                          </h3>
                          <span className="text-xs whitespace-nowrap">
                            {chat.lastMessageTime && formatDistanceToNow(new Date(chat.lastMessageTime), { addSuffix: true })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm truncate opacity-70 group-hover:opacity-100 transition-opacity">
                            {chat.lastMessage}
                          </p>
                          {chat.unreadCount ? (
                            <span className="bg-yellow-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                              {chat.unreadCount}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-gray-500 space-y-3">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
                <p>{searchQuery ? 'No matching chats found' : 'No conversations yet'}</p>
                <p className="text-sm text-gray-400">Start a new conversation or invite friends</p>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Chat Window */}
        <div className="hidden md:flex flex-1 flex-col bg-white shadow-lg">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-[#00214D] text-white flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 ring-2 ring-white/30">
                    <AvatarImage src={getOtherParticipant(selectedChat).profilePicture} />
                    <AvatarFallback className="text-white font-semibold">
                      {getOtherParticipant(selectedChat).name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-xl text-white">{getOtherParticipant(selectedChat).name}</h3>
                    <p className="text-sm text-blue-100 animate-pulse">
                      {isTyping ? 'Typing...' : isConnected ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-gray-100 space-y-4 h-[calc(100vh-250px)]">
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                        <Skeleton className={`h-16 w-3/4 rounded-lg ${i % 2 === 0 ? 'rounded-bl-none' : 'rounded-br-none'}`} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages?.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${
                          message?.sender?._id === user?._id ? 'justify-end' : 'justify-start'
                        } animate-fadeIn`}
                      >
                        <div
                          className={cn(
                            "max-w-[75%] rounded-2xl p-4 shadow-sm transition-all duration-300 transform hover:scale-[1.02]",
                            message?.sender?._id === user?._id
                              ? 'bg-yellow-600 text-white font-bold rounded-br-sm' 
                              : 'bg-white shadow-md text-gray-800 border border-gray-200 rounded-bl-sm'
                          )}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <div className="flex items-center justify-end mt-2 space-x-2">
                            <span className="text-xs opacity-70">
                              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                            </span>
                            {message?.sender?._id === user?._id && (
                              <CheckCheck
                                size={16}
                                className={message.read ? 'text-blue-200' : 'text-gray-300'}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input */}
              <form 
                onSubmit={handleSendMessage} 
                className="p-4 bg-[#00214D] border-t border-gray-100 sticky bottom-0"
              >
                <div className="flex items-center bg-white space-x-3 rounded-full p-2 shadow-lg">
                  <button type="button" className="text-gray-500 hover:text-yellow-600 p-2">
                    <Paperclip size={20} />
                  </button>
                  <Input
                    ref={inputRef}
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      handleTyping();
                    }}
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0"
                  />
                  <Button 
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-full transition-colors p-2 h-10 w-10"
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center">
              <div className="max-w-md">
                <MessageSquare className="mx-auto h-16 w-16 text-yellow-600 mb-6 animate-bounce" />
                <h3 className="text-2xl font-semibold text-gray-700 mb-3">Start a Conversation</h3>
                <p className="text-gray-500 mb-6">
                  Select a chat from the sidebar or start a new conversation with your contacts.
                </p>
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                  New Message
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile View */}
        {selectedChat && (
          <div className="md:hidden fixed inset-0 bg-white z-10 flex flex-col">
            {/* Mobile Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-[#00214D] text-white flex items-center">
              <button 
                onClick={() => setSelectedChat(null)}
                className="text-white hover:text-gray-300 mr-2"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="flex items-center space-x-3 flex-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={getOtherParticipant(selectedChat).profilePicture} />
                  <AvatarFallback className="text-white">
                    {getOtherParticipant(selectedChat).name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-white">{getOtherParticipant(selectedChat).name}</h3>
              </div>
              <button className="text-white hover:text-gray-300">
                <MoreVertical size={20} />
              </button>
            </div>

            {/* Mobile Messages */}
            <ScrollArea className="flex-1 p-4 bg-gray-50">
              <div className="space-y-3">
                {messages?.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${
                      message?.sender?._id === user?._id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg p-3 transition-all duration-200 ${
                        message?.sender?._id === user?._id
                          ? 'bg-yellow-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-end mt-1 space-x-1">
                        <span className="text-xs opacity-70">
                          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                        </span>
                        {message?.sender?._id === user?._id && (
                          <CheckCheck
                            size={16}
                            className={message.read ? 'text-blue-200' : 'text-gray-400'}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Mobile Message Input */}
            <form 
              onSubmit={handleSendMessage} 
              className="p-4 border-t border-gray-200 bg-[#00214D]"
            >
              <div className="flex items-center space-x-2">
                <button type="button" className="text-white hover:text-yellow-400 p-2">
                  <Paperclip size={20} />
                </button>
                <Input
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  placeholder="Type a message..."
                  className="flex-1 bg-white border-none rounded-full focus-visible:ring-1 focus-visible:ring-yellow-500"
                />
                <Button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="rounded-full bg-yellow-600 text-white hover:bg-yellow-700 transition-colors duration-200 p-2 h-10 w-10"
                >
                  <Send size={18} />
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ChatComponent;