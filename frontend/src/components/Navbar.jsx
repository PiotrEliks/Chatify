import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import { LogOut, MessageSquare, Settings, User, Search } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import { useProfileStore } from '../store/useProfileStore';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
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

  const [showNotification, setShowNotification] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState({});
  const socket = useAuthStore((state) => state.socket);
  useEffect(() => {
      if (!socket) return;

      const handleNewMessage = (newMessage) => {
        if (!selectedUser || newMessage.senderId !== selectedUser._id) {
          const conversationId = newMessage.conversationId;
          setNewMessagesCount((prevCounts) => ({
            ...prevCounts,
            [conversationId]: (prevCounts[conversationId] || 0) + 1,
          }));
          setShowNotification(true);
        }
      };

      const handleSeenMessage = (conversationId) => {
        setNewMessagesCount((prevCounts) => {
          const updatedCounts = { ...prevCounts };
          if (updatedCounts[conversationId] > 0) {
            updatedCounts[conversationId] -= 1;
          } else {
            delete updatedCounts[conversationId];
          }

          const totalNewMessages = Object.values(updatedCounts).reduce((sum, count) => sum + count, 0);
          setShowNotification(totalNewMessages > 0);

          return { ...updatedCounts };
        });
      };

      socket.on("newMessageReceived", (newMessage) => handleNewMessage(newMessage));
      socket.on("messageSeen", (newMessage) => handleSeenMessage(newMessage.conversationId));

      return () => {
        socket.off("newMessageReceived", (newMessage) => handleNewMessage(newMessage));
        socket.off("messageSeen", (newMessage) => handleSeenMessage(newMessage.conversationId));
      };
    }, [selectedUser, socket, showNotification, selectedUser]);

  return (
    <nav className="bg-base-300 fixed z-50 w-full top-0">
      <div className="w-screen flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-accent" />
          </div>
          <h1 className="text-lg font-bold">Chatify</h1>
        </Link>
        <div className="hidden sm:flex flex-1 justify-center">
          {authUser &&
            <div className="relative w-1/2">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center">
                <Search />
              </div>
              <input
                type="text"
                id="search-navbar"
                className="block w-full p-2 ps-10 text-sm border rounded-lg bg-base-100"
                placeholder="Find a user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (searchTerm && e.key === "Enter") {
                    navigate(`/search/${searchTerm}`);
                    setSearchTerm('');
                  }
                }}
              />
              {searchTerm && filteredUsers.length > 0 && (
                <div className="absolute z-20 left-0 right-0 top-10 bg-base-100 shadow-lg border rounded max-h-64 overflow-y-auto">
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
              )}
              {searchTerm && filteredUsers.length === 0 && (
                <div className="absolute z-20 left-0 right-0 top-10 bg-base-100 shadow-lg border rounded max-h-64 overflow-y-auto p-3">
                  User not found
                </div>
              )}
            </div>
          }
        </div>
        <div className="relative flex items-center sm:order-2 space-x-3 sm:space-x-2">
          {authUser && (
            <>
              <Link to="/chat" className="hidden sm:block p-2 hover:bg-base-100 rounded-lg relative">
                <div className="flex flex-row justify-center items-center gap-1">
                  <MessageSquare className="w-5 h-5" /> Chat
                  {showNotification &&
                    <div className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 text-white rounded-full px-1 text-xs">
                      {Object.keys(newMessagesCount).length}
                    </div>
                  }
                </div>
              </Link>
              <Link to="/settings" className="hidden sm:block p-2 hover:bg-base-100 rounded-lg">
                <div className="flex flex-row justify-center items-center gap-1">
                  <Settings className="w-5 h-5" /> Settings
                </div>
              </Link>
              <button
                type="button"
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 cursor-pointer"
                onClick={toggleUserMenu}
              >
                <span className="sr-only">Open user menu</span>
                <img className="w-8 h-8 rounded-full" src={authUser.profilePic || '/avatar.png'} alt="user photo" />
              </button>
              <button data-collapse-toggle="navbar-search" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg sm:hidden hover:bg-base-100 focus:outline-none focus:ring-2 focus:ring-base-100ark:hover:bg-base-100 dark:focus:ring-base-100 cursor-pointer" aria-controls="navbar-search" aria-expanded="false" onClick={toggleMenu}>
                <span className="sr-only">Open main menu</span>
                {showNotification && !isMenuOpen &&
                    <div className="absolute top-0 right-0  bg-red-600 text-white rounded-full px-1 text-xs">
                      {Object.keys(newMessagesCount).length}
                    </div>
                  }
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                </svg>
            </button>
            </>
          )}
        </div>
        {isUserMenuOpen && (
          <div className="absolute right-4 top-14 z-50 my-4 text-base list-none bg-base-300 divide-y border-1  rounded-lg shadow-sm">
            <div className="px-4 py-3">
              <span className="block text-sm ">{authUser.fullName}</span>
              <span className="block text-sm  truncate">{authUser.email}</span>
            </div>
            <ul className="py-2">
              <li>
                <Link to={`/user/${authUser._id}`} className="block px-4 py-2 text-sm hover:bg-base-100" onClick={() => {toggleUserMenu()}}>
                  <div className="flex flex-row gap-1 items-center">
                    <User className="size-5" />
                    <span className="">Profile</span>
                  </div>
                </Link>
              </li>
              <li>
                <button className="block px-4 py-2 text-sm hover:bg-base-100 w-full cursor-pointer" onClick={() => {logout();toggleUserMenu();}}>
                  <div className="flex flex-row gap-1 items-center">
                    <LogOut className="size-5" />
                    <span className="">Logout</span>
                  </div>
                </button>
              </li>
            </ul>
          </div>
        )}
        {isMenuOpen && (
          <div className="w-full sm:hidden">
            <ul className="flex flex-col font-medium p-4 mt-4 borderrounded-lg bg-base-300">
              <div className="relative w-full mb-2">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center">
                  <Search />
                </div>
                <input
                  type="text"
                  id="search-navbar"
                  className="block w-full p-2 ps-10 text-sm borderrounded-lg bg-base-100"
                  placeholder="Find a user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (searchTerm && e.key === "Enter") {
                      navigate(`/search/${searchTerm}`);
                      toggleMenu();
                      setSearchTerm('');
                    }
                  }}
                />
                {searchTerm && filteredUsers.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 top-10 bg-base-100 shadow-lg border rounded max-h-64 overflow-y-auto">
                    {filteredUsers.map((user) => (
                      <button
                        key={user._id}
                        onClick={() => {
                          setSelectedUser(user);
                          setSearchTerm('');
                          toggleMenu();
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
                )}
                {searchTerm && filteredUsers.length === 0 && (
                  <div className="absolute z-20 left-0 right-0 top-10 bg-base-100 shadow-lg border rounded max-h-64 overflow-y-auto p-3">
                    User not found
                  </div>
                )}
              </div>
              <li>
                <Link to="/chat" className="block py-2 px-3 hover:bg-base-100">
                <div className="relative">
                  <span className="relative">
                    Chat
                    {showNotification &&
                      <div className="absolute top-0 right-0 -mr-3 -mt-2 bg-red-600 text-white rounded-full px-1 text-xs">
                        {Object.keys(newMessagesCount).length}
                      </div>
                    }
                  </span>
                </div>
                </Link>
              </li>
              <li>
                <Link to="/settings" className="block py-2 px-3 hover:bg-base-100">Settings</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar;
