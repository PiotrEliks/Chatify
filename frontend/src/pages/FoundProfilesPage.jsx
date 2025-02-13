import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from '../store/useAuthStore';
import { MessageCircleMore, UserRoundPlus } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';

const FoundProfilesPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { authUser } = useAuthStore();
  const { setSelectedUser } = useChatStore();
  const filteredUsers = state?.filteredUsers || [];

  const handleOpenChat = (user) => {
    setSelectedUser(user);
    navigate("/chat");
  };

  const getSharedFriendsCount = (user) => {
    if (!authUser || !authUser.friends || !user.friends) return 0;

    const authUserFriendsSet = new Set(authUser.friends);

    return user.friends.filter(friendId => authUserFriendsSet.has(friendId)).length;
  };

  return (
    <div className="h-screen bg-base-200">
      <div className="relative pt-20 px-4">
        {filteredUsers.map((user) => (
          <div key={user._id} className="bg-base-300 mb-5 p-5 rounded-2xl hover:bg-base-100">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-4 cursor-pointer" onClick={() => navigate(`/user/${user._id}`)}>
                <img
                  src={user.profilePic || '/avatar.png'}
                  alt={user.fullName}
                  className="size-30 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <p className="text-xl font-bold">{user.fullName}</p>
                  <p className="">{user.friends.includes(authUser._id) && "Friend"}</p>
                  <p className="text-sm text-gray-300">{user.friends.length} Friends</p>
                  <p className="text-sm text-gray-400">{getSharedFriendsCount(user)} Mutual Friends</p>
                </div>
              </div>

              {user.friends.includes(authUser._id) ? (
                <button
                  className="cursor-pointer bg-accent text-black p-3 rounded-xl"
                  onClick={() => handleOpenChat(user)}
                >
                  <MessageCircleMore />
                </button>
              ) : (
                <button
                  className="cursor-pointer bg-accent text-black p-3 rounded-xl flex flex-row gap-2"
                  onClick={() => {}}
                >
                  <UserRoundPlus />
                  Add friend
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoundProfilesPage;
