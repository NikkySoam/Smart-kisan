import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaArrowsAlt,
  FaPaperPlane,
  FaRobot,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import ChatMessage from "./ChatMessage";
import { useChatbot } from "../../hooks/useChatbot";
import type { ChatMessage as ChatMessageType } from "../../types/chatbot";

interface Point {
  x: number;
  y: number;
}

const STORAGE_KEY = "smart-kisan-chatbot-position";
const BUTTON_SIZE = 58;
const EDGE_GAP = 16;
const PANEL_WIDTH = 380;
const PANEL_HEIGHT = 620;

const getDefaultPosition = (): Point => ({
  x: Math.max(EDGE_GAP, window.innerWidth - BUTTON_SIZE - EDGE_GAP),
  y: Math.max(EDGE_GAP, window.innerHeight - BUTTON_SIZE - 88),
});

const clampPosition = ({ x, y }: Point): Point => ({
  x: Math.min(
    Math.max(EDGE_GAP, x),
    Math.max(EDGE_GAP, window.innerWidth - BUTTON_SIZE - EDGE_GAP)
  ),
  y: Math.min(
    Math.max(EDGE_GAP + 64, y),
    Math.max(EDGE_GAP + 64, window.innerHeight - BUTTON_SIZE - EDGE_GAP)
  ),
});

const readStoredPosition = (): Point => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return getDefaultPosition();

    const parsed = JSON.parse(stored) as Point;
    if (typeof parsed.x !== "number" || typeof parsed.y !== "number") {
      return getDefaultPosition();
    }

    return clampPosition(parsed);
  } catch {
    return getDefaultPosition();
  }
};

const createMessage = (
  role: ChatMessageType["role"],
  content: string
): ChatMessageType => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  role,
  content,
});

const Chatbot = () => {
  const { t } = useTranslation();
  const { sendMessage, isLoading } = useChatbot();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<Point>(() => readStoredPosition());
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessageType[]>(() => [
    createMessage("assistant", t("chatbotWelcome")),
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    offsetX: number;
    offsetY: number;
    moved: boolean;
  } | null>(null);

  const quickQuestions = useMemo(
    () => [
      t("chatbotQuickFarmers"),
      t("chatbotQuickTubewell"),
      t("chatbotQuickFields"),
    ],
    [t]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    const handleResize = () => setPosition((current) => clampPosition(current));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const savePosition = (next: Point) => {
    setPosition(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - position.x,
      offsetY: event.clientY - position.y,
      moved: false,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const next = clampPosition({
      x: event.clientX - drag.offsetX,
      y: event.clientY - drag.offsetY,
    });

    if (Math.abs(next.x - position.x) > 2 || Math.abs(next.y - position.y) > 2) {
      drag.moved = true;
    }

    setPosition(next);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    event.currentTarget.releasePointerCapture(event.pointerId);
    const wasDragged = drag.moved;
    dragRef.current = null;

    if (!wasDragged) {
      setIsOpen((open) => !open);
      return;
    }

    const next = clampPosition(position);
    savePosition(next);
  };

  const handlePointerCancel = () => {
    if (!dragRef.current) return;
    savePosition(position);
    dragRef.current = null;
  };

  const handleSubmit = async (text = message) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setMessage("");
    setMessages((current) => [...current, createMessage("user", trimmed)]);

    try {
      const answer = await sendMessage(trimmed);
      setMessages((current) => [...current, createMessage("assistant", answer)]);
    } catch (error: any) {
      setMessages((current) => [
        ...current,
        createMessage(
          "assistant",
          error?.message || t("chatbotError")
        ),
      ]);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    }
  };

  const clearChat = () => {
    if (isLoading) return;
    setMessages([createMessage("assistant", t("chatbotWelcome"))]);
    setMessage("");
    textareaRef.current?.focus();
  };

  const panelWidth = Math.min(PANEL_WIDTH, Math.max(280, window.innerWidth - 16));
  const panelLeft = Math.min(
    Math.max(8, position.x - panelWidth + BUTTON_SIZE),
    Math.max(8, window.innerWidth - panelWidth - 8)
  );
  const panelHeight = Math.min(PANEL_HEIGHT, Math.max(360, window.innerHeight - 100));
  const panelTop =
    position.y > panelHeight + 24
      ? position.y - panelHeight - 12
      : Math.min(position.y + BUTTON_SIZE + 12, window.innerHeight - panelHeight - 8);

  return (
    <>
      {isOpen && (
        <section
          className="fixed z-[70] flex flex-col overflow-hidden rounded-2xl border border-emerald-900/10 bg-white/95 shadow-2xl backdrop-blur-xl"
          style={{
            width: panelWidth,
            height: panelHeight,
            left: panelLeft,
            top: Math.max(8, panelTop),
          }}
          aria-label={t("chatbotTitle")}
        >
          <header className="flex shrink-0 items-center justify-between bg-emerald-800 px-4 py-3 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
                <FaRobot />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold">{t("chatbotTitle")}</h2>
                <p className="truncate text-[11px] text-emerald-50/80">
                  {t("chatbotSubtitle")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                disabled={isLoading}
                className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                title={t("chatbotClear")}
                aria-label={t("chatbotClear")}
              >
                <FaTrash className="text-xs" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                title={t("close")}
                aria-label={t("close")}
              >
                <FaTimes />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto bg-slate-50/75 px-3 py-4">
            <div className="space-y-3">
              {messages.length === 1 && (
                <div className="mb-3 grid gap-2">
                  {quickQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      disabled={isLoading}
                      onClick={() => void handleSubmit(question)}
                      className="rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-left text-xs font-medium text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((chatMessage) => (
                <ChatMessage key={chatMessage.id} message={chatMessage} />
              ))}

              {isLoading && (
                <div className="flex items-end gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                    <FaRobot className="text-sm" />
                  </div>
                  <div className="rounded-2xl rounded-bl-md border border-emerald-900/10 bg-white px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1.5" aria-label={t("chatbotThinking")}>
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-600 [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-600 [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-600" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="shrink-0 border-t border-slate-200 bg-white p-3">
            <div className="rounded-xl border border-emerald-900/10 bg-slate-50 p-2 transition focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-600/10">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                disabled={isLoading}
                placeholder={t("chatbotPlaceholder")}
                className="max-h-28 min-h-[52px] w-full resize-none border-0 bg-transparent px-1 py-1 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
              />

              <div className="flex items-center justify-between gap-2 pt-1">
                <p className="text-[10px] text-slate-400">{t("chatbotEnterHint")}</p>
                <button
                  type="button"
                  onClick={() => void handleSubmit()}
                  disabled={!message.trim() || isLoading}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
                  title={t("chatbotSend")}
                  aria-label={t("chatbotSend")}
                >
                  <FaPaperPlane className="text-xs" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className="fixed z-[80] flex h-[58px] w-[58px] touch-none select-none items-center justify-center rounded-full border-2 border-white bg-emerald-700 text-white shadow-[0_12px_35px_rgba(0,81,55,0.32)] transition hover:bg-emerald-800 active:scale-95"
        style={{ left: position.x, top: position.y }}
        aria-label={t("chatbotTitle")}
        title={t("chatbotDragHint")}
      >
        <span className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
        <FaRobot className="relative text-xl" />
        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-white text-emerald-700 shadow-sm">
          <FaArrowsAlt className="text-[8px]" />
        </span>
      </button>
    </>
  );
};

export default Chatbot;
