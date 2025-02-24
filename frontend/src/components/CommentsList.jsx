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
    <div>
      {sortedComments.length > 2 && (
        <button
          className="text-accent text-xs cursor-pointer"
          onClick={() => setSelectedPost(post)}
        >
          Show more comments
        </button>
      )}
      {commentsToShow.map((comment) => (
        <div key={comment._id} className="bg-base-300 rounded-2xl flex flex-col p-3 mb-2">
          <span className="text-sm">{comment.text}</span>
          <span className="text-xs">{formatDate(comment.createdAt)}</span>
        </div>
      ))}
    </div>
  );
};

export default CommentsList;
