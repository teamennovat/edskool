"use client";

import { useEffect, useState } from "react";
import CookieConsent, { Cookies } from "react-cookie-consent";
import Link from "next/link";

export function CookieBanner() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render on server to prevent hydration mismatch
  if (!isClient) return null;

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept All Cookies"
      declineButtonText="Accept Necessary Only"
      enableDeclineButton
      style={{
        background: "rgba(0, 0, 0, 0.9)",
        padding: "1rem",
        alignItems: "center",
        gap: "1rem",
      }}
      buttonStyle={{
        background: "#2563eb",
        color: "white",
        borderRadius: "0.375rem",
        padding: "0.5rem 1rem",
        fontSize: "0.875rem",
        fontWeight: 500,
      }}
      declineButtonStyle={{
        background: "transparent",
        border: "1px solid #ffffff40",
        color: "white",
        borderRadius: "0.375rem",
        padding: "0.5rem 1rem",
        fontSize: "0.875rem",
        fontWeight: 500,
      }}
      containerClasses="flex flex-col sm:flex-row items-center justify-between"
      contentClasses="flex-1"
      buttonWrapperClasses="flex gap-2 mt-4 sm:mt-0"
      expires={365}
      onAccept={() => {
        // Set cookie for analytics and all other cookies
        Cookies.set("analytics-cookies", "true", { expires: 365 });
        Cookies.set("marketing-cookies", "true", { expires: 365 });
      }}
      onDecline={() => {
        // Remove non-essential cookies
        Cookies.remove("analytics-cookies");
        Cookies.remove("marketing-cookies");
      }}
    >
      <span className="text-sm">
        We use cookies to enhance your experience. By continuing to visit this
        site you agree to our use of cookies.{" "}
        <Link
          href="/privacy"
          className="text-primary underline hover:text-primary/80"
        >
          Learn more
        </Link>
      </span>
    </CookieConsent>
  );
}
