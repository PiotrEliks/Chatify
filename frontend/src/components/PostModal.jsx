import React, { useEffect, useRef, useState, useCallback } from 'react';
import { format, isToday, isThisYear } from 'date-fns';
import ReactionButton from './ReactionButton';
import { X, SendHorizontal, MessageSquare, Forward } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePostsStore } from '../store/usePostStore';
import PostReactionSummary from '../components/PostReactionSummary.jsx';

const PostModal = ({
  post2,
  userProfile,
  authUser,
  onClose,
  addComment,
  comment,
  setComment,
}) => {

  const inputElement = useRef();
  const focusInput = () => {
    inputElement.current.focus();
  };
  const navigate = useNavigate();
  const postFromStore = usePostsStore(state =>
    state.posts.find(p => p._id === post2._id)
  );
  const [post, setPost] = useState(post2);

  useEffect(() => {
    if (postFromStore) {
      setPost(postFromStore);
    }
  }, [postFromStore]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isToday(date)
      ? format(date, 'HH:mm')
      : isThisYear(date)
      ? format(date, 'dd-LLL')
      : format(date, 'dd-MM-yy');
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-base-100 w-11/12 max-w-2xl h-[90vh] flex flex-col rounded-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-5 text-xl font-bold text-white cursor-pointer"
        >
          <X />
        </button>

        <div className="flex-1 overflow-auto p-6">
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
          </div>

          <div className="mb-4">
            <h3 className="font-bold mb-2">Comments</h3>
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment._id} className="p-2 rounded-2xl bg-base-300 mb-2">
                  <p>{comment.text}</p>
                  <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
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
            <button
              onClick={() => {
                addComment(post._id, comment, authUser._id);
                setComment('');
              }}
              disabled={!comment}
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            >
              <SendHorizontal className={`w-5 h-5 ${!comment ? 'text-zinc-600' : 'text-accent'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
