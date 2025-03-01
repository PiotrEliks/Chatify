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
    <div className="w-full bg-base-200">
      <div className="pt-25 w-full px-2 sm:px-15 flex flex-col gap-5 items-center">
        <div className="w-full sm:max-w-3xl">
          <CreatePost userProfile={authUser} isUserPage={false} />
        </div>
        <div className="w-full sm:max-w-3xl">
          <Posts />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
