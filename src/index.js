export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const params = url.searchParams;

    // Helper to format date as YYYYMMDD
    const formatDate = (date) => {
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    };

    const allEvents = [];
    const now = new Date();
    // Normalize "now" to UTC midnight for consistent calculations
    const todayUtc = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    // Base start date is "Yesterday" relative to UTC today
    const yesterdayUtc = new Date(todayUtc);
    yesterdayUtc.setUTCDate(yesterdayUtc.getUTCDate() - 1);

    // Determine configurations to process
    let configurations = [];

    const eventsParam = params.get('events');
    if (eventsParam) {
      try {
        configurations = JSON.parse(eventsParam);
        if (!Array.isArray(configurations)) {
          return new Response('Invalid "events" parameter. Must be a JSON array.', { status: 400 });
        }
      } catch (e) {
        return new Response('Invalid "events" parameter. Must be valid JSON.', { status: 400 });
      }
    } else {
      // Fallback to single config from query params
      configurations.push({
        days: params.get('days'),
        name: params.get('name'),
        single: params.get('single') === 'true'
      });
    }

    // Process each configuration
    for (const config of configurations) {
      let daysAhead = parseInt(config.days || '45', 10);
      const eventName = config.name || 'Special Ical Block';
      const isSingle = config.single === true || config.single === 'true';

      // Validate days
      if (isNaN(daysAhead) || daysAhead < 0 || daysAhead > 3650) {
        // Skip invalid entries or fail? Let's just default to 45 if invalid in a list, 
        // but for backward compat with single param we validated strictly. 
        // Let's be lenient for the list and strict if it's the only param? 
        // For simplicity, let's just clamp or default if invalid.
        daysAhead = 45; 
      }

      if (isSingle) {
        // Feature: Single Continuous Event
        // Start: Yesterday
        // End: Yesterday + daysAhead + 1 (to include the last day)
        // Example: Yesterday is 11th. Days=2. We want to block 11th, 12th, 13th?
        // Original logic: "from i=-1 to i < daysAhead". 
        // i=-1 (yesterday), i=0 (today), i=1 (tomorrow). Total 3 days for Days=2?
        // Wait, "45 dates AHEAD" usually excludes today? Or includes?
        // User said "from the day before today to 45 dates ahead".
        // If today is 12th. Yesterday is 11th. 
        // 45 days ahead usually means Today + 45 days.
        // Let's stick to the previous loop logic which was: i from -1 to < daysAhead.
        // i=-1 (Yesterday). i=daysAhead-1 (Last day).
        // Total days covered = (daysAhead - 1) - (-1) + 1 = daysAhead + 1 days.
        
        // Start Date: Yesterday
        const startDate = new Date(yesterdayUtc);
        
        // End Date: StartDate + exact number of days covered
        // Days covered in loop was: i=-1, 0, 1 ... daysAhead-1. Count is daysAhead + 1.
        const totalDurationDays = daysAhead + 1;
        
        const endDate = new Date(startDate);
        endDate.setUTCDate(endDate.getUTCDate() + totalDurationDays);

        const uid = `${formatDate(startDate)}-${formatDate(endDate)}-${Math.random().toString(36).substring(2, 9)}@ical-blocker.local`;
        
        allEvents.push([
            'BEGIN:VEVENT',
            `UID:${uid}`,
            `DTSTAMP:${formatDate(new Date())}T000000Z`,
            `DTSTART;VALUE=DATE:${formatDate(startDate)}`,
            `DTEND;VALUE=DATE:${formatDate(endDate)}`, // DTEND is exclusive for all-day events
            `SUMMARY:${eventName}`,
            'STATUS:CONFIRMED',
            'TRANSP:OPAQUE',
            'END:VEVENT'
        ].join('\r\n'));

      } else {
        // Feature: Daily Events (Original Loop)
        for (let i = -1; i < daysAhead; i++) {
            const currentDate = new Date(todayUtc);
            currentDate.setUTCDate(currentDate.getUTCDate() + i);
            
            const dateStr = formatDate(currentDate);
            
            // Next day for DTEND
            const nextDate = new Date(currentDate);
            nextDate.setUTCDate(nextDate.getUTCDate() + 1);
            const nextDateStr = formatDate(nextDate);

            const uid = `${dateStr}-${Math.random().toString(36).substring(2, 9)}@ical-blocker.local`;

            allEvents.push([
                'BEGIN:VEVENT',
                `UID:${uid}`,
                `DTSTAMP:${formatDate(new Date())}T000000Z`,
                `DTSTART;VALUE=DATE:${dateStr}`,
                `DTEND;VALUE=DATE:${nextDateStr}`, // Exclusive end
                `SUMMARY:${eventName}`,
                'STATUS:CONFIRMED',
                'TRANSP:OPAQUE',
                'END:VEVENT'
            ].join('\r\n'));
        }
      }
    }

    const icalContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//CastleHost//ICal Blocker//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        ...allEvents,
        'END:VCALENDAR'
    ].join('\r\n');

    return new Response(icalContent, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="calendar.ics"',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
    });
  },
};
