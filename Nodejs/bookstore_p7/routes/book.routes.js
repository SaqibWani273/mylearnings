const app = require("express");
const router = app.Router();
const bController = require("../controller/book.controller");

router.get("/", bController.getAllBooks);
router.get("/:id", bController.getBookById);
router.post("/addbook", bController.addBook);
router.delete("/deletebook/:id", bController.deleteBookById);

//default export
module.exports = router;
