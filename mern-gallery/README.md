# MERN Gallery
MERN Gallery is a full-stack image gallery application.
The React and Vite client provides the gallery, viewer, upload, and edit interfaces.
The Express server handles image uploads and REST API requests.
MongoDB stores image metadata, while uploaded files are served from the server.
## Setup and Run
1. Install Node.js and make sure MongoDB is available.
2. Create `server/.env` and add `MONGO_URI=your_mongodb_connection_string`.
3. In a terminal, run `cd server && npm install && npm run dev`.
4. In a second terminal, run `cd client && npm install && npm run dev`.
5. Open `http://localhost:5173` in your browser.
