import { FaRobot, FaUser } from "react-icons/fa";
import type { ChatMessage as ChatMessageType } from "../../types/chatbot";

interface Props {
  message: ChatMessageType;
}

const formatAssistantText = (content: string) => {
  return content.split("\n").map((line, index) => {
    const trimmed = line.trim();
    const isBullet = trimmed.startsWith("*") || trimmed.startsWith("-");
    const text = isBullet ? trimmed.replace(/^[*-]\s*/, "") : line;

    const parts = text.split(/(\*\*[^*]+\*\*)/g);

    return (
      <div
        key={`${messageKey(content)}-${index}`}
        className={isBullet ? "flex gap-2" : "min-h-[1.25rem]"}
      >
        {isBullet && <span className="mt-1 text-emerald-700">•</span>}
        <span>
          {parts.map((part, partIndex) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={partIndex} className="font-semibold text-slate-900">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <span key={partIndex}>{part}</span>;
          })}
        </span>
      </div>
    );
  });
};

const messageKey = (content: string) => {
  let hash = 0;
  for (let i = 0; i < content.length; i += 1) {
    hash = (hash << 5) - hash + content.charCodeAt(i);
    hash |= 0;
  }
  return hash;
};

const ChatMessage = ({ message }: Props) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
          <FaRobot className="text-sm" />
        </div>
      )}

      <div
        className={[
          "max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 shadow-sm",
          isUser
            ? "rounded-br-md bg-emerald-700 text-white"
            : "rounded-bl-md border border-emerald-900/10 bg-white text-slate-700",
        ].join(" ")}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
        ) : (
          <div className="space-y-0.5 break-words">{formatAssistantText(message.content)}</div>
        )}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
          <FaUser className="text-xs" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
