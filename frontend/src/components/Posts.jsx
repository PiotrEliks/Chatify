import React, { useEffect, useState } from 'react';
import PostSkeleton from '../components/skeletons/PostSkeleton.jsx';
import { usePostsStore } from "../store/usePostStore";
import Post from './Post.jsx';
import { useAuthStore } from '../store/useAuthStore.js';
import PostModal from './PostModal.jsx';
import { Loader } from 'lucide-react';

const Posts = () => {
  const { arePostsLoading, getFriendsPosts, allPosts, addReactionToPost, addCommentToPost } = usePostsStore();
  const { authUser } = useAuthStore();
  const [comment, setComment] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
      getFriendsPosts(authUser._id);
    }, [getFriendsPosts]);

  if (arePostsLoading) return <PostSkeleton />;

  return (
    <div className="flex flex-col items-center gap-6">
        {!arePostsLoading && allPosts ? (
          [...allPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((post) => (
            <Post
              key={post._id}
              post={post}
              userProfile={authUser}
              setSelectedPost={setSelectedPost}
              addCommentToPost={addCommentToPost}
              isUserPage={false}
            />
          ))
        ) : (
          <div>
            <Loader />
          </div>
        )}
        {selectedPost && (
        <PostModal
          post2={selectedPost}
          userProfile={authUser}
          authUser={authUser}
          onClose={() => setSelectedPost(null)}
          addComment={addCommentToPost}
          comment={comment}
          setComment={setComment}
          addReactionToPost={addReactionToPost}
        />
      )}
      </div>
  )
}

export default Posts