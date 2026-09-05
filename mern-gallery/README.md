# MERN Gallery - Feature Upgrade Starter

This starter is a working base for the MERN Gallery extension assignment. The five core
features are intentionally provided so you can focus on building and integrating new
features instead of repeating the initial upload setup.

Images are uploaded to the backend and saved on the server's local disk (`server/uploads`).
Express serves that folder publicly, and MongoDB stores only the resulting image URL.

## What is already provided

- Upload an image with `multipart/form-data`
- Responsive gallery grid
- Full-screen image viewer
- Previous / Next slider with wrap-around and keyboard controls
- Delete an image from MongoDB and local disk

Do not submit this starter unchanged. Your work is the **Gallery Upgrade** described below.

## Required extension work

Implement all four upgrades from the assignment PDF:

1. **Image metadata** - add title, description, and tags to the MongoDB document and
   collect them during upload.
2. **Edit metadata** - add a form/modal and `PATCH /api/images/:id` so metadata can be
   changed without re-uploading the file.
3. **Favorites and discovery** - add a persistent favorite toggle and a search, favorite
   filter, and recent/oldest sort control backed by GET query parameters.
4. **Reliable UX states** - add an initial loading state, upload progress, visible API
   errors with retry, and separate empty-gallery and no-search-results states.

The extension endpoints are implemented in the server routes and consumed by the
React client.

## Setup

### Backend
```bash
cd server
npm install
cp .env.example .env   # fill in MONGO_URI and BASE_URL
npm run dev            # http://localhost:5000
```

### Frontend
```bash
cd client
npm install
npm run dev            # http://localhost:5173
```

## Base API already implemented

| Method | Endpoint        | Description                                  |
|--------|-----------------|----------------------------------------------|
| POST   | /api/images     | Upload an image file, save it, store its URL |
| GET    | /api/images     | Get all images                               |
| DELETE | /api/images/:id | Delete one image                             |

## Extension API contract

Add these endpoints while keeping the base endpoints working:

| Method | Endpoint | Expected behavior |
|--------|----------|-------------------|
| GET | `/api/images?search=&favorite=true&sort=recent` | Search title/description/tags, optionally show favorites, and sort by recent or oldest. |
| PATCH | `/api/images/:id` | Update `title`, `description`, and `tags`; return the updated document. |
| PATCH | `/api/images/:id/favorite` | Accept `{ "isFavorite": true }` and return the updated document. |

For the upload extension, keep the file field name `image` and send the additional
multipart fields `title`, `description`, and `tags`.

## Expected final document shape

```js
{
  imageUrl: String,
  title: String,
  description: String,
  tags: [String],
  isFavorite: Boolean,
  createdAt: Date
}
```

MongoDB must still store the URL and metadata only - never the image Buffer, binary
content, or a base64 string.

## Student checklist

- [ ] Core app still uploads, displays, opens, slides, and deletes images.
- [ ] Metadata is validated and persisted in MongoDB.
- [ ] Metadata can be edited without re-uploading the image.
- [ ] Favorite state survives a refresh.
- [ ] Search, favorite filter, and sort use the backend API.
- [ ] Loading, progress, error/retry, and empty states are visible and usable.
- [ ] README contains setup instructions, API changes, and screenshots of the extension.
