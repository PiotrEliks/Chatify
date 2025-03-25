import { Info, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useNavigate } from 'react-router-dom';

const ChatHeader = ({ showInfo, setShowInfo }) => {
  const navigate = useNavigate();
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/user/${selectedUser._id}`)}>
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>

          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          {
            !showInfo &&
              <button onClick={() => setShowInfo(true)}>
                <Info className="cursor-pointer size-5"/>
              </button>
          }
          <button onClick={() => {!showInfo ? setSelectedUser(null) : setShowInfo(false)}}> 
            <X className="cursor-pointer size-6"/>
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;