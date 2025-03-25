import React, { useEffect, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { format } from 'date-fns';

const ChatContainerInfo = () => {
  const { selectedUser, getConversation, conversation, conversationId } = useChatStore();
  const [showImages, setShowImages] = useState(false);

  useEffect(() => {
    if (conversationId) {
      getConversation(conversationId);
    }
  }, [conversationId, getConversation]);

  console.log(conversation);
  
  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      <span> Conversation started on: {format(conversation?.createdAt, "dd/MM/yy, h:mm")}</span>
      <button onClick={() => setShowImages(!showImages)}>Show Images</button>
      {
        showImages &&
        <div className="w-full grid grid-cols-3">
            {
                conversation?.images.map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt="chat-image"
                    className="size-30 object-cover"
                />
                ))
            }
        </div>
      }
    </div>
  );
};

export default ChatContainerInfo;
