import React, { useState } from 'react'

const PostReactionSummary = ({ post }) => {
  const [showUsersWhoReacted, setShowUsersWhoReacted] = useState(false);
  const [showUsersWhoCommented, setShowUsersWhoCommented] = useState(false);
  const reactionCounts = post.reactions.reduce((acc, reaction) => {
    acc[reaction.type] = (acc[reaction.type] || 0) + 1;
    return acc;
  }, {});

  const sortedReactions = Object.entries(reactionCounts).sort(
    (a, b) => b[1] - a[1]
  );

  const totalReactions = sortedReactions.reduce(
    (sum, [, count]) => sum + count,
    0
  );

  const emojiFor = (type) => {
    switch (type) {
      case "like":
        return "👍";
      case "heart":
        return "❤️";
      case "haha":
        return "🤣";
      case "sad":
        return "😭";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-row justify-between items-center my-2">
      <div
        className="flex flex-row items-center gap-0.5 cursor-pointer relative"
        onMouseOver={() => setShowUsersWhoReacted(true)}
        onMouseOut={() => setShowUsersWhoReacted(false)}
      >
        {sortedReactions[0] && (
          <span className="text-base">{emojiFor(sortedReactions[0][0])}</span>
        )}
         {sortedReactions[1] && (
          <span className="text-base">{emojiFor(sortedReactions[1][0])}</span>
         )}
         <span
          className="text-base text-zinc-400"
        >
          {totalReactions !== 0 && totalReactions}
        </span>
        {
          showUsersWhoReacted &&
          <div className="absolute top-0 translate-y-10 z-10 bg-base-200/80 p-2 gap-1">
            {post.reactions.map((reaction) => (
              <div key={reaction._id} className="text-xs text-zinc-400 flex flex-row gap-1">
                <span>{emojiFor(reaction.type)}</span>
                <span className="whitespace-nowrap">{reaction.userId.fullName}</span>
              </div>
            ))}
          </div>
        }
      </div>
      <div
        className="flex flex-row items-center cursor-pointer relative"
        onMouseOver={() => setShowUsersWhoCommented(true)}
        onMouseOut={() => setShowUsersWhoCommented(false)}
      >
        <span className="text-xs text-zinc-400">{post.comments.length} comments</span>
        {
          showUsersWhoCommented && post.comments.length !== 0 &&
          <div className="bg-base-300/80 p-2 rounded-xl absolute top-10 right-0 z-1 flex flex-col">
            {post.comments
              .filter((comment, index, self) =>
                index === self.findIndex(c => c.userId._id === comment.userId._id)
              )
              .map((comment) => (
                <span key={comment._id} className="text-xs text-zinc-400 whitespace-nowrap">
                  {comment.userId.fullName}
                </span>
              ))
            }
          </div>
        }
      </div>
    </div>
  );
}

export default PostReactionSummary