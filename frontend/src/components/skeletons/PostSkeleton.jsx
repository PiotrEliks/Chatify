import React from 'react'
import { ThumbsUp, MessageSquare, Forward, SendHorizontal, Smile } from 'lucide-react';
import PostReactionSummary from '../PostReactionSummary';
import CommentsList from '../CommentsList';
import ReactionButton from '../ReactionButton';

const PostSkeleton = () => {
  const skeletonPosts = Array(4).fill(null);

  return (
    <div className="w-full flex items-center justify-center flex-col gap-5">
      {skeletonPosts.map((_, idx) => (
        <div key={idx} className="sm:w-3xl w-full bg-base-100 p-5 animate-pulse">
          <div className="flex flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-full skeleton" />
            <div className="flex flex-col gap-1">
              <div className="w-24 h-4 skeleton rounded" />
              <div className="w-16 h-3 skeleton rounded" />
            </div>
          </div>
          <div className="w-full mt-5">
            <div className="w-3/4 h-6 skeleton rounded" />
          </div>
          <div className="w-full flex flex-row items-center justify-evenly my-2 border-y border-accent/20 text-zinc-500">
            <button
              className="h-full  flex flex-row gap-2 items-center justify-center p-3 rounded-ms hover:bg-zinc-800 cursor-pointer text-sm"
            >
              <ThumbsUp className="size-4 sm:size-5" /> Like it!
            </button>
            <button
              className="h-full  flex flex-row gap-2 items-center justify-center p-3 rounded-ms hover:bg-zinc-800 cursor-pointer text-sm"
            >
              <MessageSquare className="size-4 sm:size-5" /> Comment
            </button>
            <button className="h-full  flex flex-row gap-2 items-center justify-center p-3 rounded-ms hover:bg-zinc-800 cursor-pointer text-sm">
              <Forward className="size-4 sm:size-5" /> Share
            </button>
          </div>
          <div className="flex flex-row items-center gap-3 mt-5">
            <div className="w-8 h-8 rounded-full skeleton" />
              <div className="flex flex-col gap-1">
                <div className="w-24 h-8 skeleton rounded" />
              </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PostSkeleton