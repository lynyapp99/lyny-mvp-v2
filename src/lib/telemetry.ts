/**
 * Telemetry utility for tracking UI interactions
 * 
 * This provides a simple interface for logging user interactions
 * with the UI. In production, this would send events to your
 * analytics service (e.g., PostHog, Mixpanel, Google Analytics).
 */

export interface UITapEvent {
  element_id: string;
  screen: string;
  success: boolean;
  timestamp?: number;
  metadata?: Record<string, any>;
}

export interface UINavErrorEvent {
  error: string;
  screen: string;
  element_id?: string;
  timestamp?: number;
  metadata?: Record<string, any>;
}

class Telemetry {
  private enabled: boolean = true;

  /**
   * Track a UI tap/click event
   */
  trackTap(event: UITapEvent) {
    if (!this.enabled) return;

    const fullEvent = {
      ...event,
      timestamp: event.timestamp || Date.now(),
      type: 'ui_tap',
    };

    // In development, log to console
    if (import.meta.env.DEV) {
      console.log('[Telemetry] UI Tap:', fullEvent);
    }

    // In production, send to your analytics service
    // Example: analytics.track('ui_tap', fullEvent);
  }

  /**
   * Track a navigation error
   */
  trackNavError(event: UINavErrorEvent) {
    if (!this.enabled) return;

    const fullEvent = {
      ...event,
      timestamp: event.timestamp || Date.now(),
      type: 'ui_nav_error',
    };

    // In development, log to console
    if (import.meta.env.DEV) {
      console.error('[Telemetry] Nav Error:', fullEvent);
    }

    // In production, send to your analytics service
    // Example: analytics.track('ui_nav_error', fullEvent);
  }

  /**
   * Enable or disable telemetry
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }
}

export const telemetry = new Telemetry();
