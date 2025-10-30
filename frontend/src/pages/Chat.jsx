import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { FaPaperPlane } from 'react-icons/fa';

const ConversationList = ({ conversations, onSelect, selectedId, currentUserId }) => (
  <div className="flex-shrink-0 w-full md:w-1/3 border-r border-base-300 bg-base-200 overflow-y-auto">
    <div className="p-4 border-b border-base-300">
      <h2 className="text-xl font-bold">Inbox</h2>
    </div>
    <ul className="menu p-0">
      {conversations?.map((convo) => {
        const otherParticipant = convo.participants.find(p => p._id !== currentUserId);
        if (!otherParticipant) return null;

        return (
          <li key={convo._id} onClick={() => onSelect(convo)} className={selectedId === convo._id ? 'bordered' : ''}>
            <a>
              <div className="flex items-center space-x-3">
                <div className="avatar">
                  <div className="mask mask-squircle w-12 h-12">
                    <img src={convo.product.images[0]?.url || '/placeholder.jpg'} alt={convo.product.title} />
                  </div>
                </div>
                <div>
                  <div className="font-bold">{otherParticipant.name}</div>
                  <div className="text-sm opacity-50 truncate">{convo.product.title}</div>
                </div>
              </div>
            </a>
          </li>
        );
      })}
    </ul>
  </div>
);

const ChatWindow = ({ conversation }) => {
    const { user } = useAuth();
    const { socket } = useSocket();
    const queryClient = useQueryClient();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const { isLoading: isLoadingMessages } = useQuery({
        queryKey: ['messages', conversation?._id],
        queryFn: () => api.get(`/chat/${conversation._id}/messages`).then(res => res.data),
        enabled: !!conversation,
        onSuccess: (data) => setMessages(data),
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!socket || !conversation) return;

        socket.emit('join chat', conversation._id);

        const messageListener = (newMessage) => {
            if (newMessage.conversation._id === conversation._id) {
                setMessages(prev => [...prev, newMessage]);
            }
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            queryClient.invalidateQueries({ queryKey: ['messages', newMessage.conversation._id] });
        };
        socket.on('message received', messageListener);

        return () => {
            socket.off('message received', messageListener);
        };
    }, [socket, conversation, queryClient]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;

        socket.emit('new message', {
            conversationId: conversation._id,
            senderId: user._id,
            content: newMessage,
        });

        const optimisticMessage = {
            _id: Date.now(),
            sender: user,
            content: newMessage,
            createdAt: new Date().toISOString()
        }
        setMessages(prev => [...prev, optimisticMessage]);
        setNewMessage('');
        
        queryClient.invalidateQueries({ queryKey: ['messages', conversation._id] });
    };

    if (!conversation) {
        return <div className="flex-grow flex items-center justify-center h-full bg-base-100"><div className="text-center"><p className="text-xl text-base-content/60">Select a conversation to start chatting</p></div></div>
    }

    const otherParticipant = conversation.participants.find(p => p._id !== user._id);

    return (
        <div className="flex-grow h-full flex flex-col">
            <div className="p-4 border-b border-base-300 bg-base-200 flex-shrink-0">
                <h3 className="font-bold">{otherParticipant?.name || 'User'}</h3>
                <p className="text-sm opacity-60">{conversation.product.title}</p>
            </div>
            <div className="flex-grow p-4 overflow-y-auto bg-base-100">
                 {isLoadingMessages ? <div className="flex justify-center items-center h-full"><Spinner /></div> : messages.map(msg => (
                     <div key={msg._id} className={`chat ${msg.sender?._id === user._id ? 'chat-end' : 'chat-start'}`}>
                        <div className="chat-header text-xs opacity-50">{msg.sender?.name || '...'}</div>
                        <div className={`chat-bubble ${msg.sender?._id === user._id ? 'chat-bubble-primary' : ''}`}>{msg.content}</div>
                    </div>
                ))}
                 <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-base-200 border-t border-base-300 flex-shrink-0">
                <form onSubmit={handleSendMessage} className="join w-full">
                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="input input-bordered join-item w-full" />
                    <button type="submit" className="btn btn-primary join-item" aria-label="Send message"><FaPaperPlane /></button>
                </form>
            </div>
        </div>
    )
};


const ChatPage = () => {
  const [selectedConvo, setSelectedConvo] = useState(null);
  const { user } = useAuth();
  const { socket } = useSocket();

  useEffect(() => {
    if (socket && user) {
        socket.emit('setup', user._id);
    }
  }, [socket, user]);

  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => api.get('/chat').then(res => res.data),
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;
  }
   if (!user) {
    return <div className="text-center p-10">Please log in to view messages.</div>;
  }

  return (
    <div className="card card-side bg-base-100 shadow-xl h-[75vh] overflow-hidden">
      <ConversationList conversations={conversations || []} onSelect={setSelectedConvo} selectedId={selectedConvo?._id} currentUserId={user._id} />
      <ChatWindow conversation={selectedConvo} />
    </div>
  );
};

export default ChatPage;