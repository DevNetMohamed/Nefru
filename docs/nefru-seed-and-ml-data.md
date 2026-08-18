# Nefru Scenario Seed and ML Data

## What this seed creates

- 1 admin
- 5 tour-guide users and 5 guide profiles
  - approved + active guides
  - pending guide
  - inactive guide
- 15 tourists
  - 13 tourists with one or more bookings
  - 2 cold-start tourists with no bookings
  - 1 inactive tourist for access-control tests
- 10 tours
  - 6 active
  - 2 reviewing
  - 2 draft
- 25 bookings distributed across 13 tourists
  - pending payment
  - confirmed
  - completed
  - cancelled
  - refunded
  - no-show
- 8 verified reviews with ratings from 2 to 5
- booking, payment, review, tour, reminder, and admin notifications
- about 670 deterministic interaction events for recommendation experiments
  - impression
  - view
  - search
  - save
  - map opened
  - booking started/completed/cancelled
  - review submitted

## Files added or changed

- `backend/src/models/booking.model.js`
- `backend/src/models/notification.model.js`
- `backend/src/models/review.model.js`
- `backend/src/models/interaction.model.js`
- `backend/src/scripts/seed.js`
- `backend/src/scripts/export-ml-dataset.js`
- `backend/package.json`

## Run the scenario seed

```bash
cd backend
npm install
npm run seed:scenarios
```

The first seeded guide and tourist use the credentials from `.env`:

```env
EMAIL_GUIDE=guide@example.com
PASSWORD_GUIDE=Guide123456

EMAIL_TOURIST=tourist@example.com
PASSWORD_TOURIST=Tourist123456
```

Other seed accounts end with `@nefru-seed.test` and use the corresponding guide or tourist password.

## Export anonymized ML files

```bash
npm run export:ml
```

Output:

```text
backend/exports/nefru-ml/
├── users.csv
├── tours.csv
├── bookings.csv
├── reviews.csv
├── interactions.csv
└── dataset-summary.json
```

Set a private salt before exporting real production data:

```env
ML_EXPORT_SALT=use-a-long-private-random-value
```

The export deliberately excludes names, emails, phone numbers, exact birth dates, and notification messages.

## Scenario checklist

### Authentication and administration

- approved active guide
- pending guide
- inactive approved guide
- active tourist
- inactive tourist
- admin review queue

### Trip lifecycle

- active public tours
- reviewing tours
- incomplete drafts
- tours with past and upcoming dates
- tours without schedules
- tours belonging to an inactive guide

### Booking lifecycle

- payment pending
- confirmed upcoming booking
- completed booking
- tourist cancellation
- system refund
- no-show
- single and multi-guest bookings
- special requests
- bookings from mobile and web

### Reviews and notifications

- good, average, and weak verified reviews
- unread and read notifications
- payment confirmation
- pending payment
- booking cancellation/refund
- new guide booking
- special-request alert
- new-review alert
- tour-under-review alert
- tour-tomorrow reminder

## ML use cases supported by the exported shape

1. **Trip recommendation/ranking**
   - Primary file: `interactions.csv`
   - Supporting files: `users.csv`, `tours.csv`
   - Start with popularity and content-based baselines before collaborative filtering.

2. **Review sentiment or rating prediction**
   - Primary file: `reviews.csv`
   - Target: rating or positive/neutral/negative bucket.

3. **Booking cancellation prediction**
   - Primary file: `bookings.csv`
   - Target: cancellation/refund versus retained booking.

4. **Demand and occupancy forecasting**
   - Aggregate bookings by date, tour, guide, city, category, and status.

## Important limitation

This seed is large enough for frontend, API, aggregation, and end-to-end scenario testing. It is not large enough to train a reliable production ML model. Its ML value is to validate the schema, export pipeline, features, labels, and integration flow before real interaction data is collected.
