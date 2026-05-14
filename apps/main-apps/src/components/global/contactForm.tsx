"use client";

import React, { useState } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { ENV } from "@/config/env";

export default function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch(
        `${ENV.GAS_URL}`,
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain",
          },
          body: JSON.stringify(data),
        },
      );
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm animate-in fade-in zoom-in duration-300">
        <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-green-500 w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          Message Sent!
        </h3>
        <p className="text-slate-600 mb-8">
          Thank you for reaching out. / お問い合わせありがとうございます。
          <br />
          We will get back to you shortly. /
          内容を確認の上、折り返しご連絡いたします。
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="px-8 py-3 rounded-full border border-slate-200 text-sm font-semibold text-slate-700 hover:border-brand-red hover:text-brand-red-dark hover:bg-red-50 transition-all shadow-sm active:scale-95"
        >
          Send another message / 別のメッセージを送る
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-8 md:p-10 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Language Hybrid Info */}
        <div className="relative overflow-hidden p-6 rounded-2xl border border-indigo-100/50 bg-linear-to-br from-indigo-50/50 via-white to-rose-50/50 shadow-sm">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-200/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-rose-200/20 rounded-full blur-2xl" />

          <div className="relative flex flex-col items-center text-center space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500/80">
                Language Support
              </span>
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            </div>

            <div className="space-y-1 text-slate-600">
              <p className="text-sm font-semibold tracking-tight">
                English & Japanese inquiries are both welcome.
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                英語および日本語でのお問い合わせを受け付けております。
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
              Name / お名前
            </label>
            <input
              name="name"
              type="text"
              placeholder="Your Name / 氏名・会社名"
              required
              className="block w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
              Email / メールアドレス
            </label>
            <input
              name="email"
              type="email"
              placeholder="email@example.com"
              required
              className="block w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
            Subject / 件名
          </label>
          <input
            name="subject"
            type="text"
            placeholder="How can we help you? / お問い合わせ内容の要約"
            required
            className="block w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
            Message / 本文
          </label>
          <textarea
            name="message"
            placeholder="Please enter details. / 具体的な内容をご記入ください。"
            required
            rows={5}
            className="block w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all resize-none"
          />
        </div>

        <button
          disabled={status === "loading"}
          className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Sending... / 送信中...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <span>Send Message / メッセージを送信</span>
            </>
          )}
        </button>

        {status === "error" && (
          <div className="flex items-center gap-2 text-red-500 text-sm font-medium animate-pulse justify-center">
            <AlertCircle className="w-4 h-4" />
            <p>
              Oops! Something went wrong. /
              送信に失敗しました。再度お試しください。
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
