import React, { useState } from 'react';
import { ThumbsUp, Heart, Laugh, Frown } from 'lucide-react';
import { usePostsStore } from '../store/usePostStore';

const ReactionButton = ({ post, authUser }) => {
  const { addReactionToPost, deleteReactionFromPost } = usePostsStore();
  const [showReactionsList, setShowReactionsList] = useState(false);

  const userReaction = post.reactions?.find(
    reaction => reaction.userId._id === authUser._id
  );

  const handleRemoveReaction = () => {
    deleteReactionFromPost(post._id, authUser._id);
  };

  const handleAddReaction = (reactionType) => {
    if (userReaction && userReaction.type === reactionType) {
      deleteReactionFromPost(post._id, authUser._id);
    } else {
      addReactionToPost(post._id, authUser._id, reactionType);
    }
    setShowReactionsList(false);
  };

  const handleMainButtonClick = () => {
    if (userReaction) {
      handleRemoveReaction();
    } else {
      handleAddReaction('like');
    }
  };

  const reactions = [
    { type: 'like', icon: '👍' },
    { type: 'heart', icon: '❤️' },
    { type: 'haha', icon: '🤣' },
    { type: 'sad', icon: '😭' },
  ];

  return (
    <div className="relative h-full w-1/3 flex items-center justify-center rounded-ms hover:bg-zinc-800">
      <button
        className={`flex flex-row items-center justify-center p-3 w-full gap-2 cursor-pointer ${
          userReaction ? "text-accent font-bold" : ""
        }`}
        onClick={handleMainButtonClick}
        onMouseEnter={() => setShowReactionsList(true)}
      >
        {userReaction?.type === 'like' && <><ThumbsUp className="w-5 h-5" /> Like it!</>}
        {userReaction?.type === 'heart' && <>❤️ Love it!</>}
        {userReaction?.type === 'haha' && <>🤣 Haha</>}
        {userReaction?.type === 'sad' && <>😭 Sorry</>}
        {!userReaction && <><ThumbsUp className="w-5 h-5" /> Like it!</>}
      </button>

      {showReactionsList && !userReaction && (
        <div
          className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 flex flex-row gap-2 p-2 bg-base-200 shadow-lg rounded-3xl"
          onMouseLeave={() => setShowReactionsList(false)}
        >
          {reactions.map((r) => (
            <button
              key={r.type}
              onClick={() => handleAddReaction(r.type)}
              className="hover:bg-base-300 p-1 rounded cursor-pointer"
            >
              <span className="size-10" title={r.type}>{r.icon}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReactionButton;
