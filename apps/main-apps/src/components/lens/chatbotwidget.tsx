"use client";

import { useState } from "react";
import { Bot, X } from "lucide-react";
import Shotrip_Lens_Client from "./shotrip_lens_client";
import { RemainingTokenClient_for_Widget } from "./remainingTokenClient_for_Widget";
import AmplifyConfigure from "../en_only/amplifyConfigure";


export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AmplifyConfigure />
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-24 right-6 md:right-6 w-14 h-14 rounded-full bg-brand-red-light hover:bg-brand-red text-white shadow-lg flex items-center justify-center hover:scale-105 transition z-100"
        >
          <Bot />
        </button>
      )}

      {/* Widget Panel */}
      {open && (
        <div 
          className={`
            fixed z-100 bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden transition-all duration-300
            bottom-6 right-4 left-4 w-auto h-[80vh]
            md:bottom-24 md:right-6 md:left-auto md:w-96 md:max-h-150
          `}
        >
          {/* Header */}
          <div className="flex items-center px-5 py-4 border-b bg-brand-red-light text-white shrink-0">
            <div className="flex items-center gap-2">
              <Bot size={18} />
              <span className="font-bold text-sm tracking-tight">Shotrip Lens</span>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <RemainingTokenClient_for_Widget />
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          <div className="flex-1 min-h-0 bg-stone-50">
            <Shotrip_Lens_Client 
              compact 
              lensContext={{tenantId: "shotrip", namespace: "all", token: "dummy-token"}}
            />
          </div>
        </div>
      )}
    </>
  );
}
