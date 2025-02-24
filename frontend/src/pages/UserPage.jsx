import React, { useEffect, useState, useRef } from 'react';
import { useProfileStore } from '../store/useProfileStore';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { useParams } from "react-router";
import {
  UserRoundPlus,
  UserCheck,
  UserX,
  MessageCircleMore,
  MailQuestion,
  Loader
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { usePostsStore } from '../store/usePostStore';
import { format, isToday, isThisYear } from 'date-fns';
import { ThumbsUp, MessageSquare, Forward, SendHorizontal } from 'lucide-react';
import ReactionButton from '../components/ReactionButton.jsx';
import PostModal from '../components/PostModal.jsx';
import CommentsList from '../components/CommentsList.jsx';
import PostReactionSummary from '../components/PostReactionSummary.jsx';
import Post from '../components/Post.jsx';

const UserPage = () => {
  const navigate = useNavigate();
  const {
    getProfile,
    userProfile,
    isProfileLoading,
    deleteFriend,
    isFriendBeingAdded,
    isFriendBeingDeleted,
    friendRequest,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendRequestStatus
  } = useProfileStore();
  const { authUser } = useAuthStore();
  const { setSelectedUser } = useChatStore();
  const params = useParams();

  const {
    arePostsLoading,
    posts,
    getUserPosts,
    addReactionToPost,
    addCommentToPost
  } = usePostsStore();

  const [comment, setComment] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);

  console.log(posts)


  const handleAddfriend = (userToAddId, userId) => {
    sendFriendRequest(userToAddId, userId);
  };

  const handleAcceptFriendRequest = (friendRequestId) => {
    acceptFriendRequest(friendRequestId);
  };

  const handleRejectFriendRequest = (friendRequestId) => {
    rejectFriendRequest(friendRequestId);
  };

  const handleDeletefriend = (userToDeleteId, userId) => {
    deleteFriend(userToDeleteId, userId);
  };

  const handleOpenChat = (user) => {
    setSelectedUser(user);
    navigate("/chat");
  };

  useEffect(() => {
    getProfile(params.id);
  }, [getProfile, params, isFriendBeingAdded, isFriendBeingDeleted]);

  useEffect(() => {
    getFriendRequestStatus(params.id, authUser._id);
  }, [friendRequest]);

  useEffect(() => {
    getUserPosts(params.id);
  }, [getUserPosts]);

  if (isProfileLoading) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="w-10 h-10 animate-bounce" />
    </div>
  );

  return (
    <div className="h-screen bg-base-200 p-16 mt-8">
      {userProfile !== null ? (
        <div className="relative w-full">
          <img
            src={userProfile.backgroundPic || "/avatar.png"}
            alt={userProfile.name}
            className="w-full h-96 object-cover"
          />
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 z-10 p-2 flex flex-row bg-base-300/75 items-center w-full justify-between">
            <div className="flex flex-row items-center gap-5">
              <img
                src={userProfile.profilePic || "/avatar.png"}
                alt={userProfile.name}
                className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg"
              />
              <div className="flex flex-col">
                <p className="text-2xl font-bold">{userProfile.fullName}</p>
                <p className="text-xl text-gray-300">
                  {userProfile.friends?.length || 0} {userProfile.friends?.length !== 1 ? "Friends" : "Friend"}
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-2">
              {userProfile.friends.includes(authUser._id) && !friendRequest && (
                <button
                  className="bg-accent text-black cursor-pointer flex flex-row justify-around gap-2 p-2 rounded-2xl"
                  onClick={() => handleDeletefriend(userProfile._id, authUser._id)}
                >
                  <UserCheck /> Friends
                </button>
              )}
              {!userProfile.friends.includes(authUser._id) && friendRequest?.status !== "pending" && (
                <button
                  className="bg-accent text-black cursor-pointer flex flex-row justify-around gap-2 p-2 rounded-2xl"
                  onClick={() => handleAddfriend(userProfile._id, authUser._id)}
                >
                  <UserRoundPlus /> Add friend
                </button>
              )}
              {friendRequest?.status === "pending" && friendRequest?.to === authUser._id && (
                <div className="flex flex-row gap-2">
                  <button
                    className="bg-accent text-black cursor-pointer flex flex-row justify-around p-2 rounded-2xl"
                    onClick={() => handleAcceptFriendRequest(friendRequest._id)}
                  >
                    <UserCheck />
                  </button>
                  <button
                    className="bg-accent text-black cursor-pointer flex flex-row justify-around p-2 rounded-2xl"
                    onClick={() => handleRejectFriendRequest(friendRequest._id)}
                  >
                    <UserX />
                  </button>
                </div>
              )}
              {friendRequest?.status === "pending" && friendRequest?.from === authUser._id && (
                <div className="bg-accent text-black cursor-pointer flex flex-row justify-around p-2 rounded-2xl gap-1">
                  <MailQuestion /> Invitation sent
                </div>
              )}
              <button
                className="bg-accent text-black cursor-pointer flex flex-row justify-around p-2 rounded-2xl"
                onClick={() => handleOpenChat(userProfile)}
              >
                <MessageCircleMore />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-screen bg-base-200 pt-50">
          <div className="relative mx-auto lg:mx-0">User not found</div>
        </div>
      )}

      <div className="w-full flex flex-col items-center gap-3 mt-5">
        {!arePostsLoading && posts ? (
          posts.map((post) => (
            <Post
              key={post._id}
              post={post}
              userProfile={userProfile}
              setSelectedPost={setSelectedPost}
              addCommentToPost={addCommentToPost}
            />
          ))
        ) : (
          <div>
            <Loader />
          </div>
        )}
      </div>
      {selectedPost && (
        <PostModal
          post2={selectedPost}
          userProfile={userProfile}
          authUser={authUser}
          onClose={() => setSelectedPost(null)}
          addComment={addCommentToPost}
          comment={comment}
          setComment={setComment}
          addReactionToPost={addReactionToPost}
        />
      )}
    </div>
  );
};

export default UserPage;
