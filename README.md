# FLCut - Smart URL Shortener

FLCut is a URL shortening application built using Next.js, Prisma, and PostgreSQL. The project allows users to create custom short links, schedule when links should go live, set expiry dates, and view analytics such as clicks, visitor information, country, city, and device details.

The main idea behind this project was to build something more useful than a basic URL shortener by adding scheduling and analytics features.

## Features

- Create custom short URLs
- Generate unique aliases
- Schedule links to go live at a specific date and time
- Set expiry dates for links
- Redirect users to the original URL
- Track total clicks
- Track unique clicks
- View visitor information
- Dashboard for managing links
- Analytics page for click history

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Next.js Route Handlers
- Prisma ORM

### Database
- PostgreSQL

### Deployment
- Vercel

## How It Works

When a user creates a short link, the application stores the original URL along with a custom alias or generated shortcode in the database.

When someone visits the shortened URL:

1. The application finds the matching shortcode.
2. It checks whether the link is active.
3. It checks whether the link has expired.
4. A click event is recorded.
5. Analytics data is stored.
6. The user is redirected to the original URL.

The dashboard displays all created links along with click statistics, while the analytics page shows detailed information about each click.

## Database Structure

The project uses two main tables:

### Link

Stores information about each shortened URL.

- id
- shortCode
- originalUrl
- clicks
- createdAt
- goLiveAt
- expiresAt

### ClickEvent

Stores information about every click.

- id
- linkId
- ip
- userAgent
- referrer
- country
- city
- createdAt

## Running the Project Locally

### Clone the repository

```bash
git clone https://github.com/ShravyaS229/shorten-link.git
cd shorten-link
```

### Install dependencies

```bash
npm install
```

### Create a .env file

```env
DATABASE_URL="your_postgresql_connection_string"
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Push the schema to the database

```bash
npx prisma db push
```

### Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

## Available Pages

### Home

Create and manage short links.

```text
/
```

### Dashboard

View all links and click statistics.

```text
/dashboard
```

### Analytics

View detailed click history and visitor information.

```text
/analytics
```

## What I Learned

This project helped me gain experience with:

- Next.js App Router
- Prisma ORM
- PostgreSQL
- Dynamic routing
- Analytics tracking
- Working with dates and time zones

## Future Improvements

Some features that can be added in the future are:

- User authentication
- QR code generation
- Search and filtering
- 