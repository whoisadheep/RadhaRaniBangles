"use client";

import { usePathname } from "next/navigation";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <a href={getWhatsAppUrl("Hello Radha Rani Bangles, I have a question about your collection.")} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp" className="fixed right-5 bottom-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2">
      <svg width="22" height="22" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.02 3C8.83 3 3 8.82 3 16c0 2.3.6 4.54 1.74 6.5L3 29l6.68-1.72A12.94 12.94 0 0 0 16.02 29C23.2 29 29 23.18 29 16S23.2 3 16.02 3Zm0 23.63c-2.02 0-4-.54-5.72-1.57l-.4-.24-3.96 1.02 1.06-3.86-.26-.4A10.57 10.57 0 1 1 16.02 26.63Zm5.8-7.91c-.32-.16-1.88-.93-2.17-1.04-.29-.1-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.18.21-.37.24-.68.08-1.85-.93-3.06-1.66-4.28-3.76-.32-.55.32-.51.93-1.7.1-.21.05-.4-.03-.56-.08-.16-.71-1.7-.97-2.33-.26-.62-.53-.54-.71-.55h-.61c-.21 0-.55.08-.84.4-.29.32-1.1 1.07-1.1 2.61s1.13 3.03 1.29 3.24c.16.21 2.22 3.4 5.38 4.77.75.32 1.33.51 1.79.65.75.24 1.43.21 1.97.13.6-.09 1.88-.77 2.14-1.52.26-.75.26-1.39.18-1.52-.08-.13-.29-.21-.61-.37Z" /></svg>
      <span className="font-body text-xs font-semibold uppercase tracking-wider">Chat on WhatsApp</span>
    </a>
  );
}
