// Build HTML using string concat to avoid template-literal nesting issues
function buildUI(baseOrigin) {
  const ui = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>iCal Blocker – URL Generator</title>\n  <meta name=\"description\" content=\"Generate iCal feed URLs to block dates on your short-term rental calendar.\" />\n  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />\n  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />\n  <link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap\" rel=\"stylesheet\" />\n  <style>\n    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }\n    :root {\n      --bg: #0d1117; --surface: #161b22; --surface-2: #21262d;\n      --border: #30363d; --border-focus: #58a6ff;\n      --text: #e6edf3; --text-muted: #8b949e;\n      --accent: #58a6ff; --accent-glow: rgba(88,166,255,.15); --accent-2: #79c0ff;\n      --success: #3fb950; --danger: #f85149;\n      --radius: 10px; --radius-sm: 6px;\n      --transition: .2s cubic-bezier(.4,0,.2,1);\n    }\n    html { scroll-behavior: smooth; }\n    body { font-family:\"Inter\",system-ui,sans-serif; background:var(--bg); color:var(--text);\n           min-height:100vh; display:flex; flex-direction:column; align-items:center;\n           padding:40px 16px 80px; }\n    header { text-align:center; margin-bottom:40px; animation:fadeDown .5s ease both; }\n    .logo { display:inline-flex; align-items:center; gap:10px; margin-bottom:12px; }\n    .logo-icon { width:40px; height:40px; background:linear-gradient(135deg,#1f6feb,#58a6ff);\n      border-radius:10px; display:flex; align-items:center; justify-content:center;\n      font-size:20px; box-shadow:0 0 20px rgba(88,166,255,.3); }\n    h1 { font-size:clamp(1.5rem,4vw,2.2rem); font-weight:700;\n         background:linear-gradient(135deg,#e6edf3 30%,#58a6ff);\n         -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }\n    .subtitle { color:var(--text-muted); font-size:.9rem; margin-top:6px; }\n    .card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius);\n            padding:28px; width:100%; max-width:680px; animation:fadeUp .5s ease both; }\n    .card+.card { margin-top:16px; animation-delay:.05s; }\n    .card-title { font-size:.78rem; font-weight:600; text-transform:uppercase;\n                  letter-spacing:.08em; color:var(--text-muted); margin-bottom:20px; }\n    .mode-toggle { display:flex; background:var(--surface-2); border:1px solid var(--border);\n                   border-radius:var(--radius-sm); padding:4px; gap:4px; margin-bottom:24px; flex-wrap:wrap; }\n    .mode-btn { flex:1; padding:8px 12px; border:none; border-radius:5px;\n                background:transparent; color:var(--text-muted); font-family:inherit;\n                font-size:.85rem; font-weight:500; cursor:pointer; transition:all var(--transition); white-space:nowrap; }\n    .mode-btn.active { background:var(--accent); color:#000; box-shadow:0 2px 8px rgba(88,166,255,.4); }\n    .field { margin-bottom:18px; }\n    .row { display:flex; gap:16px; margin-bottom:18px; flex-wrap:wrap; }\n    .row .field { flex:1; margin-bottom:0; min-width:140px; }\n    label { display:block; font-size:.82rem; font-weight:500; color:var(--text-muted); margin-bottom:7px; }\n    label span { color:var(--text); }\n    input[type=\"text\"],input[type=\"number\"],input[type=\"date\"],input[type=\"time\"],select {\n      width:100%; padding:10px 14px; background:var(--surface-2);\n      border:1px solid var(--border); border-radius:var(--radius-sm);\n      color:var(--text); font-family:inherit; font-size:.9rem; outline:none;\n      transition:border-color var(--transition),box-shadow var(--transition); }\n    input:focus,select:focus { border-color:var(--border-focus); box-shadow:0 0 0 3px var(--accent-glow); }\n    input::placeholder { color:var(--text-muted); }\n    input[type=\"date\"]::-webkit-calendar-picker-indicator, input[type=\"time\"]::-webkit-calendar-picker-indicator { filter: invert(1); cursor:pointer; }\n    .toggle-row { display:flex; align-items:center; justify-content:space-between;\n                  padding:12px 14px; background:var(--surface-2);\n                  border:1px solid var(--border); border-radius:var(--radius-sm); }\n    .toggle-label { font-size:.88rem; }\n    .toggle-desc { font-size:.75rem; color:var(--text-muted); margin-top:2px; }\n    .switch { position:relative; width:40px; height:22px; flex-shrink:0; }\n    .switch input { opacity:0; width:0; height:0; }\n    .slider { position:absolute; inset:0; background:var(--border); border-radius:22px;\n              cursor:pointer; transition:background var(--transition); }\n    .slider::before { content:\"\"; position:absolute; width:16px; height:16px;\n                      left:3px; top:3px; background:#fff; border-radius:50%;\n                      transition:transform var(--transition); }\n    input:checked+.slider { background:var(--accent); }\n    input:checked+.slider::before { transform:translateX(18px); }\n    #multi-section, #exact-section { display:none; }\n    #multi-section.visible, #exact-section.visible { display:block; }\n    .event-list { display:flex; flex-direction:column; gap:10px; margin-bottom:14px; }\n    .event-row { display:grid; grid-template-columns:1fr 90px 110px 36px; gap:8px;\n                 align-items:center; padding:12px; background:var(--surface-2);\n                 border:1px solid var(--border); border-radius:var(--radius-sm);\n                 animation:fadeUp .2s ease both; }\n    .remove-btn { width:36px; height:36px; border:1px solid var(--border);\n                  background:transparent; color:var(--danger); border-radius:var(--radius-sm);\n                  cursor:pointer; font-size:16px; display:flex; align-items:center;\n                  justify-content:center; transition:background var(--transition); }\n    .remove-btn:hover { background:rgba(248,81,73,.12); }\n    .add-btn { width:100%; padding:9px; background:transparent;\n               border:1px dashed var(--border); border-radius:var(--radius-sm);\n               color:var(--accent); font-family:inherit; font-size:.85rem;\n               cursor:pointer; transition:all var(--transition); }\n    .add-btn:hover { border-color:var(--accent); background:var(--accent-glow); }\n    .url-box { display:flex; align-items:center; gap:10px; margin-bottom:14px; }\n    .url-display { flex:1; padding:11px 14px; background:var(--surface-2);\n                   border:1px solid var(--border); border-radius:var(--radius-sm);\n                   font-family:\"SFMono-Regular\",\"Fira Code\",monospace; font-size:.78rem;\n                   color:var(--accent-2); overflow:hidden; text-overflow:ellipsis;\n                   white-space:nowrap; min-width:0; }\n    .copy-btn { padding:10px 16px; background:linear-gradient(135deg,#1f6feb,#58a6ff);\n                border:none; border-radius:var(--radius-sm); color:#000;\n                font-family:inherit; font-size:.85rem; font-weight:600; cursor:pointer;\n                white-space:nowrap; transition:all var(--transition); flex-shrink:0; }\n    .copy-btn:hover { transform:translateY(-1px); box-shadow:0 4px 14px rgba(88,166,255,.4); }\n    .copy-btn:active { transform:translateY(0); }\n    .copy-btn.copied { background:linear-gradient(135deg,#1a7f37,#3fb950); color:#fff; }\n    .open-link { display:inline-flex; align-items:center; gap:6px; margin-top:12px;\n                 font-size:.8rem; color:var(--text-muted); text-decoration:none;\n                 transition:color var(--transition); }\n    .open-link:hover { color:var(--accent); }\n    .checkbox-row { display:flex; align-items:center; gap:8px; font-size:.85rem; color:var(--text-muted); }\n    .checkbox-row input[type=\"checkbox\"] { width:16px; height:16px; cursor:pointer; accent-color:var(--accent); }\n    @keyframes fadeDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }\n    @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)}  to{opacity:1;transform:translateY(0)} }\n    @media(max-width:500px) {\n      .event-row { grid-template-columns:1fr 70px 90px 32px; gap:6px; }\n      .card { padding:18px; }\n      .mode-toggle { flex-direction:column; }\n    }\n  </style>\n</head>\n<body>\n<header>\n  <div class=\"logo\"><div class=\"logo-icon\">📅</div><h1>iCal Blocker</h1></div>\n  <p class=\"subtitle\">Generate iCal feed URLs to block dates on your rental calendar</p>\n</header>\n<div class=\"card\">\n  <div class=\"card-title\">Configuration Mode</div>\n  <div class=\"mode-toggle\">\n    <button class=\"mode-btn active\" id=\"btn-simple\" onclick=\"setMode('simple')\">Days Ahead</button>\n    <button class=\"mode-btn\" id=\"btn-exact\" onclick=\"setMode('exact')\">Exact Dates & Times</button>\n    <button class=\"mode-btn\" id=\"btn-multi\" onclick=\"setMode('multi')\">Multiple Events</button>\n  </div>\n  \n  <div id=\"simple-section\">\n    <div class=\"field\">\n      <label for=\"s-name\"><span>Event Name</span></label>\n      <input type=\"text\" id=\"s-name\" placeholder=\"Special Ical Block\" oninput=\"updateUrl()\" />\n    </div>\n    <div class=\"field\">\n      <label for=\"s-days\"><span>Days Ahead</span> — how many days into the future to block</label>\n      <input type=\"number\" id=\"s-days\" min=\"1\" max=\"3650\" placeholder=\"45\" oninput=\"updateUrl()\" />\n    </div>\n    <div class=\"field\">\n      <div class=\"toggle-row\">\n        <div><div class=\"toggle-label\">Single continuous event</div>\n             <div class=\"toggle-desc\">One block instead of daily events</div></div>\n        <label class=\"switch\">\n          <input type=\"checkbox\" id=\"s-single\" onchange=\"updateUrl()\" />\n          <span class=\"slider\"></span>\n        </label>\n      </div>\n    </div>\n  </div>\n\n  <div id=\"exact-section\">\n    <div class=\"field\">\n      <label for=\"e-name\"><span>Event Name</span></label>\n      <input type=\"text\" id=\"e-name\" placeholder=\"Blocked Dates\" oninput=\"updateUrl()\" />\n    </div>\n    <div class=\"row\">\n      <div class=\"field\">\n        <label for=\"e-start-date\"><span>Start Date</span></label>\n        <input type=\"date\" id=\"e-start-date\" onchange=\"updateUrl()\" />\n      </div>\n      <div class=\"field\">\n        <label for=\"e-start-time\"><span>Start Time</span></label>\n        <input type=\"time\" id=\"e-start-time\" onchange=\"updateUrl()\" />\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"field\">\n        <label for=\"e-end-date\"><span>End Date</span></label>\n        <input type=\"date\" id=\"e-end-date\" onchange=\"updateUrl()\" />\n      </div>\n      <div class=\"field\">\n        <label for=\"e-end-time\"><span>End Time</span></label>\n        <input type=\"time\" id=\"e-end-time\" onchange=\"updateUrl()\" />\n      </div>\n    </div>\n  </div>\n\n  <div id=\"multi-section\">\n    <div class=\"event-list\" id=\"event-list\"></div>\n    <button class=\"add-btn\" onclick=\"addEvent()\">+ Add Event</button>\n  </div>\n</div>\n\n<div class=\"card\" id=\"output-card\">\n  <div class=\"card-title\">Generated URL</div>\n  <div class=\"url-box\">\n    <div class=\"url-display\" id=\"url-display\">—</div>\n    <button class=\"copy-btn\" id=\"copy-btn\" onclick=\"copyUrl()\">Copy URL</button>\n  </div>\n  <div class=\"checkbox-row\" style=\"margin-bottom: 12px;\">\n    <input type=\"checkbox\" id=\"bypass-cache\" onchange=\"updateUrl()\" />\n    <label for=\"bypass-cache\" style=\"margin:0; font-weight:normal;\">Make URL unique to bypass caching</label>\n  </div>\n  <a id=\"open-link\" class=\"open-link\" href=\"#\" target=\"_blank\" rel=\"noopener\">↗ Open iCal feed in new tab</a>\n</div>\n\n<script>\n  var BASE = location.origin;\n  var mode = \"simple\";\n  var events = [];\n\n  function setMode(m) {\n    mode = m;\n    document.getElementById(\"simple-section\").style.display = m === \"simple\" ? \"block\" : \"none\";\n    document.getElementById(\"exact-section\").style.display = m === \"exact\" ? \"block\" : \"none\";\n    document.getElementById(\"multi-section\").classList.toggle(\"visible\", m === \"multi\");\n    \n    document.getElementById(\"btn-simple\").classList.toggle(\"active\", m === \"simple\");\n    document.getElementById(\"btn-exact\").classList.toggle(\"active\", m === \"exact\");\n    document.getElementById(\"btn-multi\").classList.toggle(\"active\", m === \"multi\");\n    \n    if (m === \"multi\" && events.length === 0) addEvent();\n    \n    // Auto-fill dates if empty in exact mode\n    if (m === \"exact\") {\n      var sDate = document.getElementById(\"e-start-date\");\n      var eDate = document.getElementById(\"e-end-date\");\n      if (!sDate.value) {\n        var d = new Date();\n        sDate.value = d.toISOString().split(\"T\")[0];\n        d.setDate(d.getDate() + 2);\n        eDate.value = d.toISOString().split(\"T\")[0];\n      }\n    }\n    \n    updateUrl();\n  }\n\n  function addEvent() {\n    events.push({ name: \"\", days: \"45\", single: false });\n    renderEvents();\n    updateUrl();\n  }\n\n  function removeEvent(i) {\n    events.splice(i, 1);\n    renderEvents();\n    updateUrl();\n  }\n\n  function escHtml(s) {\n    return String(s).replace(/&/g,\"&amp;\").replace(/\"/g,\"&quot;\").replace(/</g,\"&lt;\").replace(/>/g,\"&gt;\");\n  }\n\n  function renderEvents() {\n    var list = document.getElementById(\"event-list\");\n    list.innerHTML = \"\";\n    events.forEach(function(ev, i) {\n      var row = document.createElement(\"div\");\n      row.className = \"event-row\";\n      row.innerHTML =\n        '<input type=\"text\" placeholder=\"Event name\" value=\"' + escHtml(ev.name) + '\"' +\n        ' oninput=\"events[' + i + '].name=this.value;updateUrl()\" />' +\n        '<input type=\"number\" min=\"1\" max=\"3650\" placeholder=\"45\" value=\"' + escHtml(ev.days) + '\"' +\n        ' oninput=\"events[' + i + '].days=this.value;updateUrl()\" />' +\n        '<select onchange=\"events[' + i + '].single=this.value==='+\"'true'\"+';updateUrl()\">' +\n        '<option value=\"false\"' + (!ev.single ? \" selected\" : \"\") + '>Daily events</option>' +\n        '<option value=\"true\"' + (ev.single  ? \" selected\" : \"\") + '>Single block</option>' +\n        '</select>' +\n        '<button class=\"remove-btn\" onclick=\"removeEvent(' + i + ')\" title=\"Remove\">&times;</button>';\n      list.appendChild(row);\n    });\n  }\n\n  function updateUrl() {\n    var url;\n    var params = new URLSearchParams();\n    \n    if (mode === \"simple\") {\n      var name   = document.getElementById(\"s-name\").value.trim();\n      var days   = document.getElementById(\"s-days\").value.trim();\n      var single = document.getElementById(\"s-single\").checked;\n      if (name)   params.set(\"name\", name);\n      if (days)   params.set(\"days\", days);\n      if (single) params.set(\"single\", \"true\");\n    } else if (mode === \"exact\") {\n      var ename  = document.getElementById(\"e-name\").value.trim();\n      var sDate  = document.getElementById(\"e-start-date\").value;\n      var sTime  = document.getElementById(\"e-start-time\").value;\n      var eDate  = document.getElementById(\"e-end-date\").value;\n      var eTime  = document.getElementById(\"e-end-time\").value;\n      \n      if (ename) params.set(\"name\", ename);\n      if (sDate) params.set(\"start\", sDate);\n      if (sTime) params.set(\"startTime\", sTime);\n      if (eDate) params.set(\"end\", eDate);\n      if (eTime) params.set(\"endTime\", eTime);\n    } else {\n      var payload = events.map(function(ev) {\n        var obj = {};\n        if (ev.name) obj.name = ev.name;\n        if (ev.days) obj.days = parseInt(ev.days, 10);\n        if (ev.single) obj.single = true;\n        return obj;\n      });\n      params.set(\"events\", JSON.stringify(payload));\n    }\n    \n    if (document.getElementById(\"bypass-cache\").checked) {\n      params.set(\"uid\", Math.random().toString(36).substring(2, 10) + Date.now().toString(36));\n    }\n    \n    var qs = params.toString();\n    url = BASE + \"/ical\" + (qs ? \"?\" + qs : \"\");\n    \n    var disp = document.getElementById(\"url-display\");\n    disp.textContent = url;\n    disp.title = url;\n    var link = document.getElementById(\"open-link\");\n    link.href = url;\n  }\n\n  async function copyUrl() {\n    var url = document.getElementById(\"url-display\").textContent;\n    if (url === \"—\") return;\n    try { await navigator.clipboard.writeText(url); } catch(e) {\n      var ta = document.createElement(\"textarea\");\n      ta.value = url; document.body.appendChild(ta); ta.select();\n      document.execCommand(\"copy\"); document.body.removeChild(ta);\n    }\n    var btn = document.getElementById(\"copy-btn\");\n    btn.textContent = \"✓ Copied!\"; btn.classList.add(\"copied\");\n    setTimeout(function() { btn.textContent = \"Copy URL\"; btn.classList.remove(\"copied\"); }, 2000);\n  }\n\n  updateUrl();\n</script>\n</body>\n</html>";
  return ui.replace('var BASE = location.origin;', 'var BASE = ' + JSON.stringify(baseOrigin) + ';');
}

// ── iCal helpers ────────────────────────────────────────────────────────────
function formatDate(date) {
  const year  = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day   = String(date.getUTCDate()).padStart(2, '0');
  return year + month + day;
}

function generateIcal(params) {
  const now       = new Date();
  const todayUtc  = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const yesterdayUtc = new Date(todayUtc);
  yesterdayUtc.setUTCDate(yesterdayUtc.getUTCDate() - 1);

  let configurations = [];
  const eventsParam = params.get('events');

  if (eventsParam) {
    try {
      configurations = JSON.parse(eventsParam);
      if (!Array.isArray(configurations)) return { error: 'Invalid "events" parameter. Must be a JSON array.' };
    } catch (e) {
      return { error: 'Invalid "events" parameter. Must be valid JSON.' };
    }
  } else {
    configurations.push({
      days:      params.get('days'),
      name:      params.get('name'),
      single:    params.get('single') === 'true',
      start:     params.get('start'),
      startTime: params.get('startTime'),
      end:       params.get('end'),
      endTime:   params.get('endTime')
    });
  }

  const allEvents = [];

  for (const config of configurations) {
    const eventName = config.name || 'Special Ical Block';
    
    // EXACT DATES MODE
    if (config.start && config.end) {
      const sDate = config.start.replace(/-/g, '');
      const sTime = (config.startTime || '00:00').replace(/:/g, '') + '00';
      const eDate = config.end.replace(/-/g, '');
      const eTime = (config.endTime || '00:00').replace(/:/g, '') + '00';
      
      const dtStart = sDate + 'T' + sTime;
      const dtEnd = eDate + 'T' + eTime;
      const uid = dtStart + '-' + dtEnd + '-' + Math.random().toString(36).substring(2, 9) + '@ical-blocker.local';
      
      allEvents.push([
        'BEGIN:VEVENT',
        'UID:' + uid,
        'DTSTAMP:' + formatDate(new Date()) + 'T000000Z',
        'DTSTART:' + dtStart,
        'DTEND:' + dtEnd,
        'SUMMARY:' + eventName,
        'STATUS:CONFIRMED',
        'TRANSP:OPAQUE',
        'END:VEVENT'
      ].join('\r\n'));
      continue;
    }

    // DAYS AHEAD MODE
    let daysAhead = parseInt(config.days || '45', 10);
    const isSingle  = config.single === true || config.single === 'true';

    if (isNaN(daysAhead) || daysAhead < 0 || daysAhead > 3650) daysAhead = 45;

    if (isSingle) {
      const startDate = new Date(yesterdayUtc);
      const endDate   = new Date(startDate);
      endDate.setUTCDate(endDate.getUTCDate() + daysAhead + 1);
      const uid = formatDate(startDate) + '-' + formatDate(endDate) + '-' +
                  Math.random().toString(36).substring(2, 9) + '@ical-blocker.local';
      allEvents.push([
        'BEGIN:VEVENT',
        'UID:' + uid,
        'DTSTAMP:' + formatDate(new Date()) + 'T000000Z',
        'DTSTART;VALUE=DATE:' + formatDate(startDate),
        'DTEND;VALUE=DATE:' + formatDate(endDate),
        'SUMMARY:' + eventName,
        'STATUS:CONFIRMED',
        'TRANSP:OPAQUE',
        'END:VEVENT'
      ].join('\r\n'));
    } else {
      for (let i = -1; i < daysAhead; i++) {
        const currentDate = new Date(todayUtc);
        currentDate.setUTCDate(currentDate.getUTCDate() + i);
        const dateStr  = formatDate(currentDate);
        const nextDate = new Date(currentDate);
        nextDate.setUTCDate(nextDate.getUTCDate() + 1);
        const nextDateStr = formatDate(nextDate);
        const uid = dateStr + '-' + Math.random().toString(36).substring(2, 9) + '@ical-blocker.local';
        allEvents.push([
          'BEGIN:VEVENT',
          'UID:' + uid,
          'DTSTAMP:' + formatDate(new Date()) + 'T000000Z',
          'DTSTART;VALUE=DATE:' + dateStr,
          'DTEND;VALUE=DATE:' + nextDateStr,
          'SUMMARY:' + eventName,
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

  return { icalContent };
}

// ── Worker entry point ──────────────────────────────────────────────────────
export default {
  async fetch(request, env, ctx) {
    const url    = new URL(request.url);
    const params = url.searchParams;
    const path   = url.pathname.replace(/\/+$/, '') || '/';

    // Serve UI at / or /ui
    if (path === '/' || path === '/ui') {
      const origin = url.origin;
      return new Response(buildUI(origin), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // Generate iCal at /ical
    if (path === '/ical') {
      const result = generateIcal(params);
      if (result.error) return new Response(result.error, { status: 400 });
      return new Response(result.icalContent, {
        headers: {
          'Content-Type':        'text/calendar; charset=utf-8',
          'Content-Disposition': 'attachment; filename="calendar.ics"',
          'Cache-Control':       'no-cache, no-store, must-revalidate'
        },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};
