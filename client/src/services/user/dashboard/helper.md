### User Dashboard API Response Structure

```jsonc
{
  "summary": {
    "critical": number,
    "active": number,
    "rejected": number,
    "resolved": number
  },
  "recents": [
    // Array of issues reported by user within the last 5 days
    {
      "title": string,
      "description": string,
      "date": string, // ISO date format, e.g. "2025-12-25"
      "status": "active" | "resolved" | "critical" | "rejected"
    }
    // ...
  ],
  "chartData": [
    // Array of daily issue counts (for the last 7 days or desired period)
    {
      "date": string, // e.g. "2025-12-25"
      "active": number,
      "resolved": number,
      "critical": number,
      "rejected": number
    }
    // ...
  ]
}
```

### Issue collection structure
```jsonc
{
    "title":string,
    "description":string,
    "date":string,
    "status":"active"|"resolved"|"critical"|"rejected",
    "useremail or id":string,
    "images":Array<string>,
    "location":location of issue in campus auto fetched
}
```
**Fields explanation:**

- **summary**: Object with counts for each issue status.
- **recents**: Array of user's most recently reported issues (last 5 days), with title, description, date, and status.
- **chartData**: Array of daily issue status counts for each date in the timeframe.
