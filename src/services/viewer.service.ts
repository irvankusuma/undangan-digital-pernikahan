// services/viewer.service.ts
// Business Logic untuk Viewer Tracking & Analytics

import prisma from '@/lib/prisma';
import { TrackViewerInput } from '@/lib/validators';
import { Viewer } from '@prisma/client';

// ==================== TYPES ====================

export interface ViewerAnalytics {
  totalViews: number;
  uniqueVisitors: number;
  viewsByDevice: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  viewsByDay: Array<{
    date: string;
    count: number;
  }>;
  topCountries: Array<{
    country: string;
    count: number;
  }>;
  topCities: Array<{
    city: string;
    count: number;
  }>;
  recentViews: Viewer[];
}

// ==================== DEVICE DETECTION ====================

/**
 * Detect device type dari user agent
 */
export function detectDevice(userAgent: string): "mobile" | "tablet" | "desktop" {
  const ua = userAgent.toLowerCase();
  
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  
  return 'desktop';
}

/**
 * Detect browser dari user agent
 */
export function detectBrowser(userAgent: string): string {
  if (/edg/i.test(userAgent)) return 'Edge';
  if (/chrome/i.test(userAgent) && !/edg/i.test(userAgent)) return 'Chrome';
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return 'Safari';
  if (/firefox/i.test(userAgent)) return 'Firefox';
  if (/msie|trident/i.test(userAgent)) return 'Internet Explorer';
  return 'Unknown';
}

/**
 * Detect OS dari user agent
 */
export function detectOS(userAgent: string): string {
  if (/windows/i.test(userAgent)) return 'Windows';
  if (/mac/i.test(userAgent)) return 'MacOS';
  if (/linux/i.test(userAgent)) return 'Linux';
  if (/android/i.test(userAgent)) return 'Android';
  if (/ios|iphone|ipad|ipod/i.test(userAgent)) return 'iOS';
  return 'Unknown';
}

// ==================== TRACKING ====================

/**
 * Track viewer visit
 */
export async function trackViewer(data: TrackViewerInput): Promise<Viewer> {
  const device = data.userAgent ? detectDevice(data.userAgent) : null;
  const browser = data.userAgent ? detectBrowser(data.userAgent) : null;
  const os = data.userAgent ? detectOS(data.userAgent) : null;
  
  return prisma.viewer.create({
    data: {
      invitationId: data.invitationId,
      userAgent: data.userAgent,
      device,
      browser,
      os,
      ipAddress: data.ipAddress,
      sessionId: data.sessionId,
      referrer: data.referrer,
    },
  });
}

/**
 * Get viewer analytics untuk specific invitation
 */
export async function getViewerAnalytics(
  invitationId: string,
  days = 30
): Promise<ViewerAnalytics> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const viewers = await prisma.viewer.findMany({
    where: {
      invitationId,
      viewedAt: {
        gte: startDate,
      },
    },
    orderBy: {
      viewedAt: 'desc',
    },
  });
  
  const totalViews = viewers.length;
  
  // Unique visitors (by IP address)
  const uniqueIPs = new Set(viewers.map(v => v.ipAddress).filter(Boolean));
  const uniqueVisitors = uniqueIPs.size;
  
  // Views by device
  const viewsByDevice = viewers.reduce(
    (acc, viewer) => {
      const device = (viewer.device || 'desktop') as keyof ViewerAnalytics['viewsByDevice'];
      acc[device] += 1;
      return acc;
    },
    { mobile: 0, tablet: 0, desktop: 0 }
  );
  
  // Views by day
  const viewsByDay = viewers.reduce((acc, viewer) => {
    const date = viewer.viewedAt.toISOString().split('T')[0];
    const existing = acc.find(item => item.date === date);
    
    if (existing) {
      existing.count++;
    } else {
      acc.push({ date, count: 1 });
    }
    
    return acc;
  }, [] as Array<{ date: string; count: number }>);
  
  // Sort by date
  viewsByDay.sort((a, b) => a.date.localeCompare(b.date));
  
  // Top countries
  const countryCounts = viewers.reduce((acc, viewer) => {
    if (viewer.country) {
      acc[viewer.country] = (acc[viewer.country] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const topCountries = Object.entries(countryCounts)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Top cities
  const cityCounts = viewers.reduce((acc, viewer) => {
    if (viewer.city) {
      acc[viewer.city] = (acc[viewer.city] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const topCities = Object.entries(cityCounts)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Recent views (last 10)
  const recentViews = viewers.slice(0, 10);
  
  return {
    totalViews,
    uniqueVisitors,
    viewsByDevice,
    viewsByDay,
    topCountries,
    topCities,
    recentViews,
  };
}

/**
 * Get real-time visitor count (last 5 minutes)
 */
export async function getRealtimeVisitorCount(invitationId: string): Promise<number> {
  const fiveMinutesAgo = new Date();
  fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
  
  const count = await prisma.viewer.count({
    where: {
      invitationId,
      viewedAt: {
        gte: fiveMinutesAgo,
      },
    },
  });
  
  return count;
}

/**
 * Get peak viewing time
 */
export async function getPeakViewingTime(invitationId: string): Promise<{
  hour: number;
  count: number;
}> {
  const viewers = await prisma.viewer.findMany({
    where: { invitationId },
  });
  
  const hourCounts = viewers.reduce((acc, viewer) => {
    const hour = viewer.viewedAt.getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  const peakHour = Object.entries(hourCounts)
    .map(([hour, count]) => ({ hour: Number(hour), count }))
    .sort((a, b) => b.count - a.count)[0];
  
  return peakHour || { hour: 0, count: 0 };
}

/**
 * Generate session ID untuk tracking
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Clean old viewer data (older than 90 days)
 */
export async function cleanOldViewerData(): Promise<number> {
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  
  const result = await prisma.viewer.deleteMany({
    where: {
      viewedAt: {
        lt: ninetyDaysAgo,
      },
    },
  });
  
  return result.count;
}
