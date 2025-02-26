import React, { useEffect, useState, useRef } from 'react'
import { format, isToday, isThisYear } from 'date-fns';
import CommentsList from '../components/CommentsList.jsx';
import PostReactionSummary from '../components/PostReactionSummary.jsx';
import { ThumbsUp, MessageSquare, Forward, SendHorizontal, Smile } from 'lucide-react';
import ReactionButton from '../components/ReactionButton.jsx';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import Picker from "emoji-picker-react";
import {isMobile} from 'react-device-detect';

const Post = ({ post, userProfile, setSelectedPost, addCommentToPost }) => {
  const navigate = useNavigate();
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
  const [showPicker, setShowPicker] = useState(false);

  const onEmojiClick = (emojiObject) => {
    const emoji = emojiObject.emoji;
    const input = inputElement.current;

    if (!input) return;

    const start = input.selectionStart;
    const end = input.selectionEnd;

    const updatedComment =
      comment.slice(0, start) +
      emoji +
      comment.slice(end);

    setComment(updatedComment);
    setTimeout(() => {
      input.setSelectionRange(start + emoji.length, start + emoji.length);
      input.focus();
    }, 0);

    setShowPicker(false);
  };

  return (
    <div className="lg:w-3xl w-full bg-base-100 p-5">
      <div className="flex flex-row items-center gap-3">
        <img
          src={post.userId.profilePic || "/avatar.png"}
          alt={post.userId.fullName}
          className="w-12 h-12 object-cover rounded-full border-4 border-white shadow-lg"
        />
        <div className="flex flex-col">
          <span className="text-sm cursor-pointer" onClick={() => navigate(`/user/${post.userId}`)}>{post.userId.fullName}</span>
          <span className="text-xs text-zinc-400">{formatDate(post.createdAt)}</span>
        </div>
      </div>
      <div className="flex flex-col w-full items-center mt-5">
        <span className="self-start mb-5">{post.text}</span>
        {post.image && (
          <img
            src={post.image}
            alt={post.userId.fullName}
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
          className="h-full  flex flex-row gap-2 items-center justify-center p-3 rounded-ms hover:bg-zinc-800 cursor-pointer text-sm"
          onClick={focusInput}
        >
          <MessageSquare className="size-4 sm:size-5" /> Comment
        </button>
        <button className="h-full  flex flex-row gap-2 items-center justify-center p-3 rounded-ms hover:bg-zinc-800 cursor-pointer text-sm">
          <Forward className="size-4 sm:size-5" /> Share
        </button>
      </div>
      <div className="w-full">
        <CommentsList comments={post.comments} setSelectedPost={setSelectedPost} post={post}/>
      </div>
      <div className="relative w-full">
        <input
          type="text"
          className="w-full pr-10 input input-bordered"
          placeholder={`Comment as ${authUser.fullName}`}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          ref={inputElement}
        />
        {
          !isMobile &&
            <div className="absolute inset-y-0 right-8 pr-3 flex items-center cursor-pointer" title="Pick emoji">
              <Smile
                className="w-5 h-5"
                onClick={() => setShowPicker((val) => !val)}
              />
            </div>
        }
        <button
          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
          disabled={!comment}
          onClick={() => {
            addCommentToPost(post._id, comment, authUser._id);
            setComment('');
          }}
          title="Post comment"
        >
          <SendHorizontal className={`w-5 h-5 ${!comment ? 'text-zinc-600' : 'text-accent'}`} />
        </button>
        {showPicker && (
          <div className="absolute z-2 scale-50 bottom-0 translate-y-18 right-0 translate-x-22 lg:scale-80 lg:translate-y-0 lg:translate-x-8">
            <Picker pickerStyle={{ width: "100%" }} onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Post