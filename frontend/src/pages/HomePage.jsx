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
          Create post
        </div>
        <div className="mt-20">
          <Posts />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
