"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { ChatMessage } from "@/types/chatMessage";
import { openSpotDetail } from "@/types/spotEvent";
import { ChatbotWidgetProps } from "@/types/chatbotWidget";
import { useToken } from "./tokenContext";
import { LensSendPayload } from "@/types/lemsSendPayload";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useAuth } from "@/hooks/Auth";
import { useFavorites } from "../en_only/favoriteSpotContext";
import { ENV } from "@/config/env";

const AutoResizeTextarea = dynamic(
  () => import("@/components/lens/autoResizeTextarea"),
  { ssr: false },
);

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

export default function Shotrip_Lens_Client({
  compact = false,
  lensContext = null,
}: ChatbotWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [sessionId] = useState(() => generateId());
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(true);
  const { setTokens, isDepleted } = useToken();
  const { handleLogin } = useAuthActions();
  const { user } = useAuth();
  const { toggleFavState } = useFavorites();
  const isEmpty = messages.length === 0;

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();
        if (!idToken) return;

        const API_GW_URL =
          `${ENV.API_BASE_URL}/history`;

        const response = await fetch(API_GW_URL, {
          headers: { 
            Authorization: `Bearer ${idToken}`,
            "x-api-key": ENV.API_KEY, 
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMessages(data.history);

          data.history.forEach((msg: ChatMessage) => {
            msg.source?.forEach((spot) => {
              if (spot.is_fav) {
                toggleFavState(spot, true);
              }
            });
          });

          const likesStatus = new Set<string>(
            data.history
              .filter((m: ChatMessage) => m.is_good === true)
              .map((m: ChatMessage) => m.id),
          );
          setLikedIds(likesStatus);
        }
      } catch (error) {
        console.error("Failed to load history:", error);
        alert(
          "Oops! We're having trouble loading your chat history. Don't worry, your data is safe, please try refreshing the page.",
        );
      } finally {
        setIsHistoryLoading(false);
      }
    };

    loadHistory();
  }, [toggleFavState]);

  const handleSend = async (text: string) => {
    const { tenantId, namespace, token } = lensContext ?? {};

    if (!tenantId?.trim() || !namespace?.trim() || !token?.trim()) {
      console.warn("Lens blocked: invalid tenant context");
      return;
    }

    if (isDepleted) return;

    const payload: LensSendPayload = {
      message: text,
      context: lensContext,
    };

    console.log("Sending payload", payload);

    const userMessage: ChatMessage = {
      pk: generateId(),
      id: generateId(),
      role: "user",
      content: text,
    };

    const loadingId = generateId();

    const loadingMessage: ChatMessage = { 
      pk: loadingId,
      id: loadingId,
      role: "assistant",
      content: "",
      isLoading: true,
      isWaiting: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);

    let apiFinished = false;

    const startWaitingSequence = async () => {
      await new Promise(res => setTimeout(res, 2000));
      if (apiFinished) return;

      setMessages(prev => prev.map(m => m.id === loadingId ? { ...m, content: "Searhcing for the best answers...", isLoading: false } : m));
      await new Promise(res => setTimeout(res, 3000));
      if (apiFinished) return;

      setMessages(prev => prev.map(m => m.id === loadingId ? { ...m, content: "Almost there, preparing your guide..." } : m));
    };

    startWaitingSequence();

    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();

      //1. invoke API
      const API_GW_URL =
        `${ENV.API_BASE_URL}/chat`;

      const response = await fetch(API_GW_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
          "x-api-key": ENV.API_KEY,
        },
        body: JSON.stringify({
          message: text,
          session_id: sessionId,
          context: {
            tenantId,
            namespace,
            token,
          },
        }),
      });

      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();
      apiFinished = true;

      if (data.new_tokens) {
        setTokens(data.new_tokens);
      }

      setMessages(prev => prev.map(m => m.id === loadingId ? { ...m, isLoading: false, isWaiting: false, content: "" } : m));
      
      const realResponse = data.answer;
      const sources = data.source;
      
      
      let current = "";
      for (let i = 0; i < realResponse.length; i++) {
        current += realResponse[i];

        setMessages((prev) =>
          prev.map((m) =>
            m.id === loadingId
              ? { ...m, content: current, source: sources }
              : m,
          ),
        );

        await new Promise((res) => setTimeout(res, 10));
      }
    } catch (error) {
      apiFinished = true;
      console.error("Error calling API:", error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? {
                ...m,
                content: "Sorry, something went wrong. Please try again.",
                isLoading: false,
                isWaiting:false,
              }
            : m,
        ),
      );
    } finally {
      setMessages((prev) =>
        prev.map((m) => (m.id === loadingId ? { ...m, isLoading: false } : m)),
      );
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);

    window.setTimeout(() => {
      setCopiedId(null);
    }, 1200);
  };

  const toggleLike = async (msg: ChatMessage) => {
    const targetId = msg.id;
    const isCurrentlyLiked = likedIds.has(targetId);
    const nextStatus = !isCurrentlyLiked;

    setLikedIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlyLiked) next.delete(targetId);
      else next.add(targetId);
      return next;
    });

    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();

      const API_GW_URL =
        `${ENV.API_BASE_URL}/chat/like`;
      await fetch(API_GW_URL, {
        method: "PUT",
        headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
          "x-api-key": ENV.API_KEY,
        },
        body: JSON.stringify({
          pk: msg.pk,
          sk: msg.id,
          is_good: nextStatus,
        }),
      });
    } catch (error) {
      console.error("Failed to update lile status:", error);
      alert(
        "Oops! We couldn't register your 'like' right now. It might be a momentary glitch, please try again!",
      );
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (nextStatus) next.delete(targetId);
        else next.add(targetId);
        return next;
      });
    }
  };

  return (
    <div className="flex w-full h-full min-h-0">
      {/* Chat Area */}
      <section className="flex-1 min-w-0 flex flex-col relative">
        {/* Chat Window */}
        <div
          ref={scrollRef}
          className={`flex-1 min-w-0 overflow-x-hidden relative ${
            compact ? "p-4 space-y-4" : "p-10 space-y-6"
          } ${!user ? "overflow-y-hidden" : "overflow-y-auto"}`}
        >
          {/* Non-Logined Mask */}
          {!user && (
            <div className="absolute mt-10 inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs transition-all p-4 text-center">
              <div
                className={`p-5 bg-white shadow-2xl rounded-2xl border border-gray-100 ${compact ? "max-w-50" : "max-w-70"}`}
              >
                <p className="mb-3 text-gray-800 font-bold text-sm leading-tight">
                  Enjoy talking with Shotrip Lens!
                </p>
                <button
                  onClick={handleLogin}
                  className="w-full py-2 bg-blue-600 text-white rounded-xl font-black text-xs hover:bg-blue-700 transition-all shadow-md active:scale-95"
                >
                  Login to Start Chat
                </button>
              </div>
            </div>
          )}
          {/* Loading Overlay */}
          {isHistoryLoading && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white">
              {/* Spinner */}
              <div className="w-10 h-10 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
              <p className="mt-4 text-xs font-bold tracking-widest text-gray-400 animate-pulse uppercase">
                Loading History...
              </p>
            </div>
          )}
          {isEmpty && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 px-6 transition-opacity duration-300">
              <h2
                className={`${compact ? "text-md" : "text-lg"} font-semibold mb-2`}
              >
                Welcome to Shotrip Lens
              </h2>
              <p className={`${compact ? "text-xs" : "text-sm"}`}>
                Ask about hidden spots, local food, or your next trip in Japan.
              </p>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex flex-col ${compact ? "max-w-[85%]" : "max-w-[70%]"}`}
              >
                <div
                  className={`
                    w-fit
                    ${compact ? "px-3 py-2 text-sm rounded-xl" : "px-4 py-3 rounded-2xl"}
                    whitespace-pre-wrap
                    break-all
                    ${
                      msg.role === "user"
                        ? "bg-black text-white"
                        : "bg-gray-200 text-black"
                    }
                    ${msg.isWaiting ? "animate-pulse opacity-70" : ""}
                    `}
                >
                  {msg.isLoading ? (
                    <div className="flex gap-1 items-center px-4 py-3">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>

                {msg.role === "assistant" &&
                  !msg.isLoading &&
                  msg.source &&
                  msg.source.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto py-2 no-scrollbar">
                      {msg.source.map((spot) => (
                        <div
                          key={spot.spot_id}
                          onClick={() => openSpotDetail(spot)}
                          className="shrink-0 w-48 bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer active:scale-95"
                        >
                          {/* Pic area */}
                          <div className="h-24 w-full bg-gray-100 relative">
                            {spot.image_url ? (
                              <img
                                src={spot.image_url}
                                alt={spot.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                                No Image
                              </div>
                            )}
                            <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                              {spot.city}
                            </span>
                          </div>

                          <div className="p-2">
                            <h4 className="text-xs font-bold text-gray-800 truncate">
                              {spot.name}
                            </h4>
                            <p className="text-[10px] text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                              {spot.short_description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                {/* Button */}
                {msg.role === "assistant" && !msg.isLoading && !msg.isWaiting && (
                  <div className="flex gap-2 mt-1 ">
                    {/* Copy */}
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className={`
                        ${compact ? "w-6 h-6 text-sm" : "w-7 h-7"}
                        flex items-center justify-center
                        rounded-md
                        bg-transparent hover:bg-gray-200
                        text-gray-600
                        transition
                        active:scale-95
                        `}
                      aria-label="Copy"
                      title="Copy"
                    >
                      {copiedId === msg.id ? (
                        <span className="text-gray-500 text-sm">✓</span>
                      ) : (
                        <span className="relative w-4 h-4">
                          <span className="absolute top-0 left-0 w-3 h-3 border border-current rounded-sm bg-white"></span>
                          <span className="absolute top-1 left-1 w-3 h-3 border border-current rounded-sm bg-white"></span>
                        </span>
                      )}
                    </button>
                    {/* Good */}
                    <button
                      onClick={() => toggleLike(msg)}
                      className={`
                        ${compact ? "w-6 h-6 text-sm" : "w-7 h-7"}
                        flex items-center justify-center
                        rounded-md
                        bg-transparent hover:bg-gray-200
                        text-gray-600
                        transition
                        active:scale-95
                        `}
                    >
                      {likedIds.has(msg.id) ? "👍" : "👍🏻"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
          {isDepleted && user && (
            <div className="flex justify-center mb-2">
              <div className="bg-red-50 border border-red-300 text-red-600 px-5 py-3 rounded-2xl text-center max-w-md shadow-sm animate-in fade-in slide-in-from-bottom-2">
                <p
                  className={`${compact ? "text-xs" : "text-sm"} font-black uppercase tracking-tight`}
                >
                  You’ve run out of tokens.
                </p>

                <p className="text-[10px] opacity-70 font-medium mb-2 leading-tight">
                  (Might be shown before answer completion)
                </p>

                <Link
                  href="/lens#token"
                  className={`${compact ? "text-[11px]" : "text-xs"} inline-flex items-center gap-1 bg-red-600 text-white px-4 py-1.5 rounded-full font-bold hover:bg-red-700 transition-all active:scale-95 no-underline`}
                >
                  Buy more tokens →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Prompt Input */}
        <div
          className={`sticky bottom-0 border-t bg-stone-50 border-stone-200 ${compact ? "p-1" : "p-4"}`}
        >
          <div className="flex flex-col items-center gap-2">
            <AutoResizeTextarea
              onSend={handleSend}
              compact={compact}
              disabled={!user || isDepleted}
            />
            <p
              className={`${compact ? "text-[10px]" : "text-xs"} text-gray-500 text-center max-w-2xl pb-1`}
            >
              Responses may contain inaccuracies. Please verify important
              information independently.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
