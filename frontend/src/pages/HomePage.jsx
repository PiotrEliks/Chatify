import React, { useEffect, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useProfileStore } from '../store/useProfileStore';
import Posts from '../components/Posts.jsx';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  const { getUsers, users } = useChatStore();
  const { selectedUser, setSelectedUser } = useProfileStore();

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen bg-base-200">
      <div className="relative pt-20 px-4">
        <div className="relative w-full max-w-md mx-auto">
          <div className="relative">
            <div title="Search" className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Search />
            </div>
            <input
              type="text"
              placeholder="Find a user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-xl pl-10 pr-10"
              onKeyDown={(e) => {
                if (searchTerm && e.key === "Enter")
                    navigate(`/search/${searchTerm}`);
                }}
            />
           {searchTerm &&
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setSearchTerm('')}
              title="Clear the search box"
            >
              <X className="cursor-pointer"/>
            </button>}
          </div>
          {searchTerm && filteredUsers.length > 0 &&
            <div className="absolute z-20 left-0 right-0 mt-1 bg-base-100 shadow-lg border border-gray-200 rounded max-h-64 overflow-y-auto">
              {filteredUsers.map((user) => (
                <button
                  key={user._id}
                  onClick={() => {
                    setSelectedUser(user);
                    setSearchTerm('');
                    navigate(`/user/${user._id}`);
                  }}
                  className="w-full text-left p-2 hover:bg-base-300 transition-colors flex items-center gap-3 cursor-pointer"
                >
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{user.fullName}</span>
                </button>
              ))}
            </div>
          }
          {searchTerm && filteredUsers.length === 0 &&
          <div className="absolute z-20 left-0 right-0 mt-1 bg-base-100 shadow-lg border border-gray-200 rounded max-h-64 overflow-y-auto p-3">
            User not found
          </div>
          }
        </div>
        <div className="mt-20">
          <Posts />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
