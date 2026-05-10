"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Tag, CalendarDays, ArrowRight } from "lucide-react";
import { INTERNAL_UI_TEXT } from "@/lib/data/i18n/internalUi";
import { ArticleInfiniteGridForEssentialsProps, ArticleInfiniteGridForPrefecturesProps } from "@/types/articleInfiniteGrid";

export function ArticleInfiniteGridForEssentials({
  articles,
  locale,
  category,
}: ArticleInfiniteGridForEssentialsProps) {

  const text = INTERNAL_UI_TEXT[locale]

  const INCREMENT = 4;
  const [displayCount, setDisplayCount] = useState(INCREMENT);

  const visibleArticles = articles.slice(0, displayCount);
  const hasMore = displayCount < articles.length;

  const loadMore = () => {
    setDisplayCount((prev) => prev + INCREMENT);
  };

 return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        {visibleArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/${locale}/blog/essentials/${category}/${article.slug}`}
            className="group flex gap-5 p-4 rounded-2xl border border-slate-100 bg-white hover:border-blue-100 hover:shadow-md transition-all duration-300 items-start"
          >
            <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-xl bg-slate-50">
              <Image
                src={article.thumbnail}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                <div className="flex items-center gap-1 text-[10px] font-bold font-mono text-slate-400">
                  <CalendarDays size={12} className="text-slate-300" />
                  {article.date}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md group-hover:text-blue-500 group-hover:bg-blue-50 transition-colors"
                    >
                      <Tag size={10} strokeWidth={2.5} className="opacity-70" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <h2 className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                {article.title}
              </h2>

              <p className="text-xs leading-relaxed text-slate-500 line-clamp-2">
                {article.excerpt}
              </p>

              <div className="mt-2 flex justify-end">
                <div className="flex items-center gap-1 text-[9px] font-black tracking-widest text-slate-200 group-hover:text-blue-400 transition-all">
                  Read More
                  <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={loadMore}
            className="flex items-center gap-2 px-8 py-3 rounded-full border border-slate-200 text-slate-500 text-xs font-bold hover:bg-slate-50 hover:text-slate-800 transition-all active:scale-95"
          >
            <Plus size={16} />
            {text.others.show_articles.show_more}
          </button>
        </div>
      )}
    </div>
  );
}


export function ArticleInfiniteGridForPrefectures({
  articles,
  locale,
  region,
  prefecture
}: ArticleInfiniteGridForPrefecturesProps) {

  const text = INTERNAL_UI_TEXT[locale]

  const INCREMENT = 4;
  const [displayCount, setDisplayCount] = useState(INCREMENT);

  const visibleArticles = articles.slice(0, displayCount);
  const hasMore = displayCount < articles.length;

  const loadMore = () => {
    setDisplayCount((prev) => prev + INCREMENT);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        {visibleArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/${locale}/blog/${region}/${prefecture}/${article.slug}`}
            className="group flex gap-5 p-4 rounded-2xl border border-slate-100 bg-white hover:border-blue-100 hover:shadow-md transition-all duration-300 items-start"
          >
            <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-xl bg-slate-50">
              <Image
                src={article.thumbnail}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                <div className="flex items-center gap-1 text-[10px] font-bold font-mono text-slate-400">
                  <CalendarDays size={12} className="text-slate-300" />
                  {article.date}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md group-hover:text-blue-500 group-hover:bg-blue-50 transition-colors"
                    >
                      <Tag size={10} strokeWidth={2.5} className="opacity-70" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <h2 className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                {article.title}
              </h2>

              <p className="text-xs leading-relaxed text-slate-500 line-clamp-2">
                {article.excerpt}
              </p>

              <div className="mt-2 flex justify-end">
                <div className="flex items-center gap-1 text-[9px] font-black tracking-widest text-slate-200 group-hover:text-blue-400 transition-all">
                  Read More
                  <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={loadMore}
            className="flex items-center gap-2 px-8 py-3 rounded-full border border-slate-200 text-slate-500 text-xs font-bold hover:bg-slate-50 hover:text-slate-800 transition-all active:scale-95"
          >
            <Plus size={16} />
            {text.others.show_articles.show_more}
          </button>
        </div>
      )}
    </div>
  );
}