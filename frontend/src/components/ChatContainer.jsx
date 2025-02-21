import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx";
import ChatContainerMessageItem from "./ChatContainerMessageItem.jsx";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { format, isToday } from 'date-fns';

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
  const [showMessageDetails, setShowMessageDetails] = useState({});

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  const formatDate = (dateString) => {
      const date = new Date(dateString);
      return isToday(date) ? format(date, 'HH:mm') : format(date, 'dd-MM-yy');
    };

  console.log(showMessageDetails)

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatContainerMessageItem
            key={message._id}
            message={message}
            authUser={authUser}
            messageEndRef={messageEndRef}
            selectedUser={selectedUser}
          />
          /*<>
            <div
              key={message._id}
              className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              ref={messageEndRef}
              onClick={() =>
                setShowMessageDetails({
                  messageId: message._id, show: !showMessageDetails.show
                })}
            >
              <div className=" chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="chat-bubble flex flex-col cursor-pointer">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>

            </div>
            {
              showMessageDetails.messageId === message._id && showMessageDetails.show &&
                <div className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"} text-xs text-zinc-400`}>
                  {message.seenBy.includes(message.receiverId) ? `Seen: ${formatDate(message.updatedAt)}` : `Sent: ${formatDate(message.createdAt)}`}
              </div>
            }
          </>*/
        ))}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;