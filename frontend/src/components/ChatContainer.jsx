import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx";
import ChatContainerMessageItem from "./ChatContainerMessageItem.jsx";
import { useAuthStore } from "../store/useAuthStore";
import { ArrowDown } from 'lucide-react';
import ChatContainerInfo from "./ChatContainerInfo.jsx";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [showInfo, setShowInfo] = useState(false);
  
  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, showInfo]);

  const messagesContainerRef = useRef(null);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const isAtBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
      setIsScrolledUp(!isAtBottom);
    }
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col overflow-auto relative">
      <ChatHeader showInfo={showInfo} setShowInfo={setShowInfo} />
      {showInfo && <ChatContainerInfo />}
      {
        !showInfo &&
        <>
        <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        ref={messagesContainerRef}
        onScroll={handleScroll}
        >
        {messages.map((message) => (
          <ChatContainerMessageItem
          key={message._id}
          message={message}
          authUser={authUser}
          messageEndRef={messageEndRef}
          selectedUser={selectedUser}
          />
        ))}
      </div>
      {isScrolledUp &&
        <div className="w-full flex justify-center items-center absolute bottom-0 -translate-y-18">
          <div
            className="bg-base-300 size-8 flex justify-center items-center rounded-full cursor-pointer animate-bounce"
            onClick={() => {
              messageEndRef.current.scrollIntoView({ behavior: "smooth" });
              setIsScrolledUp(false);
            }}
            title="Scroll down"
            >
            <ArrowDown className="size-5 text-accent"/>
          </div>
        </div>
      }
      <MessageInput />   
      </>
      }
    </div>
  );
};
export default ChatContainer;