"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, ChevronDown, Loader2 } from 'lucide-react';
import { io } from 'socket.io-client';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { userService } from '@/app/services/userService';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

interface Notification {
  _id: string;
  userId: string;
  message: string;
  type: 'shortlisted' | 'Message!' | 'new_job' | 'application_update';
  isRead: boolean;
  createdAt: string;
  sender?: User;
  chatId?: string;
  jobId?: string;
}

const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  autoConnect: true,
  path: '/socket.io',
  extraHeaders: {
    'Access-Control-Allow-Credentials': 'true'
  }
});

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const notificationSound = useRef<HTMLAudioElement | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  // Initialize audio
  useEffect(() => {
    notificationSound.current = new Audio('/notification-sound.mp3');
    notificationSound.current.volume = 0.3;
  }, []);
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await userService.getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error("Error fetching current user", err);
      }
    };
    fetchCurrentUser();
  }, []);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) return;
  
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications?userId=${currentUser._id}`);
        const data = await response.json();
        if (data.success) {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount);
        }
      } catch (err) {
        console.error("Error fetching notifications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [currentUser]);
  

  // Socket connection handlers
  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      console.log('Socket connected');
    };

    const onDisconnect = () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    };

    const onNotification = (notification: Notification) => {
      console.log('New notification received:', notification);
      
      // Only process if notification is for current user
      if (notification.userId === currentUser?._id) {
        setNotifications(prev => [notification, ...prev.slice(0, 19)]);
        setUnreadCount(prev => prev + 1);
        
        // Play sound if dropdown is closed
        if (!isOpen && notificationSound.current) {
          notificationSound.current.play().catch(e => console.log('Audio play failed:', e));
        }
      }
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('new-notification', onNotification);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('new-notification', onNotification);
    };
  }, [currentUser?._id, isOpen]);

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications/${notificationId}/read`, {
        method: 'PATCH'
      });

      setNotifications(prev =>
        prev.map(n => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications/mark-all-read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUser?._id })
      });

      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    if (notification.type === 'Message!') {
      router.push(`/indox`);
    } 
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'Message!':
        return '💬';
      case 'shortlisted':
        return '🏆';
      case 'new_job':
        return '📢';
      case 'application_update':
        return '🔄';
      default:
        return '🔔';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
     <DropdownMenuTrigger className="relative h-10 w-10 rounded-full hover:bg-[#00214D]/10 transition-all duration-300 flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#00214D] focus-visible:ring-offset-2">
    <Bell className="text-[#00214D] hover:text-[#00214D]/90 transition-colors" size={28} />
    {unreadCount > 0 && (
      <span className="absolute -right-1 -top-1 h-6 w-6 rounded-full flex items-center justify-center bg-red-500 text-white text-xs font-medium border-2 border-white shadow-sm">
        {unreadCount > 9 ? '9+' : unreadCount}
      </span>
    )}
  </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      className="w-[380px] rounded-2xl p-0 shadow-xl border border-[#00214D]/20 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#00214D] to-[#004080] text-white">
        <div className="flex items-center space-x-3">
          <Bell className="h-6 w-6" />
          <h3 className="font-semibold text-lg">Notifications</h3>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full px-3 py-1 transition-all"
            onClick={markAllAsRead}
          >
            Mark all as read
          </Button>
        )}
      </div>
  
      {/* Notification List */}
      <ScrollArea className="h-[400px]">
        {loading ? (
          <div className="flex flex-col space-y-3 p-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 p-3 rounded-xl bg-gray-50 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                  <div className="h-3 w-full rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length > 0 ? (
          <div className="p-2">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification._id}
                className={cn(
                  "p-3 mx-2 my-1 rounded-xl cursor-pointer transition-all duration-200",
                  "hover:bg-[#00214D]/5 focus:bg-[#00214D]/10",
                  !notification.isRead && "bg-blue-50 border border-blue-100"
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar/Icon */}
                  <div className="flex-shrink-0 relative">
                    {notification.sender ? (
                      <Avatar className="h-11 w-11 rounded-xl border-2 border-white shadow-sm">
                        <AvatarImage src={notification.sender.profilePicture} />
                        <AvatarFallback className="bg-gradient-to-br from-[#00214D] to-[#004080] text-white font-medium">
                          {getInitials(notification.sender.name)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#00214D] to-[#004080] flex items-center justify-center text-xl text-white shadow-sm">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                    {!notification.isRead && (
                      <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-blue-500 border-2 border-white" />
                    )}
                  </div>
  
                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-[#00214D] truncate">
                        {notification.sender?.name || notification.type.replace('_', ' ')}
                      </h4>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 space-y-3">
            <div className="p-4 bg-[#00214D]/10 rounded-full">
              <Bell className="h-6 w-6 text-[#00214D]" />
            </div>
            <p className="font-medium text-[#00214D]">No notifications yet</p>
            <p className="text-sm text-gray-500 text-center max-w-[240px]">
              We'll notify you when something new arrives
            </p>
          </div>
        )}
      </ScrollArea>
  
      {/* Footer */}
      <div className="p-3 border-t border-[#00214D]/10 bg-gray-50/50">
        <Button 
          variant="ghost" 
          className="w-full text-[#00214D] hover:bg-[#00214D]/10 rounded-lg py-2 text-sm font-medium"
        >
          View all notifications
        </Button>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
  );
};

export default NotificationsDropdown;