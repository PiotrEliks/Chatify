import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Camera, Mail, User, BriefcaseBusiness, Heart, House, GraduationCap, PencilLine  } from 'lucide-react'

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [profileImage, setProfileImage] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [relationshipStatus, setRelationshipStatus] = useState("");
  const [biogram, setBiogram] = useState("");
  const [education, setEducation] = useState("");
  const [city, setCity] = useState("");
  const [work, setWork] = useState("");
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
    if (biogram) updateData.biogram = biogram;
    if (relationshipStatus) updateData.relationshipStatus = relationshipStatus;
    if (education) updateData.education = education;
    if (city) updateData.city = city;
    if (work) updateData.work = work;

    if (Object.keys(updateData).length === 0) return;

    await updateProfile(updateData);
    setNewInformationProvided(false);
  };

  return (
    <div className="pt-20">
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
              <p className="text-xs mb-4">Click the camera icon to update your profile picture</p>
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
              <p className="text-xs mt-4">Click the camera icon to update your background picture</p>
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
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <PencilLine  className="w-4 h-4" />
                Biogram
              </div>
              <input
                type="text"
                className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                placeholder="Write something about yourself..."
                value={authUser.biogram || biogram}
                onChange={(e) =>{ setBiogram(e.target.value);setNewInformationProvided(true)}}
              />
            </div>
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Relationship
              </div>
              <select
                className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                value={relationshipStatus ?? authUser.relationshipStatus ?? ""}
                onChange={(e) => {
                  setRelationshipStatus(e.target.value);
                  setNewInformationProvided(true);
                }}
              >
                <option value="" disabled>
                  {authUser.relationshipStatus ? authUser.relationshipStatus : "What's your relationship status?"}
                </option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="engaged">Engaged</option>
                <option value="divorced">Divorced</option>
                <option value="complicated">It's complicated</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Education
              </div>
              <input
                type="text"
                className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                placeholder="Add school..."
                value={authUser.education || education}
                onChange={(e) => {setEducation(e.target.value);setNewInformationProvided(true)}}
              />
            </div>
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <House className="w-4 h-4" />
                City
              </div>
              <input
                type="text"
                className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                placeholder="Where do you live?"
                value={authUser.city || city}
                onChange={(e) => {setCity(e.target.value);setNewInformationProvided(true)}}
              />
            </div>
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <BriefcaseBusiness className="w-4 h-4" />
                Work
              </div>
              <input
                type="text"
                className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                placeholder="Where do you work?"
                value={authUser.work || work}
                onChange={(e) => {setWork(e.target.value);setNewInformationProvided(true)}}
              />
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