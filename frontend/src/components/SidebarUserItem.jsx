import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const SidebarUserItem = ({ user, authUser, selected, onSelect }) => {
  const { getLastMessage } = useChatStore();
  const [lastMessage, setLastMessage] = useState(null);
  const socket = useAuthStore((state) => state.socket);

  console.log(lastMessage)
  useEffect(() => {
    if (!socket) return;

    const fetchLastMessage = async () => {
      try {
        const conversation = await getLastMessage(authUser._id, user._id);
        if (conversation && conversation.lastMessage) {
          setLastMessage({
            sender:
              conversation.lastMessage.senderId === authUser._id
                ? "You:"
                : "",
            text: conversation.lastMessage.text,
            timestamp: conversation.lastMessage.timestamp,
          });
        } else {
          setLastMessage({ sender: "", text: "No messages" });
        }
      } catch (err) {
        console.error("Error fetching last message:", err);
      }
    };

    const handleNewMessage = (data) => {
        fetchLastMessage();
    };

    socket.on("newMessage", handleNewMessage);

    fetchLastMessage();

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [authUser._id, user._id, getLastMessage, socket]);

  return (
    <button
      onClick={() => onSelect(user)}
      className={`
        w-full p-3 flex items-center gap-3
        hover:bg-base-300 transition-colors
        ${selected ? "bg-base-300 ring-1 ring-base-300" : ""}
      `}
    >
      <div className="relative">
        <img
          src={user.profilePic || "/avatar.png"}
          alt={user.name}
          className="w-12 h-12 object-cover rounded-full"
        />
      </div>
      <div className="hidden lg:block text-left min-w-0">
        <div className="font-medium truncate">{user.fullName}</div>
        <div className="text-sm text-zinc-400">
          {lastMessage ? `${lastMessage.sender} ${lastMessage.text}` : "Loading..."}
        </div>
      </div>
    </button>
  );
};

export default SidebarUserItem;
