"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { GA_TRACKING_ID, pageview, initializeGTM } from "@/lib/analytics";
import { useCookieConsent } from "@/hooks/use-cookie-consent";

export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { hasAnalyticsCookies } = useCookieConsent();

  // Initialize GA when component mounts
  useEffect(() => {
    if (hasAnalyticsCookies) {
      initializeGTM();
    }
  }, [hasAnalyticsCookies]);

  // Track page views when route changes
  useEffect(() => {
    if (hasAnalyticsCookies) {
      const url = pathname + searchParams.toString();
      pageview(url);
    }
  }, [pathname, searchParams, hasAnalyticsCookies]);

  if (!hasAnalyticsCookies) return null;

  return (
    <>
      <Script
        id="google-analytics-script"
        strategy="worker"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics-config"
        strategy="worker"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure',
              cookie_domain: window.location.hostname,
            });
          `,
        }}
      />
    </>
  );
}
