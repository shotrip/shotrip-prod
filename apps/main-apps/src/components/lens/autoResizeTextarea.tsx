"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Mic, Square } from "lucide-react";
import type { SpeechRecognition, SpeechRecognitionEvent } from "@/types/speech";

export default function AutoResizeTextarea({
  onSend,
  compact = false,
  disabled = false,
}: {
  onSend: (text: string) => void;
  compact?: boolean;
  disabled?: boolean
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const MAX_HEIGHT = compact ? 100 : 160;

  useEffect(() => {
    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognitionConstructor) {
      const recognition = new SpeechRecognitionConstructor();
      recognition.lang = "en-US";
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let currentTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setValue(currentTranscript);
      };

      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const handleInput = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    el.style.height = "auto";
    const newHeight = el.scrollHeight;

    if (newHeight > MAX_HEIGHT) {
      el.style.height = MAX_HEIGHT + "px";
      el.style.overflowY = "auto";
    } else {
      el.style.height = newHeight + "px";
      el.style.overflowY = "hidden";
    }
  }, [MAX_HEIGHT]);

    useEffect(() => {
    handleInput();
  },[handleInput]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!value.trim()) return;

    onSend(value);
    setValue("");

    if (isListening) {
      recognitionRef.current?.stop();
    }

    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.overflowY = "hidden";
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setValue("");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="flex flex-col w-2/3 gap-1.5">
      <div
        className={`${compact ? "w-full p-2 rounded-lg" : "w-full p-3 rounded-xl"} border flex items-end gap-2 bg-white shadow-sm`}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={toggleListening}
          className={`shrink-0 flex items-center justify-center rounded-full transition-all
            ${compact ? "w-6 h-6" : "w-7 h-7"}
            ${isListening ? "bg-red-500 text-white animate-pulse" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
        >
          {isListening ? (
            <Square size={compact ? 12 : 16} fill="currentColor" />
          ) : (
            <Mic size={compact ? 14 : 18} />
          )}
        </button>

        <textarea
          disabled={disabled}
          ref={ref}
          rows={1}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (isListening) recognitionRef.current?.stop();
          }}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening..." : "Enter your text..."}
          className={`flex-1 resize-none outline-none focus:ring-0 py-0.5 leading-6 ${compact ? "text-xs" : "text-base"}`}
        />

        <button
          disabled={!value.trim() || disabled}
          onClick={handleSubmit}
          className={`rounded-full shrink-0
                      flex items-center justify-center
                      ${compact ? "w-6 h-6 text-xs" : "w-7 h-7"}
                      ${value.trim() ? "bg-black text-white" : "bg-gray-300 text-gray-500"}`}
        >
          ↑
        </button>
      </div>

      {isListening && (
        <p className={`text-red-500 font-medium ml-2 ${compact ? "text-[10px]" : "text-xs"}`}>
          ● Listening... Speak now
        </p>
      )}
    </div>
  );
}