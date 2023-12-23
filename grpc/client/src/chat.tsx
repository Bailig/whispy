import { useState } from "react";

export const Chat = () => {
  const myId = "1";

  const [msgs, setMegs] = useState<Message[]>([]);

  const [newMsg, setNewMsg] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMsg.length === 0 || !myId) return;
    setNewMsg("");
  };

  return (
    <div className="container mx-auto min-h-screen grid place-items-center">
      <div className="card w-96 h-96 bg-base-300 shadow-xl p-5 gap-4">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            {msgs.map((msg) => (
              <div
                key={msg.id}
                className={`chat ${
                  msg.ownerId === myId ? "chat-end" : "chat-start"
                }`}
              >
                <div className="chat-bubble">{msg.content}</div>
              </div>
            ))}
          </div>

          <form className="flex flex-none gap-2" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Type here..."
              className="input w-full"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
            />
            <button type="submit" className="btn btn-square btn-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
