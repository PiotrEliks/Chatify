import React, { useEffect } from 'react';
import PostSkeleton from '../components/skeletons/PostSkeleton.jsx';
import { useAuthStore } from "../store/useAuthStore";

const Posts = () => {
  const { isPostsLoading, getPosts, posts } = useAuthStore();

  useEffect(() => {
      getPosts();
    }, [getPosts]);

  if (isPostsLoading) return <PostSkeleton />;

  return (
    <div>Posts</div>
  )
}

export default Posts