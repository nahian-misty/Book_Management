import express from "express";
import { addBook, getBook, searchBook, updateBook, updateAvailability, deleteBook } from "../controllers/bookController.js";

const bookRouter= express.Router();

bookRouter.post("/", addBook);
bookRouter.get("/", searchBook);
bookRouter.get("/:id",getBook);
bookRouter.put("/:id",updateBook);
bookRouter.patch("/:id/availability", updateAvailability);
bookRouter.delete("/:id", deleteBook);

export default bookRouter;