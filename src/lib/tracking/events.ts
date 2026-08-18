'use client';

/**
 * Client-side event tracking utilities.
 * Fires events on GA4 (gtag), Meta Pixel (fbq), and GTM dataLayer.
 * All functions are safe to call even when tracking isn't configured
 * (they silently no-op if the global functions don't exist).
 */

type EventName = 'PageView' | 'ViewProject' | 'ClickLiveDemo' | 'ClickGitHub' | 'DownloadResume' | 'ContactSubmit';

interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Track an event across all configured tracking platforms.
 * Safe to call from any client component — silently no-ops if tracking isn't set up.
 */
export function trackEvent(eventName: EventName, params?: EventParams): void {
  if (typeof window === 'undefined') return;

  // Google Analytics 4 + Google Ads (via gtag)
  if (typeof window.gtag === 'function') {
    if (eventName === 'PageView') {
      window.gtag('event', 'page_view', {
        page_path: params?.page_path ?? window.location.pathname,
        ...params,
      });
    } else {
      window.gtag('event', eventName.toLowerCase(), params);
    }
  }

  // Meta Pixel (via fbq)
  if (typeof window.fbq === 'function') {
    if (eventName === 'PageView') {
      window.fbq('track', 'PageView');
    } else if (eventName === 'ContactSubmit') {
      window.fbq('track', 'Lead', params);
    } else {
      window.fbq('trackCustom', eventName, params);
    }
  }

  // Google Tag Manager (via dataLayer)
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: eventName,
      ...params,
    });
  }
}

/**
 * Track a page view — call on route change (for SPA navigation).
 */
export function trackPageView(path?: string): void {
  trackEvent('PageView', { page_path: path ?? (typeof window !== 'undefined' ? window.location.pathname : '/') });
}

/**
 * Track viewing a project detail page.
 */
export function trackViewProject(slug: string, title?: string): void {
  trackEvent('ViewProject', { project_slug: slug, project_title: title });
}

/**
 * Track clicking the Live Demo button on a project.
 */
export function trackClickLiveDemo(slug: string, url: string): void {
  trackEvent('ClickLiveDemo', { project_slug: slug, demo_url: url });
}

/**
 * Track clicking the GitHub link on a project.
 */
export function trackClickGitHub(slug: string, url: string): void {
  trackEvent('ClickGitHub', { project_slug: slug, github_url: url });
}

/**
 * Track downloading the resume.
 */
export function trackDownloadResume(): void {
  trackEvent('DownloadResume');
}

/**
 * Track submitting the contact form.
 */
export function trackContactSubmit(name: string, email: string): void {
  trackEvent('ContactSubmit', { contact_name: name, contact_email: email });
}

// Type augmentation for window globals
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    _fbq?: unknown;
  }
}
