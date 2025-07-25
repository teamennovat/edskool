import { Cookies } from 'react-cookie-consent';
import { useEffect, useState } from 'react';

export function useCookieConsent() {
  const [hasAnalyticsCookies, setHasAnalyticsCookies] = useState(false);
  const [hasMarketingCookies, setHasMarketingCookies] = useState(false);

  useEffect(() => {
    // Check cookie consent status on client side
    const analyticsCookies = Cookies.get('analytics-cookies') === 'true';
    const marketingCookies = Cookies.get('marketing-cookies') === 'true';

    setHasAnalyticsCookies(analyticsCookies);
    setHasMarketingCookies(marketingCookies);
  }, []);

  const resetCookieConsent = () => {
    Cookies.remove('CookieConsent');
    Cookies.remove('analytics-cookies');
    Cookies.remove('marketing-cookies');
    window.location.reload();
  };

  return {
    hasAnalyticsCookies,
    hasMarketingCookies,
    resetCookieConsent,
  };
}
