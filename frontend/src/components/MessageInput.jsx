import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Smile } from "lucide-react";
import toast from "react-hot-toast";
import Picker, { Emoji } from "emoji-picker-react";
import { isMobile } from 'react-device-detect';

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleSendEmoji = async (emoji) => {
    try {
      await sendMessage({
        text: emoji,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const [showPicker, setShowPicker] = useState(false);
  const inputElement = useRef();

  const onEmojiClick = (emojiObject) => {
    const emoji = emojiObject.emoji;
    const input = inputElement.current;

    if (!input) return;

    const start = input.selectionStart;
    const end = input.selectionEnd;

    const updatedText =
      text.slice(0, start) +
      emoji +
      text.slice(end);

    setText(updatedText);
    setTimeout(() => {
      input.setSelectionRange(start + emoji.length, start + emoji.length);
      input.focus();
    }, 0);

    setShowPicker(false);
  };

  return (
    <div className="p-4 w-full">
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

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 relative">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md pr-17"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            ref={inputElement}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          {
            !isMobile &&
              <div className="absolute inset-y-0 right-8 pr-3 flex items-center cursor-pointer text-zinc-400" title="Pick emoji">
                <Smile
                  className="w-5 h-5"
                  onClick={() => setShowPicker((val) => !val)}
                />
              </div>
          }
          {showPicker && (
            <div className="absolute z-2 scale-50 bottom-0 translate-y-18 right-0 translate-x-22 lg:scale-80 lg:translate-y-0 lg:translate-x-8">
              <Picker pickerStyle={{ width: "100%" }} onEmojiClick={onEmojiClick} />
            </div>
          )}
          <button
            type="button"
            className={`flex ${imagePreview ? "text-accent" : "text-zinc-400"} absolute right-3 cursor-pointer`}
            onClick={() => fileInputRef.current?.click()}
            title="Select image"
          >
            <Image size={20} />
          </button>
        </div>
        {text.trim() || imagePreview ?
          <button
            type="submit"
            className="btn btn-sm btn-circle text-accent"
            title="Send"
          >
            <Send size={22} />
          </button>
          :
          <button
            type="button"
            className="btn btn-sm btn-circle"
            title="Emoji"
            onClick={() => handleSendEmoji('👍')}
          >
            <Emoji size={22} unified="1f44d" />
          </button>
        }

      </form>
    </div>
  );
};
export default MessageInput;