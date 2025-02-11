import React, { useEffect } from 'react';
import { useProfileStore } from '../store/useProfileStore';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { useParams } from "react-router";
import { UserRoundPlus, UserCheck, UserX, MessageCircleMore } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const UserPage = () => {
  const navigate = useNavigate();
  const { getProfile, userProfile, isProfileLoading, addFriend, deleteFriend, isFriendBeingAdded, isFriendBeingDeleted } = useProfileStore();
  const { authUser } = useAuthStore();
  const { setSelectedUser } = useChatStore();
  const params = useParams();

  const handleAddfriend = (userToAddId, userId) => {
    addFriend(userToAddId, userId);
  };

  const handleDeletefriend = (userToDeleteId, userId) => {
    deleteFriend(userToDeleteId, userId);
  };

  const handleOpenChat = (user) => {
    setSelectedUser(user);
    navigate("/chat");
  };

  console.log(userProfile);
  console.log(authUser);

  useEffect(() => {
    getProfile(params.id);
  }, [getProfile, params, isFriendBeingAdded, isFriendBeingDeleted]);

  if (isProfileLoading) return <div>Loading...</div>;

  return (
    <div className="h-screen bg-base-200 p-16">
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
                <p className="text-sx text-gray-300">{userProfile.friends?.length || 0} {userProfile.friends?.length !== 1 ? "Friends" : "Friend"}</p>
              </div>
            </div>
            <div className="flex flex-row gap-2">
            {userProfile.friends.includes(authUser._id) ? (
            <button
              className="bg-accent text-black cursor-pointer flex flex-row justify-around gap-2 p-2 rounded-2xl"
              onClick={() => handleDeletefriend(userProfile._id, authUser._id)}
            >
              <UserCheck />
              Friends
            </button>
            ) : (
              <button
                className="bg-accent text-black cursor-pointer flex flex-row justify-around gap-2 p-2 rounded-2xl"
                onClick={() => handleAddfriend(userProfile._id, authUser._id)}
              >
                <UserRoundPlus />
                {console.log(userProfile._id, authUser._id)}
                Add friend
              </button>
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
          <div className="relative mx-auto lg:mx-0">
            User not found
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
