import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { format, isToday, isThisYear } from 'date-fns';
import { useAuthStore } from '../store/useAuthStore';

const ChatContainerMessageItem = ({ message, authUser, messageEndRef, selectedUser }) => {
  const messageRef = useRef(null);
  const observerRef = useRef(null);
  const { markMessageAsSeen } = useChatStore();
  const [showMessageDetails, setShowMessageDetails] = useState({});
  const [localMessage, setLocalMessage] = useState(message);

  useEffect(() => {
    setLocalMessage(message);
  }, [message]);

  useEffect(() => {
    const handleIntersection = async (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !localMessage.seenBy.includes(authUser._id)) {
        markMessageAsSeen(localMessage._id, localMessage.receiverId, localMessage.senderId);
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    });
    if (messageRef.current) {
      observerRef.current.observe(messageRef.current);
    }
    return () => {
      if (observerRef.current && messageRef.current) {
        observerRef.current.unobserve(messageRef.current);
      }
    };
  }, [localMessage, authUser._id, markMessageAsSeen]);

  useEffect(() => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    const handleMessageSeen = (data) => {
      if (data._id=== localMessage._id) {
        setLocalMessage((prev) => ({
          ...prev,
          seenBy: data.seenBy ? data.seenBy : prev.seenBy,
          updatedAt: data.updatedAt ? data.updatedAt : prev.updatedAt,
        }));
      }
    };

    socket.on("messageSeen", handleMessageSeen);
    return () => {
      socket.off("messageSeen", handleMessageSeen);
    };
  }, [localMessage._id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isToday(date) ? format(date, 'HH:mm') : isThisYear(date) ? format(date, 'dd-LLL') : format(date, 'dd-MM-yy');
  };

  return (
    <div ref={messageRef} className="message-item">
      <div
        key={localMessage._id}
        className={`chat ${localMessage.senderId === authUser._id ? "chat-end" : "chat-start"}`}
        ref={messageEndRef}
        onClick={() =>
          setShowMessageDetails({
            messageId: localMessage._id,
            show: !showMessageDetails.show,
          })
        }
      >
        <div className="chat-image avatar">
          <div className="size-10 rounded-full border">
            <img
              src={
                localMessage.senderId === authUser._id
                  ? authUser.profilePic || "/avatar.png"
                  : selectedUser.profilePic || "/avatar.png"
              }
              alt="profile pic"
            />
          </div>
        </div>
        <div className="chat-bubble flex flex-col cursor-pointer">
          {localMessage.image && (
            <img
              src={localMessage.image}
              alt="Attachment"
              className="sm:max-w-[200px] rounded-md mb-2"
            />
          )}
          {localMessage.text && <p>{localMessage.text}</p>}
        </div>
      </div>
      {showMessageDetails.messageId === localMessage._id && showMessageDetails.show && (
        <div className={`chat ${localMessage.senderId === authUser._id ? "chat-end" : "chat-start"} text-xs text-zinc-400`}>
          {localMessage.seenBy.includes(localMessage.receiverId)
            ? `Seen: ${formatDate(localMessage.updatedAt)}`
            : `Sent: ${formatDate(localMessage.createdAt)}`}
        </div>
      )}
    </div>
  );
};

export default ChatContainerMessageItem;
