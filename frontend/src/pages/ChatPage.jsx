import React, { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import Sidebar from '../components/Sidebar.jsx';
import NoChatSelected from '../components/NoChatSelected.jsx';
import ChatContainer from '../components/ChatContainer.jsx';

const ChatPage = () => {
  const { selectedUser } = useChatStore();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  console.log(windowWidth);

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            {!selectedUser && windowWidth < 640 && <Sidebar />}
            {selectedUser && windowWidth < 640 && <ChatContainer />}
            {windowWidth >= 640 &&
                <>
                  <Sidebar />
                  {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
                </>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage;
