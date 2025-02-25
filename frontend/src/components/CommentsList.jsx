import React, { useState } from 'react';
import { format, isToday, isThisYear } from 'date-fns';

const CommentsList = ({ comments, setSelectedPost, post }) => {
  const sortedComments = [...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const commentsToShow = sortedComments.slice(0, 2);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isToday(date)
      ? format(date, 'HH:mm')
      : isThisYear(date)
      ? format(date, 'dd-LLL')
      : format(date, 'dd-MM-yy');
  };

  return (
    <div className="mb-3">
      {sortedComments.length > 2 && (
        <button
          className="text-accent text-xs cursor-pointer"
          onClick={() => setSelectedPost(post)}
        >
          Show more comments
        </button>
      )}
      {commentsToShow.map((comment) => (
        <div key={comment._id} className="flex flex-row gap-3 p-1 items-center">
          <img
            src={comment.userId.profilePic || "/avatar.png"}
            alt={comment.userId.fullName}
            className="w-8 h-8 object-cover rounded-full border-1 border-white shadow-lg"
          />
          <div className="flex flex-col gap-1 bg-base-300 rounded-2xl p-2 max-w-full overflow-auto">
            <span className="text-sm font-bold">{comment.userId.fullName}</span>
            <span className="text-sm break-words">{comment.text}</span>
            <span className="text-[0.7rem]">{formatDate(comment.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentsList;
