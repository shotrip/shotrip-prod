"use client";

import { useState, useEffect, useMemo } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Search, Loader2, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ArticleSearchProps } from "@/types/articleSearch";
import { SearchIndexItem } from "@/types/searchIndex";

export default function ArticleSearch({
  placeholder,
  locale,
}: ArticleSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [allArticles, setAllArticles] = useState<SearchIndexItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadIndex = async () => {
      if (open && allArticles.length === 0) {
        setIsLoading(true);
        try {
          const res = await fetch("/search-index.json");
          const data: SearchIndexItem[] = await res.json();
          setAllArticles(data);
        } catch (err) {
          console.error("Search index load failed:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadIndex();
  }, [open, allArticles.length]);

  const filteredResults = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();
    if (trimmedQuery.length < 2) return [];

    return allArticles.filter(article => {
      const searchFields = [
        article.title,
        article.excerpt,
        article.region,
        article.prefecture,
        article.category,
      ].filter(Boolean);

      return searchFields.some(field => 
        field?.toLowerCase().includes(trimmedQuery)
      );
    }).slice(0, 5);
  }, [query, allArticles]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button className="p-2 rounded-full bg-stone-50/50 transition-colors text-stone-800 hover:bg-stone-400 hover:text-stone-100 focus:outline-none">
          <Search className="w-5 h-5" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          align="end"
          collisionPadding={100}
          className="z-50 w-full max-w-70 bg-white rounded-2xl shadow-2xl border border-stone-100 animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
        >
          <div className="p-3 bg-stone-50/50 border-b border-stone-100 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-3 pr-8 py-2 bg-white rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
              autoFocus
            />
            {query && (
              <button 
                onClick={() => setQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="max-h-95 overflow-y-auto">
            {isLoading ? (
              <div className="p-10 flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-brand-red" />
                <p className="text-[10px] text-stone-400 uppercase tracking-widest">Loading Index...</p>
              </div>
            ) : filteredResults.length > 0 ? (
              <div className="p-2 space-y-1">
                {filteredResults.map((article) => (
                  <Link
                    key={`${article.type}-${article.slug}`}
                    href={
                      article.type === "regional"
                        ? `/${locale}/blog/${article.region}/${article.prefecture}/${article.slug}`
                        : `/${locale}/blog/essentials/${article.category}/${article.slug}`
                    }
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-stone-50 transition-all group"
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-100">
                      <Image src={article.thumbnail} alt="" fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-brand-red uppercase tracking-wider mb-0.5">
                        {article.type === "regional" ? article.prefecture : article.category}
                      </p>
                      <h4 className="text-xs font-bold text-stone-800 line-clamp-1 group-hover:text-brand-red transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-[10px] text-stone-400 line-clamp-1 mt-0.5 font-medium">
                        {article.date}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : query.length >= 2 ? (
              <div className="p-10 text-center">
                <p className="text-xs text-stone-400">No articles match your search.</p>
              </div>
            ) : (
              <div className="p-10 text-center">
                <p className="text-[10px] text-stone-300 uppercase tracking-[0.2em] font-bold">
                  Enter at least 2 characters
                </p>
              </div>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
