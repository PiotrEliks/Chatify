import React, { useEffect, useState, useRef } from 'react'
import { format, isToday, isThisYear } from 'date-fns';
import CommentsList from '../components/CommentsList.jsx';
import PostReactionSummary from '../components/PostReactionSummary.jsx';
import { ThumbsUp, MessageSquare, Forward, SendHorizontal } from 'lucide-react';
import ReactionButton from '../components/ReactionButton.jsx';
import { useAuthStore } from '../store/useAuthStore';

const Post = ({ post, userProfile, setSelectedPost, addCommentToPost }) => {
  const inputElement = useRef();
  const focusInput = () => {
    inputElement.current.focus();
  };
  const { authUser } = useAuthStore();
  const formatDate = (dateString) => {
      const date = new Date(dateString);
      return isToday(date)
        ? format(date, 'HH:mm')
        : isThisYear(date)
        ? format(date, 'dd-LLL')
        : format(date, 'dd-MM-yy');
    };

  const [comment, setComment] = useState('');
  return (
    <div className="w-1/2 bg-base-100 p-5">
      <div className="flex flex-row items-center gap-3">
        <img
          src={userProfile.profilePic || "/avatar.png"}
          alt={userProfile.name}
          className="w-12 h-12 object-cover rounded-full border-4 border-white shadow-lg"
        />
        <div className="flex flex-col">
          <span className="text-sm cursor-pointer" onClick={() => navigate(`/user/${userProfile._id}`)}>{userProfile.fullName}</span>
          <span className="text-xs text-zinc-400">{formatDate(post.createdAt)}</span>
        </div>
      </div>
      <div className="flex flex-col w-full items-center mt-5">
        <span className="self-start mb-5">{post.text}</span>
        {post.image && (
          <img
            src={post.image}
            alt={userProfile.name}
            className="w-3/4"
          />
        )}
      </div>
      <div className="w-full">
        <PostReactionSummary post={post}/>
      </div>
      <div className="w-full flex flex-row items-center justify-evenly mb-2 border-y border-accent">
        <ReactionButton post={post} authUser={authUser} />
        <button
          className="h-full w-1/3 flex flex-row gap-2 items-center justify-center p-3 rounded-ms hover:bg-zinc-800 cursor-pointer"
          onClick={focusInput}
        >
          <MessageSquare className="w-5 h-5" /> Comment
        </button>
        <button className="h-full w-1/3 flex flex-row gap-2 items-center justify-center p-3 rounded-ms hover:bg-zinc-800 cursor-pointer">
          <Forward className="w-5 h-5" /> Share
        </button>
      </div>
      <div className="w-full">
        <CommentsList comments={post.comments} setSelectedPost={setSelectedPost} post={post}/>
      </div>
      <div className="relative">
        <input
          type="text"
          className="w-full pr-10 input input-bordered"
          placeholder={`Comment as ${authUser.fullName}`}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          ref={inputElement}
        />
        <button
          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
          disabled={!comment}
          onClick={() => {
            addCommentToPost(post._id, comment, authUser._id);
            setComment('');
          }}
        >
          <SendHorizontal className={`w-5 h-5 ${!comment ? 'text-zinc-600' : 'text-accent'}`} />
        </button>
      </div>
    </div>
  )
}

export default Post