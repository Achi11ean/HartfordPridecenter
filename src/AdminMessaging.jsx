// AdminMessaging.jsx
import React from "react";

export default function AdminMessaging() {
  return (
    <div className="w-full h-[600px] flex flex-col gap-4">

      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-yellow-300">
          💬 Admin Messaging
        </h2>
        <p className="text-yellow-200 text-sm mt-1">
          South Haven LGBTQIA+ Advocacy — Private Admin Discord
        </p>
      </div>

      {/* Discord Preview / Context */}
      <div
        className="
          flex-1 w-full rounded-2xl overflow-hidden
          border border-yellow-500/30
          bg-black/40 shadow-2xl
          relative
        "
      >
        {/* Overlay Label */}
 

        {/* Discord Widget (Preview Only) */}
<iframe
  title="Admin Discord Preview"
  src="https://discord.com/widget?id=1450896886885126277&theme=dark"
  width="100%"
  height="100%"
  allowTransparency="true"
  frameBorder="0"
  sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
/>

      </div>

      {/* Action Button */}
      <a
        href="https://discord.com/channels/1450896886885126277/1450897036567249072"
        target="_blank"
        rel="noreferrer"
        className="
          mx-auto px-5 py-2
          bg-yellow-400 text-black
          rounded-lg font-bold
          hover:bg-yellow-300 transition
          shadow
        "
      >
        Open Admin Discord to Chat
      </a>

      {/* Footer Note */}
      <p className="text-xs text-yellow-200 opacity-80 text-center">
        For security, chatting happens directly in Discord. You must be invited
        and logged in to participate.
      </p>
    </div>
  );
}
