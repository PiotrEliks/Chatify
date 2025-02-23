import React, { useEffect } from 'react';
import { useProfileStore } from '../store/useProfileStore';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { useParams } from "react-router";
import { UserRoundPlus, UserCheck, UserX, MessageCircleMore, MailQuestion, Loader } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { usePostsStore } from '../store/usePostStore';
import { format, isToday, isThisYear } from 'date-fns';
import { ThumbsUp, MessageSquare  } from 'lucide-react';

const UserPage = () => {
  const navigate = useNavigate();
  const { getProfile, userProfile, isProfileLoading, deleteFriend, isFriendBeingAdded, isFriendBeingDeleted, friendRequest, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getFriendRequestStatus } = useProfileStore();
  const { authUser } = useAuthStore();
  const { setSelectedUser } = useChatStore();
  const params = useParams();

  const { arePostsLoading, getAllPosts, posts, getUserPosts, addReactionToPost } = usePostsStore();

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

  const formatDate = (dateString) => {
      const date = new Date(dateString);
      return isToday(date) ? format(date, 'HH:mm') : isThisYear(date) ? format(date, 'dd-LLL') : format(date, 'dd-MM-yy');
    };

  if (isProfileLoading) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-bounce" />
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
                <p className="text-xl text-gray-300">{userProfile.friends?.length || 0} {userProfile.friends?.length !== 1 ? "Friends" : "Friend"}</p>
              </div>
            </div>
            <div className="flex flex-row gap-2">
              {userProfile.friends.includes(authUser._id) && !friendRequest &&
              <button
                className="bg-accent text-black cursor-pointer flex flex-row justify-around gap-2 p-2 rounded-2xl"
                onClick={() => handleDeletefriend(userProfile._id, authUser._id)}
              >
                <UserCheck />
                Friends
              </button>}
              {!userProfile.friends.includes(authUser._id) && friendRequest?.status !== "pending" &&
              <button
                className="bg-accent text-black cursor-pointer flex flex-row justify-around gap-2 p-2 rounded-2xl"
                onClick={() => handleAddfriend(userProfile._id, authUser._id)}
              >
                <UserRoundPlus />
                Add friend
              </button>}
              {friendRequest?.status === "pending" && friendRequest?.to === authUser._id &&
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
              </div>}
              {friendRequest?.status === "pending" && friendRequest?.from === authUser._id &&
              <div className="bg-accent text-black cursor-pointer flex flex-row justify-around p-2 rounded-2xl gap-1">
                <MailQuestion />
                Invitation sent
              </div>}
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
          <div className="relative mx-auto lg:mx-0">
            User not found
          </div>
        </div>
      )}
      <div className="w-full flex flex-col gap-3 mt-5">
        {console.log(posts)}
        {posts?.map((post) => (
          <div className="w-1/2 bg-base-100 p-5" key={post._id}>
            <div className="flex flex-row items-center gap-3">
              <img
                src={userProfile.profilePic || "/avatar.png"}
                alt={userProfile.name}
                className="size-12 object-cover rounded-full border-4 border-white shadow-lg"
              />
              <div className="flex flex-col">
                <span className="text-sm">{userProfile.fullName}</span>
                <span className="text-xs text-zinc-400">{formatDate(post.createdAt)}</span>
              </div>
            </div>
            <div className="flex flex-col w-full items-center mt-5">
              <span className="self-start mb-5">{post.text}</span>
              {
                post.image &&
                  <img
                    src={post.image}
                    alt={userProfile.name}
                    className="w-3/4"
                  />
              }
            </div>
            <div className="w-full">
              {post.reactions && post.reactions.length > 0 && (() => {
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
                  <div className="flex flex-row justify-between items-center gap-0.5 mt-2">
                    <div className="flex flex-row items-center">
                      {sortedReactions[0] && (
                        <span className="text-lg">{emojiFor(sortedReactions[0][0])}</span>
                      )}
                      {sortedReactions[1] && (
                        <span className="text-lg">{emojiFor(sortedReactions[1][0])}</span>
                      )}
                      <span className="text-base text-zinc-400">{totalReactions}</span>
                    </div>
                    <span>{post.comments.length} comments</span>
                  </div>
                );

              })()}
            </div>
            <div className="w-full flex flex-row items-center justify-evenly">
              <button className="h-full w-1/2 flex flex-row gap-2 items-center justify-center p-3 rounded-ms hover:bg-zinc-800 cursor-pointer" onClick={() => addReactionToPost(post._id, authUser._id, "like")}>
                <ThumbsUp /> I like it!
              </button>
              <button className="h-full w-1/2 flex flex-row gap-2 items-center justify-center p-3 rounded-ms hover:bg-zinc-800 cursor-pointer">
                <MessageSquare /> comment
              </button>
            </div>
            <div className="w-full">
              {post.comments.map((comment) => (
                <div key={comment._id} className="bg-base-200 rounded-2xl">
                  {comment.text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default UserPage;
