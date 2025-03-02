import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { format, isToday, isThisYear } from 'date-fns';

const SidebarUserItem = ({ user, authUser, selected, onSelect, onlineUsers }) => {
  const { getLastMessage } = useChatStore();
  const [lastMessage, setLastMessage] = useState(null);
  const socket = useAuthStore((state) => state.socket);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isToday(date) ? format(date, 'HH:mm') : isThisYear(date) ? format(date, 'dd-LLL') : format(date, 'dd-MM-yy');
  };

  useEffect(() => {
    if (!socket) return;

    const fetchLastMessage = async () => {
      try {
        const conversation = await getLastMessage(authUser._id, user._id);
        if (conversation) {
          setLastMessage({
            sender:
              conversation.senderId === authUser._id
                ? "You:"
                : "",
            text: conversation.text,
            seen:
              conversation.receiverId === authUser._id && conversation.seenBy.includes(authUser._id)
                ? true
                : conversation.senderId === authUser._id && conversation.seenBy.includes(authUser._id)
                  ? true
                  : false,
            time:
              formatDate(conversation.createdAt)
          });
        } else {
          setLastMessage({ sender: "", text: "No messages", seen: true, time: null });
        }
      } catch (err) {
        console.error("Error fetching last message:", err);
      }
    };

    const handleNewMessage = (data) => {
        fetchLastMessage();
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageSeen", handleNewMessage);

    fetchLastMessage();

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageSeen", handleNewMessage);
    };
  }, [authUser._id, user._id, getLastMessage, socket]);

  return (
    <button
      onClick={() => onSelect(user)}
      className={`
        w-full p-3 flex items-center gap-3
        hover:bg-base-300 transition-colors
        cursor-pointer
        ${selected ? "bg-base-300 ring-1 ring-base-300" : ""}
      `}
    >
      <div className="relative">
        <img
          src={user.profilePic || "/avatar.png"}
          alt={user.name}
          className="w-12 h-12 object-cover rounded-full"
        />
        {
          onlineUsers.includes(user._id)
            ? <span className="absolute bottom-0 right-0 size-3 bg-green-600 rounded-full ring-2 ring-zinc-900" title="Online"/>
            : <span className="absolute bottom-0 right-0 size-3 bg-red-600 rounded-full ring-2 ring-zinc-900" title="Offline"/>
        }
      </div>
      <div className="block text-left min-w-0">
        <div className="font-medium truncate">{user.fullName}</div>
        <div className={`text-sm ${lastMessage?.seen ? 'text-zinc-400' : 'text-zinc-50 bold'}`}>
          {lastMessage ?
            <>
              {lastMessage.sender} {lastMessage.text} <span className="text-[0.7rem]"> {lastMessage?.time && `• ${lastMessage?.time}`} </span></> : "Loading..."}
        </div>
      </div>
    </button>
  );
};

export default SidebarUserItem;
