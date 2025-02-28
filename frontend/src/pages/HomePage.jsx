import React, { useEffect, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useProfileStore } from '../store/useProfileStore';
import Posts from '../components/Posts.jsx';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import CreatePost from '../components/CreatePost.jsx';
import { useAuthStore } from '../store/useAuthStore.js';

const HomePage = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  return (
    <div className="bg-base-200">
      <div className="pt-20 px-10">
        <div className="w-full mx-auto flex items-center justify-center">
          <CreatePost userProfile={authUser} isUserPage={false} />
        </div>
        <div className="mt-5">
          <Posts />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
