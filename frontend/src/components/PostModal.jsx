import React, { useEffect, useRef, useState, useCallback } from 'react';
import { format, isToday, isThisYear } from 'date-fns';
import ReactionButton from './ReactionButton';
import { X, SendHorizontal, MessageSquare, Forward, Smile, Ellipsis } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePostsStore } from '../store/usePostStore';
import PostReactionSummary from '../components/PostReactionSummary.jsx';
import Picker from "emoji-picker-react";
import {isMobile} from 'react-device-detect';
import { useThemeStore } from '../store/useThemeStore.js';

const PostModal = ({
  post2,
  userProfile,
  authUser,
  onClose,
  addComment,
  comment,
  setComment,
  isUserPage
}) => {
  const { theme } = useThemeStore();
  const inputElement = useRef();
  const modalRef = useRef();
  const focusInput = () => {
    inputElement.current.focus();
  };
  const navigate = useNavigate();
  const postFromStore = usePostsStore(state =>
    isUserPage ? state.userPosts.find(p => p._id === post2._id) : state.allPosts.find(p => p._id === post2._id)
  );
  const [post, setPost] = useState(post2);

  useEffect(() => {
    if (postFromStore) {
      setPost(postFromStore);
    }
  }, [postFromStore]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isToday(date)
      ? format(date, 'HH:mm')
      : isThisYear(date)
      ? format(date, 'dd-LLL')
      : format(date, 'dd-MM-yy');
  };

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

  const [showPostSettings, setShowPostSettings] = useState(false);
  const { deletePost } = usePostsStore();

  return (
    <div className="fixed inset-0 z-51 flex items-center justify-center backdrop-blur">
      <div ref={modalRef} className="bg-base-100 w-full max-w-2xl h-[100vh] flex flex-col sm:w-11/12 sm:p-2 sm:h-[90vh] sm:rounded-lg ">
        <div className="w-full h-8 relative">
          {post.userId._id === authUser._id &&
              <div
                className="absolute right-7 top-1 cursor-pointer"
                onClick={() => setShowPostSettings(!showPostSettings)}
                title="Settings"
              >
                <Ellipsis className="size-5" />
              </div>
          }
          {showPostSettings &&
            <div className="absolute right-0 top-5 bg-base-300 py-3 rounded-2xl">
              <div
                className="text-xs hover:bg-base-100 cursor-pointer px-5 py-2 w-ful"
                onClick={() => deletePost(post._id, authUser._id, isUserPage)}
              >
                  Delete post
                </div>
            </div>
          }
          <button
            onClick={onClose}
            className="absolute top-1 right-1 text-xl font-bold text-white cursor-pointer"
            title="Close post"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-3 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={userProfile.profilePic || "/avatar.png"}
              alt={userProfile.fullName}
              className="w-12 h-12 object-cover rounded-full"
            />
            <div>
              <h2 className="font-bold cursor-pointer" onClick={() => {navigate(`/user/${userProfile._id}`); onClose();}}>{userProfile.fullName}</h2>
              <span className="text-xs text-gray-400">{formatDate(post.createdAt)}</span>
            </div>
          </div>

          <div className="mb-4">
            {post.text && <p className="mb-2">{post.text}</p>}
            {post.image && (
              <img
                src={post.image}
                alt="Post"
                className="w-full object-cover rounded-md mb-2"
              />
            )}
            <div className="w-full">
              <PostReactionSummary post={post}/>
            </div>
            <div className="w-full flex flex-row items-center justify-evenly mb-2 border-y border-accent">
              <ReactionButton post={post} authUser={authUser} isUserPage={isUserPage} />
              <button
                className="h-full flex flex-row gap-2 items-center justify-center p-3 rounded-ms hover:bg-zinc-800 cursor-pointer"
                onClick={focusInput}
                title="Add comment"
              >
                <MessageSquare className="size-4 sm:size-5" /> <span className="text-sm">Comment</span>
              </button>
              <button
                className="h-full flex flex-row gap-2 items-center justify-center p-3 rounded-ms hover:bg-zinc-800 cursor-pointer"
                title="Share"
              >
                <Forward className="size-4 sm:size-5" /> <span className="text-sm">Share</span>
              </button>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-bold mb-2">Comments</h3>
            {post.comments && post.comments.length > 0 ? (
              [...post.comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((comment) => (
                <div key={comment._id} className="flex flex-row gap-3 p-1 items-center">
                  <img
                    src={comment.userId.profilePic || "/avatar.png"}
                    alt={comment.userId.fullName}
                    className="w-8 h-8 object-cover rounded-full border-1 border-white shadow-lg"
                  />
                  <div className="flex flex-col gap-1 bg-base-300 rounded-2xl p-2 max-w-full overflow-auto">
                  <span className="text-sm font-bold">{comment.userId.fullName}</span>
                    <span className="text-sm break-words max-w-full">{comment.text}</span>
                    <span className="text-xs">{formatDate(comment.createdAt)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No comments yet.</p>
            )}
          </div>
        </div>

        <div className="p-3">
          <div className="flex items-center gap-2 relative b-0">
            <input
              type="text"
              placeholder={`Comment as ${authUser.fullName}`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 input input-bordered pr-10"
              ref={inputElement}
            />
            {
              !isMobile &&
                <div className="absolute inset-y-0 right-8 pr-3 flex items-center cursor-pointer text-zinc-400" title="Pick emoji">
                  <Smile
                    className="w-5 h-5"
                    onClick={() => setShowPicker((val) => !val)}
                  />
                </div>
            }
            <button
              onClick={() => {
                addComment(post._id, comment, authUser._id, isUserPage);
                setComment('');
              }}
              disabled={!comment}
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            >
              <SendHorizontal className={`w-5 h-5 ${!comment ? 'text-zinc-600' : 'text-accent'}`} />
            </button>
            {showPicker && (
              <div className="absolute z-2 bottom-0 right-0 scale-80">
                <Picker pickerStyle={{ width: "100%" }} onEmojiClick={onEmojiClick} theme={theme} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
