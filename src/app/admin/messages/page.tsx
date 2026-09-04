"use client";

import { useState, useMemo } from "react";
import { cn, truncateText } from "@/lib/utils";

/* ═══════════════════════════════════════════════════
   Types & Mock Data
   ═══════════════════════════════════════════════════ */

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "msg-1",
    name: "Priyanka Sharma",
    email: "priyanka.sharma@gmail.com",
    subject: "Custom Bridal Set Inquiry",
    message:
      "Namaste Radha Rani team, I am getting married in December in Jaipur and looking for a customized 22K gold plated bridal bangle set matching my crimson lehenga. Could you share bespoke design options, stone customization possibilities, and standard delivery lead times?",
    date: "2026-09-03",
    read: false,
  },
  {
    id: "msg-2",
    name: "Ananya Patel",
    email: "ananya.patel@outlook.com",
    subject: "Size Guide Question",
    message:
      "Hello! I am confused between size 2.4 and 2.6 for the Kundan Peacock Kada. My wrist circumference measures approximately 6.5 inches. Which size would ensure a comfortable fit without slipping over the knuckles?",
    date: "2026-09-02",
    read: false,
  },
  {
    id: "msg-3",
    name: "Rajesh & Sunita Mehra",
    email: "mehra.jewels@yahoo.co.in",
    subject: "Bulk Order Request for Wedding Return Gifts",
    message:
      "We are interested in placing a bulk order of 60 pairs of the Antique Temple Kada for our daughter's wedding guests in Delhi. Do you offer corporate/wholesale pricing tiers and custom luxury velvet gift boxes with monogramming?",
    date: "2026-09-01",
    read: false,
  },
  {
    id: "msg-4",
    name: "Dr. Kavita Iyer",
    email: "kavita.iyer@gmail.com",
    subject: "Shipping to USA Query",
    message:
      "Hi Radha Rani, I live in California and absolutely adore your Polki Bangles collection. Do you ship to the US, and what are the typical insured DHL/FedEx shipping rates and delivery timelines to San Jose?",
    date: "2026-08-30",
    read: true,
  },
  {
    id: "msg-5",
    name: "Vikramaditya Singhania",
    email: "v.singhania@heritagecrafts.in",
    subject: "Bespoke Royal Heritage Collection Collaboration",
    message:
      "Greetings. We operate a luxury heritage boutique in Udaipur and would love to discuss featuring an exclusive Radha Rani bangles curation in our showroom. We would appreciate connecting with your lead designer or founder.",
    date: "2026-08-28",
    read: true,
  },
  {
    id: "msg-6",
    name: "Meera Nambiar",
    email: "meera.nambiar88@gmail.com",
    subject: "Restock Update for Ruby Floral Chooda",
    message:
      "Can you please let me know when the Ruby Floral Royal Chooda in size 2.8 will be back in stock? I added it to my wishlist but wanted to confirm before our festive celebrations commence next month.",
    date: "2026-08-26",
    read: true,
  },
  {
    id: "msg-7",
    name: "Sneha Kulkarni",
    email: "sneha.kulkarni@rediffmail.com",
    subject: "Care Instructions for Antique Gold Finish",
    message:
      "I recently received my order of the Royal Rajwadi Bangles set. They look magnificent and the craftsmanship is exquisite! Could you advise on the best practices to clean and store them to maintain the antique matte gold luster over the years?",
    date: "2026-08-25",
    read: true,
  },
  {
    id: "msg-8",
    name: "Tanya Deshmukh",
    email: "tanyad@gmail.com",
    subject: "Exchange Request - Incorrect Size Delivered",
    message:
      "Hello, I received Order #RR-8492 yesterday. The bangles are gorgeous, however I accidentally ordered size 2.2 instead of 2.6. The packaging is completely intact with original tags. Could you please assist with an exchange procedure?",
    date: "2026-08-22",
    read: false,
  },
];

type FilterTab = "all" | "unread" | "read";

function formatDisplayDate(dateString: string): string {
  try {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/* ═══════════════════════════════════════════════════
   Messages Page Component
   ═══════════════════════════════════════════════════ */

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>("msg-1");
  const [replyText, setReplyText] = useState<{ [id: string]: string }>({});
  const [replySent, setReplySent] = useState<{ [id: string]: boolean }>({});
  const [replyComposerOpen, setReplyComposerOpen] = useState<{ [id: string]: boolean }>({});

  const unreadCount = useMemo(
    () => messages.filter((m) => !m.read).length,
    [messages]
  );

  const readCount = useMemo(
    () => messages.filter((m) => m.read).length,
    [messages]
  );

  // Filtered messages
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      // Tab filter
      if (activeTab === "unread" && msg.read) return false;
      if (activeTab === "read" && !msg.read) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = msg.name.toLowerCase().includes(q);
        const matchesEmail = msg.email.toLowerCase().includes(q);
        const matchesSubject = msg.subject.toLowerCase().includes(q);
        const matchesMessage = msg.message.toLowerCase().includes(q);
        return matchesName || matchesEmail || matchesSubject || matchesMessage;
      }

      return true;
    });
  }, [messages, activeTab, searchQuery]);

  // Handlers
  const toggleReadStatus = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, read: !msg.read } : msg))
    );
  };

  const markAllAsRead = () => {
    setMessages((prev) => prev.map((msg) => ({ ...msg, read: true })));
  };

  const handleCardClick = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      // Auto mark as read on open if unread
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
      );
    }
  };

  const handleDeleteMessage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
    if (expandedId === id) {
      setExpandedId(null);
    }
  };

  const handleSendReply = (id: string, email: string) => {
    if (!replyText[id]?.trim()) return;

    setReplySent((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setReplyText((prev) => ({ ...prev, [id]: "" }));
      setReplyComposerOpen((prev) => ({ ...prev, [id]: false }));
      setTimeout(() => {
        setReplySent((prev) => ({ ...prev, [id]: false }));
      }, 3000);
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-2xl lg:text-3xl font-semibold text-white tracking-wide">
                Messages
              </h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium font-body bg-[#A16207]/20 text-[#D4A853] border border-[#A16207]/40 shadow-sm animate-pulse-gold">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <p className="font-body text-xs text-white/40 mt-1">
              Customer inquiries, custom bridal requests, and support queries
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/[0.08] font-body text-xs font-medium transition-all duration-200 cursor-pointer"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L7 17l-5-5" />
                <path d="M22 10l-7.5 7.5L13 16" />
              </svg>
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* ── Filters & Search ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Filter Tabs */}
        <div className="flex items-center bg-white/[0.02] border border-white/[0.06] rounded-xl p-1 gap-1">
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "px-4 py-2 rounded-lg font-body text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-2",
              activeTab === "all"
                ? "bg-[#A16207]/20 text-[#D4A853] shadow-sm border border-[#A16207]/30"
                : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
            )}
          >
            All
            <span
              className={cn(
                "px-1.5 py-0.2 rounded-full text-[10px]",
                activeTab === "all"
                  ? "bg-[#A16207]/30 text-[#D4A853]"
                  : "bg-white/[0.06] text-white/40"
              )}
            >
              {messages.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("unread")}
            className={cn(
              "px-4 py-2 rounded-lg font-body text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-2",
              activeTab === "unread"
                ? "bg-[#A16207]/20 text-[#D4A853] shadow-sm border border-[#A16207]/30"
                : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
            )}
          >
            Unread
            <span
              className={cn(
                "px-1.5 py-0.2 rounded-full text-[10px]",
                activeTab === "unread"
                  ? "bg-[#A16207]/30 text-[#D4A853]"
                  : "bg-white/[0.06] text-white/40"
              )}
            >
              {unreadCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("read")}
            className={cn(
              "px-4 py-2 rounded-lg font-body text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-2",
              activeTab === "read"
                ? "bg-[#A16207]/20 text-[#D4A853] shadow-sm border border-[#A16207]/30"
                : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
            )}
          >
            Read
            <span
              className={cn(
                "px-1.5 py-0.2 rounded-full text-[10px]",
                activeTab === "read"
                  ? "bg-[#A16207]/30 text-[#D4A853]"
                  : "bg-white/[0.06] text-white/40"
              )}
            >
              {readCount}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-xs">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inquiries..."
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-9 pr-8 py-2 font-body text-xs text-white placeholder:text-white/30 outline-none focus:border-[#A16207]/50 focus:ring-1 focus:ring-[#A16207]/20 transition-all duration-200"
          />
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Messages List (Card-based) ── */}
      <div className="space-y-3">
        {filteredMessages.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4 text-[#D4A853]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h3 className="font-heading text-lg font-medium text-white mb-1">
              No messages found
            </h3>
            <p className="font-body text-xs text-white/40">
              {searchQuery
                ? `No messages matched "${searchQuery}". Try a different term.`
                : activeTab === "unread"
                ? "You have answered all incoming customer messages."
                : "Your customer inbox is empty."}
            </p>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isExpanded = expandedId === msg.id;
            const isUnread = !msg.read;

            return (
              <div
                key={msg.id}
                onClick={() => handleCardClick(msg.id)}
                className={cn(
                  "group relative rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden",
                  // Card base styling
                  "bg-white/[0.02] hover:bg-white/[0.035]",
                  // Selected state with gold accent & border-l-2
                  isExpanded
                    ? "border-white/[0.1] border-l-2 !border-l-[#A16207] bg-white/[0.04] shadow-lg shadow-black/20"
                    : "border-white/[0.06] border-l-2 border-l-transparent",
                  // Unread subtle accent
                  isUnread && !isExpanded && "bg-white/[0.028]"
                )}
              >
                {/* ── Summary Header Bar ── */}
                <div className="p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
                  {/* Read/Unread Dot Indicator */}
                  <div className="pt-1.5 shrink-0">
                    <button
                      onClick={(e) => toggleReadStatus(msg.id, e)}
                      title={isUnread ? "Mark as read" : "Mark as unread"}
                      className="p-1 -m-1 rounded hover:bg-white/10 transition-colors"
                      aria-label={isUnread ? "Mark as read" : "Mark as unread"}
                    >
                      {isUnread ? (
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4A853] opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D4A853]" />
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full h-2.5 w-2.5 bg-white/20 group-hover:bg-white/30 transition-colors" />
                      )}
                    </button>
                  </div>

                  {/* Sender Avatar */}
                  <div className="w-10 h-10 rounded-full bg-[#A16207]/15 border border-[#A16207]/30 flex items-center justify-center shrink-0 text-[#D4A853] font-body text-xs font-semibold">
                    {getInitials(msg.name)}
                  </div>

                  {/* Main Header Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={cn(
                            "font-body text-sm font-semibold tracking-wide",
                            isUnread ? "text-white" : "text-white/80"
                          )}
                        >
                          {msg.name}
                        </span>
                        <span className="font-body text-xs text-white/40 truncate">
                          &lt;{msg.email}&gt;
                        </span>
                      </div>

                      {/* Date */}
                      <span className="font-body text-[11px] text-white/40 shrink-0">
                        {formatDisplayDate(msg.date)}
                      </span>
                    </div>

                    {/* Subject */}
                    <p
                      className={cn(
                        "font-body text-xs sm:text-sm font-medium mb-1.5 transition-colors",
                        isExpanded
                          ? "text-[#D4A853]"
                          : isUnread
                          ? "text-white font-semibold"
                          : "text-white/70"
                      )}
                    >
                      {msg.subject}
                    </p>

                    {/* Truncated message preview (collapsed state only) */}
                    {!isExpanded && (
                      <p className="font-body text-xs text-white/40 line-clamp-2 leading-relaxed">
                        {truncateText(msg.message, 100)}
                      </p>
                    )}
                  </div>

                  {/* Right chevron indicator */}
                  <div className="pt-1 text-white/30 group-hover:text-white/70 transition-transform duration-200">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={cn(
                        "transition-transform duration-200",
                        isExpanded ? "rotate-180 text-[#D4A853]" : ""
                      )}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>

                {/* ── Expanded Message Details ── */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-white/[0.06] bg-black/20 space-y-4">
                    {/* Full Message Body */}
                    <div className="pt-3">
                      <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 sm:p-5">
                        <p className="font-body text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>
                    </div>

                    {/* Meta info & Action bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-2 text-xs font-body text-white/40">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>Received on {formatDisplayDate(msg.date)}</span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        {/* Mark as read/unread toggle button */}
                        <button
                          type="button"
                          onClick={(e) => toggleReadStatus(msg.id, e)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/[0.08] font-body text-xs transition-colors cursor-pointer"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            {msg.read ? (
                              <>
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                              </>
                            ) : (
                              <>
                                <polyline points="20 6 9 17 4 12" />
                              </>
                            )}
                          </svg>
                          {msg.read ? "Mark unread" : "Mark read"}
                        </button>

                        {/* Reply Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setReplyComposerOpen((prev) => ({
                              ...prev,
                              [msg.id]: !prev[msg.id],
                            }));
                          }}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#A16207] hover:bg-[#7C4D05] text-white font-body text-xs font-medium transition-all duration-200 cursor-pointer shadow-sm"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="9 17 4 12 9 7" />
                            <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
                          </svg>
                          Reply
                        </button>

                        {/* Delete message button */}
                        <button
                          type="button"
                          onClick={(e) => handleDeleteMessage(msg.id, e)}
                          title="Delete message"
                          className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* ── Inline Reply Composer (Simulated UI) ── */}
                    {replyComposerOpen[msg.id] && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="mt-3 pt-4 border-t border-white/[0.06] space-y-3"
                      >
                        <div className="flex items-center justify-between text-xs font-body text-white/60">
                          <span>
                            Replying to <strong className="text-white">{msg.name}</strong> ({msg.email})
                          </span>
                          <span className="text-[11px] text-[#D4A853]">
                            Radha Rani Concierge Desk
                          </span>
                        </div>

                        <textarea
                          rows={3}
                          value={replyText[msg.id] || ""}
                          onChange={(e) =>
                            setReplyText((prev) => ({
                              ...prev,
                              [msg.id]: e.target.value,
                            }))
                          }
                          placeholder={`Namaste ${msg.name},\nThank you for reaching out to Radha Rani Bangles...`}
                          className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl p-3 font-body text-xs text-white placeholder:text-white/20 outline-none focus:border-[#A16207] focus:ring-1 focus:ring-[#A16207]/30 transition-all resize-none"
                        />

                        <div className="flex items-center justify-between gap-2">
                          <p className="font-body text-[11px] text-white/30 italic">
                            * Phase 1 interactive preview: Simulated client reply UI
                          </p>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setReplyComposerOpen((prev) => ({
                                  ...prev,
                                  [msg.id]: false,
                                }))
                              }
                              className="px-3 py-1.5 rounded-lg text-white/50 hover:text-white font-body text-xs transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSendReply(msg.id, msg.email)}
                              disabled={!replyText[msg.id]?.trim()}
                              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#A16207] hover:bg-[#7C4D05] disabled:opacity-40 disabled:cursor-not-allowed text-white font-body text-xs font-medium transition-all duration-200 cursor-pointer shadow-md"
                            >
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                              </svg>
                              Send Response
                            </button>
                          </div>
                        </div>

                        {replySent[msg.id] && (
                          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-body text-xs flex items-center gap-2">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Response queued for delivery to {msg.email}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
