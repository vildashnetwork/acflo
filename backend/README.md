# ACFLO Backend API

Express + MongoDB (Mongoose) + Cloudinary REST API for the ACFLO project.
It mirrors the frontend's `content_items` model so **everything the site
displays can be posted to this backend**: news, events, gallery, videos,
partners, organizations and resources — plus contact/join messages and
media uploads.

## Quick start

```bash
cd backend
npm install
npm run dev     # development (nodemon)
npm start       # production
```

The server reads `backend/.env` (never commit it — it's gitignored).
Copy `.env.example` if you need to recreate the keys.

On boot you should see:

```
[db] MongoDB connected
[api] ACFLO backend listening on http://localhost:5000
```

Health check: `GET http://localhost:5000/api/health`

## Environment variables

| Key | Purpose |
| --- | --- |
| `PORT` | API port (default `5000`) |
| `MONGOURI` | MongoDB connection string (`mongodb+srv://…`) |
| `MONGOURIOFFLINE` | Fallback connection string |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary uploads |
| `CLOUDINARY_STUDENT_PHOTOS_FOLDER` | Base folder for uploads (e.g. `bchs/students`) |
| `CORS_ORIGIN` | Optional comma-separated allowed origins |
| `API_TOKEN` | Optional — when set, content/media mutations require header `x-api-token` |

> **Note:** `mongodb+srv://` URIs are resolved automatically with a DNS
> fallback (`1.1.1.1`/`8.8.8.8`), so the API also works behind local DNS
> proxies such as Cloudflare WARP.

## Endpoints

### Content

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/content` | List. Query: `kind`, `published`, `search`, `country`, `page`, `limit`, `sort` |
| `GET` | `/api/content/kinds` | Supported kinds |
| `GET` | `/api/content/:kind/:slug` | One item by kind + slug (frontend page lookup) |
| `GET` | `/api/content/:id` | One item by id (or bare slug) |
| `POST` | `/api/content` | Create — JSON **or** multipart with `image`/`file` fields |
| `PUT` | `/api/content/:id` | Partial update (same body/multipart rules) |
| `DELETE` | `/api/content/:id` | Delete — also removes its Cloudinary assets |

Kinds: `news`, `event`, `gallery`, `video`, `partner`, `organization`, `resource`

Example:

```bash
curl -X POST http://localhost:5000/api/content \
  -H "Content-Type: application/json" \
  -d '{"kind":"news","title":"Hello","excerpt":"Short","body":"Full story","category":"News","country":"Cameroon"}'
```

With an image (multipart):

```bash
curl -X POST http://localhost:5000/api/content \
  -F kind=gallery -F title="Field photos" -F published=true \
  -F image=@photo.jpg
```

### Media (Cloudinary)

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/media/upload` | Multipart field `file`; optional `kind`/`folder` |
| `GET` | `/api/media?folder=&limit=` | List uploaded assets |
| `DELETE` | `/api/media/:publicId` | Delete asset (`publicId` URL-encoded) |

### Messages (contact / join forms)

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/messages` | Public. `{ type, name, email, subject, message, organization, country, phone }` |
| `GET` | `/api/messages?type=&handled=&page=` | List (protected when `API_TOKEN` is set) |
| `PATCH` | `/api/messages/:id` | Mark `{ handled: true }` |
| `DELETE` | `/api/messages/:id` | Delete |

### Health

`GET /api/health` → `{ status, db, uptime, time }` (HTTP 200 ok / 503 degraded)

## Response shape

Items match the frontend's Supabase `content_items` columns so the same
mapper (`frontend/src/lib/cms.ts`) can consume them:

```json
{
  "id": "6acc…",
  "kind": "news",
  "title": "…",
  "slug": "…",
  "excerpt": "…",
  "body": "…",
  "category": "…",
  "country": "…",
  "city": "",
  "location": "",
  "website": null,
  "video_url": null,
  "file_url": null,
  "image_url": "https://res.cloudinary.com/…",
  "event_date": null,
  "published": true,
  "created_at": "2026-10-11T22:30:03.281Z",
  "updated_at": "2026-10-11T22:30:03.281Z"
}
```

List responses: `{ items, total, page, pages, limit }`.
Errors: `{ "error": "message", "details": [...] }` with proper HTTP status
(400 validation, 404 not found, 409 duplicate, 401 when `API_TOKEN` required).

## Project structure

```
backend/
├── src/
│   ├── server.js            # entry: connect DB → listen
│   ├── app.js               # express app, CORS, routes, errors
│   ├── config/              # env, db, cloudinary
│   ├── models/              # ContentItem, Message (Mongoose)
│   ├── middleware/          # multer upload, optional API token, errors
│   ├── controllers/         # content / media / messages logic
│   ├── routes/              # /api/content, /api/media, /api/messages
│   └── utils/               # zod validation, slugify
├── .env                     # your credentials (gitignored)
└── .env.example
```
