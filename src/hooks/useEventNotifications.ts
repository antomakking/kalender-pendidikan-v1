import { useEffect, useState, useCallback } from 'react';
import { AcademicEvent } from '../types.ts';
import { formatIndonesianDate, getDaysDifference } from '../utils/calendarUtils.ts';

export type NotificationPermissionStatus = 'default' | 'granted' | 'denied' | 'unsupported';

interface UseEventNotificationsOptions {
  events: AcademicEvent[];
  todayStr: string;
  onSelectEvent?: (event: AcademicEvent) => void;
}

export function useEventNotifications({
  events,
  todayStr,
  onSelectEvent,
}: UseEventNotificationsOptions) {
  const [permission, setPermission] = useState<NotificationPermissionStatus>(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    return window.Notification.permission as NotificationPermissionStatus;
  });

  const [notifiedIds, setNotifiedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(`smk_it_notified_${todayStr}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Calculate events starting exactly 1 day from todayStr (Besok)
  const tomorrowEvents = events.filter((event) => {
    const diff = getDaysDifference(event.startDate, todayStr);
    return diff === 1;
  });

  // Request browser notification permission
  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPermission('unsupported');
      return 'unsupported';
    }

    try {
      const result = await window.Notification.requestPermission();
      setPermission(result as NotificationPermissionStatus);
      return result as NotificationPermissionStatus;
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      return 'denied';
    }
  }, []);

  // Trigger a browser notification for a specific event
  const triggerNotification = useCallback(
    (event: AcademicEvent) => {
      if (typeof window === 'undefined' || !('Notification' in window)) return;
      if (window.Notification.permission !== 'granted') return;

      const title = `🔔 Besok: ${event.title}`;
      const body = `Agenda dimulai besok (${formatIndonesianDate(event.startDate, { withDayName: true })}). Target: ${event.audience}. Lokasi: ${event.location || 'SMK IT Ibnul Qayyim'}.`;

      try {
        const notification = new window.Notification(title, {
          body,
          icon: './icon.svg',
          badge: './icon.svg',
          tag: `event-h1-${event.id}`,
          requireInteraction: false,
        });

        notification.onclick = () => {
          window.focus();
          if (onSelectEvent) {
            onSelectEvent(event);
          }
          notification.close();
        };
      } catch (e) {
        console.error('Failed to dispatch notification:', e);
      }
    },
    [onSelectEvent]
  );

  // Send a test browser notification immediately
  const sendTestNotification = useCallback(async () => {
    let currentPerm = permission;
    if (currentPerm !== 'granted') {
      currentPerm = await requestPermission();
    }

    if (currentPerm === 'granted') {
      const sampleEvent = tomorrowEvents[0] || {
        id: 'test-event',
        title: 'Ujian / Agenda Contoh H-1',
        startDate: todayStr,
        endDate: todayStr,
        category: 'academic',
        description: 'Uji coba sistem pengingat notifikasi browser H-1.',
        location: 'SMK IT Ibnul Qayyim Makassar',
        audience: 'Seluruh Siswa',
        academicYear: '2026/2027',
        semester: 'ganjil',
      };

      triggerNotification(sampleEvent as AcademicEvent);
      return true;
    }
    return false;
  }, [permission, requestPermission, tomorrowEvents, todayStr, triggerNotification]);

  // Check and send H-1 notifications for events starting tomorrow
  useEffect(() => {
    if (permission !== 'granted') return;
    if (tomorrowEvents.length === 0) return;

    const newNotified: string[] = [...notifiedIds];
    let updated = false;

    tomorrowEvents.forEach((event) => {
      if (!newNotified.includes(event.id)) {
        triggerNotification(event);
        newNotified.push(event.id);
        updated = true;
      }
    });

    if (updated) {
      setNotifiedIds(newNotified);
      try {
        localStorage.setItem(`smk_it_notified_${todayStr}`, JSON.stringify(newNotified));
      } catch (e) {
        console.error('Failed to save notified event ids:', e);
      }
    }
  }, [permission, tomorrowEvents, todayStr, notifiedIds, triggerNotification]);

  return {
    permission,
    requestPermission,
    tomorrowEvents,
    sendTestNotification,
    triggerNotification,
  };
}
