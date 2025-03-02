import React, { useState } from 'react';
import { ThumbsUp, Heart, Laugh, Frown } from 'lucide-react';
import { usePostsStore } from '../store/usePostStore';

const ReactionButton = ({ post, authUser, isUserPage }) => {
  const { addReactionToPost, deleteReactionFromPost } = usePostsStore();
  const [showReactionsList, setShowReactionsList] = useState(false);

  const userReaction = post.reactions?.find(
    reaction => reaction.userId._id === authUser._id
  );

  const handleRemoveReaction = () => {
    deleteReactionFromPost(post._id, authUser._id, isUserPage);
  };

  const handleAddReaction = (reactionType) => {
    if (userReaction && userReaction.type === reactionType) {
      deleteReactionFromPost(post._id, authUser._id, isUserPage);
    } else {
      addReactionToPost(post._id, authUser._id, reactionType, isUserPage);
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
    <div className="relative h-full flex items-center justify-center rounded-ms hover:bg-zinc-800">
      <button
        className={`flex flex-row items-center justify-center p-3 w-full gap-2 cursor-pointer ${
          userReaction ? "text-accent" : ""
        }`}
        onClick={handleMainButtonClick}
        onMouseEnter={() => setShowReactionsList(true)}
        title={`${!userReaction ? 'Add reaction' : 'Delete reaction'}`}
      >
        {userReaction?.type === 'like' && <><ThumbsUp className="size-4 sm:size-5" /> <span className="text-sm">Like it!</span></>}
        {userReaction?.type === 'heart' && <><Heart className="size-4 sm:size-5" /> <span className="text-sm">Love it!</span></>}
        {userReaction?.type === 'haha' && <><Laugh className="size-4 sm:size-5" /> <span className="text-sm">Haha</span></>}
        {userReaction?.type === 'sad' && <><Frown className="size-4 sm:size-5" /> <span className="text-sm">Sorry</span></>}
        {!userReaction && <><ThumbsUp className="size-4 sm:size-5" /> <span className="text-sm">Like it!</span></>}
      </button>

      {showReactionsList && !userReaction && (
        <div
          className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/3 flex flex-row gap-2 p-2 bg-base-200 shadow-lg rounded-3xl sm:-translate-x-1/2"
          onMouseLeave={() => setShowReactionsList(false)}
        >
          {reactions.map((r) => (
            <button
              key={r.type}
              onClick={() => handleAddReaction(r.type)}
              className="hover:bg-base-300 p-1 rounded cursor-pointer"
              title="Add reaction"
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
