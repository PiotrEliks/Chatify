import React from 'react'
import { Image } from 'lucide-react'

const CreatePost = ({ userProfile }) => {
  return (
    <div className="w-full bg-base-100 mt-5 p-5 flex flex-col gap-4 justify-center items-center">
      <div className="w-full flex flex-row gap-2 justify-center items-center relative">
        <img
          src={userProfile.profilePic || "/avatar.png"}
          alt={userProfile.name}
          className="size-9 object-cover rounded-full border-1 border-white shadow-lg"
        />
        <input
          type="text"
          placeholder="What's going on?"
          className="w-full input"
        />
        <button
          type="button"
          className="flex absolute right-4 cursor-pointer hover:text-accent"
          onClick={() => {}}
        >
          <Image size={20} />
        </button>
      </div>
      <button
        type="button"
        className="px-5 py-2 cursor-pointer hover:text-accent bg-base-300 rounded-4xl border-1"
        onClick={() => {}}
      >
        Publish post
      </button>
    </div>
  )
}

export default CreatePost