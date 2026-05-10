"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { Revision } from "@/types/revision";



export default function RevisionList({ revisions }: { revisions: Revision[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const INITIAL_COUNT = 10;
  const initialRevisions = revisions.slice(0, INITIAL_COUNT);
  const hiddenRevisions = revisions.slice(INITIAL_COUNT);
  const hasMore = revisions.length > INITIAL_COUNT;

  return (
    <div className="relative">
      <div className="absolute left-1.75 top-2 bottom-2 w-0.5 bg-slate-100 hidden sm:block" />

      <div className="space-y-12">
        {initialRevisions.map((item) => (
          <RevisionItem key={item.slug} item={item} />
        ))}

        {hasMore && (
          <div 
            className={`space-y-12 transition-all duration-500 ease-in-out overflow-hidden ${
              isExpanded ? "max-h-1250 opacity-100 mt-12" : "max-h-0 opacity-0"
            }`}
          >
            {hiddenRevisions.map((item) => (
              <RevisionItem key={item.slug} item={item} />
            ))}
          </div>
        )}
      </div>

      {hasMore && (
        <div className="mt-16 flex justify-center sm:pl-10">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-8 py-3 rounded-full border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={18} />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown size={18} />
                Show All ({revisions.length} total)
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function RevisionItem({ item }: { item: Revision }) {
  return (
    <div className="relative sm:pl-10 group">
      <div className="absolute left-0 top-2.5 w-4 h-4 rounded-full border-4 border-white bg-slate-300 group-hover:bg-brand-red group-hover:scale-125 transition-all duration-300 hidden sm:block shadow-sm" />

      <div className="flex flex-col space-y-2">
        <time className="text-[11px] font-bold font-mono text-slate-400 tracking-wider uppercase">
          {item.date}
        </time>

        <Link
          href={`/legal/revision_history/${item.slug}`}
          className="group/link inline-flex items-center gap-4 p-6 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-md transition-all duration-300 overflow-hidden relative"
        >
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-800 group-hover/link:text-brand-red transition-colors">
              {item.title}
            </h2>
          </div>
          <ArrowRight
            className="text-slate-300 group-hover/link:text-brand-red group-hover/link:translate-x-1 transition-all"
            size={20}
          />
        </Link>
      </div>
    </div>
  );
}