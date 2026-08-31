import { whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Floating WhatsApp logo — icon only. */
export function WhatsAppFloat({ raised = false }: { raised?: boolean } = {}) {
  return (
    <a
      href={whatsappUrl("Hello Elysium — I’d like to enquire about a stay.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={cn("wa-float", raised && "wa-float--raised")}
    >
      <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
        <rect width="48" height="48" rx="12" fill="#25D366" />
        <path
          fill="#fff"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24 11.5c-6.9 0-12.5 5.6-12.5 12.5 0 2.2.58 4.3 1.68 6.18L11.5 36.5l6.62-1.73A12.44 12.44 0 0 0 24 36.5c6.9 0 12.5-5.6 12.5-12.5S30.9 11.5 24 11.5zm0 2.2c5.68 0 10.3 4.62 10.3 10.3 0 5.68-4.62 10.3-10.3 10.3a10.2 10.2 0 0 1-5.2-1.42l-.37-.22-3.88 1.02 1.02-3.78-.24-.37A10.18 10.18 0 0 1 13.7 24c0-5.68 4.62-10.3 10.3-10.3zm-3.05 5.05c-.15-.33-.31-.34-.45-.34h-.4c-.14 0-.36.05-.55.27-.19.22-.74.72-.74 1.76s.76 2.04.87 2.18c.11.14 1.47 2.36 3.56 3.21 1.76.69 2.12.55 2.5.52.38-.03 1.22-.5 1.39-.98.17-.48.17-.89.12-.98-.05-.09-.19-.14-.4-.25-.21-.11-1.22-.6-1.41-.67-.19-.07-.33-.11-.47.11-.14.22-.54.67-.66.8-.12.14-.24.15-.45.05-.21-.11-.88-.32-1.68-1.03-.62-.55-1.04-1.23-1.16-1.44-.12-.21-.01-.33.09-.43.09-.09.21-.24.31-.36.1-.12.14-.21.21-.35.07-.14.04-.26-.02-.37-.06-.11-.47-1.13-.64-1.55-.17-.4-.34-.35-.47-.35h-.4z"
        />
      </svg>
    </a>
  );
}
