import React, { useState, useRef } from 'react'
import { Image, X } from 'lucide-react'
import { usePostsStore } from '../store/usePostStore'

const CreatePost = ({ userProfile, isUserPage }) => {
  const { createPost } = usePostsStore();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handelCreatePost = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await createPost({
        userId: userProfile._id,
        text: text.trim(),
        image: imagePreview,
      }, isUserPage);
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <div className="w-3xl bg-base-100 mt-5 p-5 flex flex-col gap-4 justify-center items-center">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center cursor-pointer"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handelCreatePost} className="w-full flex flex-col items-center gap-2">
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
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className={`flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="px-5 py-2 cursor-pointer hover:text-accent bg-base-300 rounded-4xl border-1"
          disabled={!text.trim() && !imagePreview}
        >
          Publish post
        </button>
      </form>
    </div>
  )
}

export default CreatePost