import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import { axiosInstance } from './lib/axios.js'
import { useAuthStore } from './store/useAuthStore.js'
import { useThemeStore } from './store/useThemeStore.js'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import UserPage from './pages/UserPage.jsx'
import FoundProfilesPage from './pages/FoundProfilesPage.jsx'
import { useChatStore } from "./store/useChatStore.js";
import toast from "react-hot-toast";
import { useSettingsStore } from './store/useSettingsStore.jsx';

const App = () => {
  const notification = new Audio("/notification-sound.mp3");
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  const { selectedUser, setMessages } = useChatStore();
  const socket = useAuthStore((state) => state.socket);
  const { soundNotification } = useSettingsStore();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      if (!selectedUser || newMessage.senderId !== selectedUser._id) {
        if (soundNotification) {
          notification.play();
        }
        new Notification("New message", {
          body: `Od: ${newMessage.senderId}`});
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [selectedUser, socket, setMessages, soundNotification]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-bounce" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={ authUser ? <HomePage /> : <Navigate to="/login" /> }/>
        <Route path="/signup" element={ !authUser ? <SignUpPage /> : <Navigate to="/" /> }/>
        <Route path="/login" element={ !authUser ? <LoginPage /> : <Navigate to="/" /> }/>
        <Route path="/settings" element={<SettingsPage />}/>
        <Route path="/profile" element={ authUser ? <ProfilePage /> : <Navigate to="/login" /> }/>
        <Route path="/chat" element={ authUser ? <ChatPage /> : <Navigate to="/login" /> }/>
        <Route path="/user/:id" element={ authUser ? <UserPage /> : <Navigate to="/login" /> }/>
        <Route path="/search/:searchTerm" element={ authUser ? <FoundProfilesPage /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App