import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';

interface User {
  _id?: string;  
  name?: string;
  profilePicture?: string;
  picture?: string; 
  given_name?: string;
  family_name?: string;
  email?: string;
}

interface Notification {
  id: string;
  sender: User;
  content: string;
  chatId: string;
  timestamp: Date;
  read: boolean;
}

interface ChatNotificationsProps {
  currentUser: User | null; 
}

const ChatNotifications: React.FC<ChatNotificationsProps> = ({currentUser }) => {
    const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        autoConnect: true,
        path: '/socket.io',
        extraHeaders: {
          'Access-Control-Allow-Credentials': 'true'
        }
      });
      console.log(socket);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    if (!socket || !currentUser) return;

    const handleReceiveMessage = (message: { 
      _id: string;
      sender: User;
      content: string;
      chatId: string;
      createdAt: string;
    }) => {
      // Updated check to handle optional _id
      if (message.sender._id === currentUser._id) return;

      const newNotification: Notification = {
        id: message._id,
        sender: message.sender,
        content: message.content,
        chatId: message.chatId,
        timestamp: new Date(message.createdAt),
        read: false
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 19)]);
      setUnreadCount(prev => prev + 1);
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, currentUser]);

  const handleNotificationClick = (notification: Notification) => {
    setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    router.push(`/indox?chat=${notification.chatId}`);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  // More robust getInitials function to handle UserData
  const getInitials = (user: User | undefined): string => {
    if (!user) return '?';
    
    // Try name first
    if (user.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    
    // Fall back to given_name and family_name
    if (user.given_name || user.family_name) {
      return `${user.given_name?.[0] || ''}${user.family_name?.[0] || ''}`.toUpperCase();
    }
    
    return '?';
  };

  // Helper to get profile picture URL
  const getProfilePicture = (user: User | undefined): string | undefined => {
    return user?.profilePicture || user?.picture;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative p-2 rounded-full text-[#00214D] hover:bg-[#00214D] hover:text-white transition-colors" aria-label="Notifications">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[18px] h-5 flex items-center justify-center rounded-full px-1 border-2 border-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 rounded-xl shadow-lg p-0">
        <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-[#00214D] text-white rounded-t-xl">
          <h3 className="font-bold">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs text-blue-200 hover:text-white hover:bg-blue-600/20" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        
        <ScrollArea className="max-h-[350px]">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`} onClick={() => handleNotificationClick(notification)}>
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={getProfilePicture(notification.sender)} />
                    <AvatarFallback className="bg-blue-500 text-white">
                      {getInitials(notification.sender)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-sm text-gray-800">
                        {notification.sender.name || 'Unknown User'}
                      </h4>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate mt-1">
                      {notification.content}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="py-10 text-center text-gray-500">
              <p>No new notifications</p>
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChatNotifications;