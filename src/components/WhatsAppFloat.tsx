import { whatsappUrl } from "@/lib/site";

export function WhatsAppFloat({ raised }: { raised?: boolean }) {
  return (
    <a
      href={whatsappUrl("Hello, I would like to enquire about a stay at Elysium.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className={
        raised
          ? "fixed right-3 bottom-[5.5rem] z-45 flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg sm:bottom-5 sm:right-5"
          : "fixed right-3 bottom-5 z-45 flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg sm:right-5"
      }
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.38-1.4a10.1 10.1 0 0 0 4.66 1.14h.01c5.46 0 9.89-4.4 9.89-9.84C21.94 6.4 17.5 2 12.04 2Zm0 17.97h-.01a8.4 8.4 0 0 1-4.28-1.17l-.31-.18-3.19.83.85-3.11-.2-.32a8.2 8.2 0 0 1-1.26-4.36c0-4.55 3.73-8.25 8.32-8.25 4.58 0 8.32 3.7 8.32 8.25 0 4.55-3.74 8.31-8.24 8.31Zm4.57-6.21c-.25-.12-1.47-.72-1.7-.8-.23-.09-.4-.12-.56.12-.17.25-.64.8-.79.97-.14.17-.3.19-.55.06-.25-.12-1.05-.38-2-1.22-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.3.37-.44.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.77-1.84-.2-.48-.4-.41-.56-.42h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.09 0 1.23.9 2.42 1.03 2.59.12.17 1.77 2.7 4.3 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.1-.23-.16-.48-.28Z" />
      </svg>
    </a>
  );
}
