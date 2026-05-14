"use client";

import React, { useState } from "react";
import { Copy, Check, Send, AlertCircle } from "lucide-react";

export default function DirectContactCard() {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    message: "",
  });
  const [copied, setCopied] = useState(false);

  const EMAIL_CONFIG = {
    address: "contact[at]shotrip.jp",
    actualEmail: "contact@shotrip.jp",
    subjectPrefix: "【Inquiry】",
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendEmail = () => {
    const body = `Name: ${formData.name}\n\nMessage:\n${formData.message}`;
    const mailtoUrl = `mailto:${EMAIL_CONFIG.actualEmail}?subject=${encodeURIComponent(
      EMAIL_CONFIG.subjectPrefix + formData.subject,
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const handleCopyTemplate = () => {
    const text = `Subject: ${EMAIL_CONFIG.subjectPrefix}${formData.subject}\nName: ${formData.name}\nMessage: \n${formData.message}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-8 md:p-10 shadow-sm max-w-2xl mx-auto my-6 md:my-20">
      <div className="space-y-8">
        {/* Language Hybrid Header (元の色合いを復活) */}
        <div className="relative overflow-hidden p-8 rounded-2xl border border-indigo-100/50 bg-linear-to-br from-indigo-50/50 via-white to-rose-50/50 shadow-sm">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-200/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-rose-200/20 rounded-full blur-2xl" />

          <div className="relative flex flex-col items-center text-center space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500/80">
                Direct Contact
              </span>
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Contact Us
              </h2>
              <p className="text-sm font-semibold text-slate-600">
                Please reach out to us directly via the email address below.
              </p>
              <p className="text-[11px] text-slate-500 font-medium italic">
                (直接メールにてお問い合わせを承っております)
              </p>
            </div>

            <div className="mt-4 px-6 py-2 bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-full text-indigo-600 font-mono font-bold shadow-sm">
              {EMAIL_CONFIG.address}
            </div>
          </div>
        </div>

        {/* Form Inputs (Drafting area) */}
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
              Name{" "}
              <span className="text-[9px] font-medium normal-case tracking-normal text-slate-400">
                / お名前
              </span>
            </label>
            <input
              name="name"
              onChange={handleInputChange}
              placeholder="Your Name"
              className="block w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
              Subject{" "}
              <span className="text-[9px] font-medium normal-case tracking-normal text-slate-400">
                / 件名
              </span>
            </label>
            <input
              name="subject"
              onChange={handleInputChange}
              placeholder="How can we help you?"
              className="block w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
              Message{" "}
              <span className="text-[9px] font-medium normal-case tracking-normal text-slate-400">
                / 本文
              </span>
            </label>
            <textarea
              name="message"
              onChange={handleInputChange}
              rows={5}
              placeholder="Enter details..."
              className="block w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={handleSendEmail}
            className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white font-bold py-5 rounded-xl transition-all shadow-lg active:scale-[0.98] group"
          >
            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            <div className="flex flex-col items-start leading-tight">
              <span className="text-sm">Compose Email</span>
              <span className="text-[10px] font-normal opacity-70">
                メールを作成する
              </span>
            </div>
          </button>

          <button
            onClick={handleCopyTemplate}
            className="flex items-center justify-center gap-3 bg-white border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50/30 text-slate-700 font-bold py-5 rounded-xl transition-all active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />{" "}
                <span className="text-sm">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-indigo-500" />
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-sm">Copy Draft</span>
                  <span className="text-[10px] font-normal opacity-70">
                    内容をコピー
                  </span>
                </div>
              </>
            )}
          </button>
        </div>

        {/* Footer Info */}
        <div className="pt-6 border-t border-slate-100">
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[12px] font-bold text-amber-900 leading-tight">
                IMPORTANT: Manual Entry Required
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Please manually replace <strong>[at]</strong> with{" "}
                <strong>@</strong> in the email address.
                <span className="block mt-1 text-[10px] text-amber-700/80 font-medium italic">
                  (スパム防止のため、[at]を@に書き換えて手動入力をお願いします)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
