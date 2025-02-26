import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Camera, Mail, User} from 'lucide-react'

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [profileImage, setProfileImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [newInformationProvided, setNewInformationProvided] = useState(false);
  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setProfileImage(base64Image);
      setNewInformationProvided(true);
    }
  };

  const handleBackgroundImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setBackgroundImage(base64Image);
      setNewInformationProvided(true);
    }
  };

  const handleSaveChanges = async () => {
    const updateData = {};
    if (profileImage) updateData.profilePic = profileImage;
    if (backgroundImage) updateData.backgroundPic = backgroundImage;

    if (Object.keys(updateData).length === 0) return;

    await updateProfile(updateData);
    setNewInformationProvided(false);
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">
              Profile
            </h1>
            <p className="mt-2">
              Your profile information
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                <div className="w-full flex items-center justify-center mb-5">
                  <img
                    src={authUser.profilePic || "/avatar.png"}
                    alt="Profile"
                    className="size-32 rounded-full object-cover border-4 ring-2 ring-zinc-900"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className={`
                      absolute bottom-5 right-0
                      bg-base-content hover:scale-105
                      p-2 rounded-full cursor-pointer
                      transition-all duration-200
                      ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                    `}
                  >
                    <Camera className="w-5 h-5 text-base-200" />
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                      disabled={isUpdatingProfile}
                    />
                  </label>
                </div>
              </div>
              <div className="relative">
                <div className="w-full">
                  <img
                    src={authUser.backgroundPic || "/avatar.png"}
                    alt="Background"
                    className="w-full max-h-40"
                  />
                  <label
                      htmlFor="background-upload"
                      className={`
                        absolute bottom-0 right-0
                        bg-base-content hover:scale-105
                        p-2 rounded-full cursor-pointer
                        transition-all duration-200
                        ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                      `}
                    >
                      <Camera className="w-5 h-5 text-base-200" />
                      <input
                        type="file"
                        id="background-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleBackgroundImageUpload}
                        disabled={isUpdatingProfile}
                      />
                    </label>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.fullName}
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="2-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>
            </div>
          </div>
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">
              Account Information
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0].split("-").reverse().join("-")}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
          {
            newInformationProvided &&
            <div className="mt-6 flex justify-end">
              <button
                className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer"
                onClick={handleSaveChanges}
                disabled={isUpdatingProfile}
              >
                Save Changes
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default ProfilePage