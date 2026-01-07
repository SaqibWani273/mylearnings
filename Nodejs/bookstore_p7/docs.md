# Bookstore (Node.js) — Quick Revision

Project files:

- [index.js](index.js)
- [routes/book.routes.js](routes/book.routes.js)
- [controller/book.controller.js](controller/book.controller.js)
- [moddleware/logger.js](moddleware/logger.js)
- [tempdb/books.js](tempdb/books.js)
- [package.json](package.json)
- [log.txt](log.txt)
- [.vscode/settings.json](.vscode/settings.json)

---

## Summary

Small Express app demonstrating:

- Routing with Express (`[routes/book.routes.js](routes/book.routes.js)`).
- Controller functions for CRUD-like handlers (`[controller/book.controller.js](controller/book.controller.js)`): [`getAllBooks`](controller/book.controller.js), [`getBookById`](controller/book.controller.js), [`addBook`](controller/book.controller.js), [`deleteBookById`](controller/book.controller.js).
- Simple middleware logger writing to a file (`[moddleware/logger.js](moddleware/logger.js)`): [`logger`](moddleware/logger.js).
- An in-memory temporary DB (`[tempdb/books.js](tempdb/books.js)`) exporting `books`.
- App bootstrap and route mounting in `[index.js](index.js)` using the imported router as [`bookRouter`](routes/book.routes.js).

---

## How it runs

1. Install dependencies via npm (project uses Express v5).
2. Start with the script in `[package.json](package.json)`:
   npm run start
   - This runs `node --watch index.js` (auto-restart on change).

Entrypoint: `[index.js](index.js)`

- Creates Express app and JSON body parser.
- Uses middleware: [`logger`](moddleware/logger.js).
- Mounts router: `app.use("/book", bookRouter)` where `bookRouter` comes from `[routes/book.routes.js](routes/book.routes.js)`.

---

## Routes (in `[routes/book.routes.js](routes/book.routes.js)`)

- GET /book/ -> handled by [`getAllBooks`](controller/book.controller.js)
- GET /book/:id -> handled by [`getBookById`](controller/book.controller.js)
- POST /book/addbook -> handled by [`addBook`](controller/book.controller.js)
- DELETE /book/deletebook/:id -> handled by [`deleteBookById`](controller/book.controller.js)

Notes:

- Routes file exports an Express Router instance (module.exports = router).

---

## Controller behavior (in `[controller/book.controller.js](controller/book.controller.js)`)

- [`getAllBooks`](controller/book.controller.js): returns full `books` array (from `[tempdb/books.js](tempdb/books.js)`).
- [`getBookById`](controller/book.controller.js):
  - Reads `id` from `req.params`.
  - Validates with `isNaN(id)` and returns 400 for invalid input.
  - Finds book with loose equality `b.id == id` to allow string param match.
  - Returns 400/404 appropriately or the book object.
- [`addBook`](controller/book.controller.js):
  - Expects JSON body with `bookname`.
  - Validates `bookname`; returns 400 if missing.
  - Pushes `{ id: books.length + 1, bookname }` to `books`.
  - Responds 201 on success.
- [`deleteBookById`](controller/book.controller.js):
  - Validates `id`, finds book and splices by index `id - 1`.
  - Returns 201 with updated list on success or 404 if not found.

Caveats:

- Using `isNaN(id)` where `id` is a string works but could be clearer by converting with `Number(id)` or `parseInt`.
- Deletion uses `splice(id - 1, 1)` assuming IDs are contiguous and start at 1; if books get reordered or IDs are non-sequential this causes bugs.

---

## Middleware (in `[moddleware/logger.js](moddleware/logger.js)`)

- `logger(req, res, next)` appends a line to `log.txt`:
  `\n${Date.now()} : ${req.method} | ${req.url}`
- Uses `fs.appendFileSync` (synchronous). For production prefer async `fs.appendFile` or a logging library.
- The log file is `[log.txt](log.txt)` (example contents present).

---

## Data store (in `[tempdb/books.js](tempdb/books.js)`)

- Exports an in-memory array `exports.books = [...]`.
- Not persistent across restarts. Intended for learning/demo only.

---

## Common improvements / gotchas

- Validate and parse `id` consistently: use `const idNum = Number(req.params.id)` and check `Number.isInteger(idNum)`.
- Use `res.json(...)` consistently for JSON responses; avoid `res.end()` with objects.
- When deleting, find index with `books.findIndex(b => b.id === idNum)` instead of assuming `id - 1`.
- Avoid `appendFileSync` in request flow; use asynchronous logging or a queue.
- Consider using router-level middleware and HTTP codes according to REST semantics (e.g., 204 for successful delete with no body).
- Add error handling middleware for centralized error responses.

---

## Useful symbols and files

- Router: [`bookRouter`](routes/book.routes.js) — [routes/book.routes.js](routes/book.routes.js)
- Controllers: [`getAllBooks`](controller/book.controller.js), [`getBookById`](controller/book.controller.js), [`addBook`](controller/book.controller.js), [`deleteBookById`](controller/book.controller.js) — [controller/book.controller.js](controller/book.controller.js)
- Middleware: [`logger`](moddleware/logger.js) — [moddleware/logger.js](moddleware/logger.js)
- Data: `books` — [tempdb/books.js](tempdb/books.js)
- App entry: [index.js](index.js)
- Config / scripts: [package.json](package.json)
- Runtime log: [log.txt](log.txt)

---

## Quick checklist to experiment

1. Start server: npm run start
2. Test endpoints:
   - GET http://localhost:8080/book/
   - GET http://localhost:8080/book/1
   - POST http://localhost:8080/book/addbook with JSON body { "bookname": "New Book" }
   - DELETE http://localhost:8080/book/deletebook/2
3. Inspect logs in [log.txt](log.txt).
4. Modify controllers to use safer id parsing and improve delete logic.

---
