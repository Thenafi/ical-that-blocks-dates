# iCal Date Blocker Worker

A Cloudflare Worker that generates an iCal feed with configurable blocking events. It generates all-day events starting from the day before today up to a specified number of days in the future.

## Usage

Access the worker URL with optional query parameters:

`https://your-worker.subdomain.workers.dev/?days=45&name=Special+Ical+Block`

### Query Parameters

| Parameter | Default | Description |
| :--- | :--- | :--- |
| `days` | `45` | Number of days ahead of today to include in the calendar. |
| `name` | `Special Ical Block` | The summary/title for each calendar event. |
| `single` | `false` | If `true`, creates one continuous block instead of daily events. |

### Multiple Events (Advanced)

You can specify multiple configured events using the `events` query parameter with a JSON encoded string.

`https://your-worker.subdomain.workers.dev/?events=[{"name":"Blocked","days":10},{"name":"LongEvent","days":5,"single":true}]`

The `events` parameter expects a JSON array of objects, where each object can have:
- `name`: (String) Event title
- `days`: (Number) Duration in days
- `single`: (Boolean) continuous vs daily blocks

## Development

### Prerequisites

- Node.js and npm
- Cloudflare account and Wrangler CLI authenticated

### Local Development

Run the following command to start a local development server:

```bash
npm start
# or
npx wrangler dev
```

The worker will be available at `http://127.0.0.1:8787`.

### Testing

You can test the worker locally using `curl`:

```bash
curl "http://127.0.0.1:8787/?days=10&name=Blocked"
```

## Deployment

To deploy the worker to Cloudflare, run:

```bash
npm run deploy
# or
npx wrangler deploy
```

## How it Works

The worker calculates a date range starting from yesterday (`T-1`) to `T + days`. It then iterates through each date and generates a `VEVENT` entry in iCal format. Events are set as all-day events (`VALUE=DATE`) and marked as `OPAQUE` to indicate they block time.
