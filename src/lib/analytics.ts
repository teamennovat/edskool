interface GtagEvent {
  action: string;
  category: string;
  label: string;
  value?: number;
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
  }
}

export const GA_TRACKING_ID = 'G-H60L7SD52S' as const;

/**
 * Initialize Google Tag Manager
 * Should be called only after checking for user consent
 */
export const initializeGTM = (): void => {
  try {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_TRACKING_ID, {
      page_path: window.location.pathname,
      anonymize_ip: true, // GDPR compliance
    });
  } catch (error) {
    console.error('Failed to initialize GTM:', error);
  }
};

/**
 * Track page views
 * @param url - The URL to track
 */
export const pageview = (url: string): void => {
  try {
    if (typeof window === 'undefined') return;
    
    if (window.gtag) {
      window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
        anonymize_ip: true,
      });
    }
  } catch (error) {
    console.error('Failed to track pageview:', error);
  }
};

/**
 * Track custom events
 * @param param0 - Event parameters
 */
export const event = ({ 
  action, 
  category, 
  label, 
  value 
}: GtagEvent): void => {
  try {
    if (typeof window === 'undefined') return;
    
    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
        non_interaction: false,
        send_to: GA_TRACKING_ID,
      });
    }
  } catch (error) {
    console.error('Failed to track event:', error);
  }
};
