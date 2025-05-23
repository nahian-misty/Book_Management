import express from "express";
import {detailsLoan, historyBook, issueBook , returnBook} from "../controllers/loanController.js";

const loanRouter= express.Router();

loanRouter.post("/", issueBook);
loanRouter.post("/returns", returnBook);
loanRouter.get("/user/:id", historyBook);
loanRouter.get("/:id", detailsLoan);

export default loanRouter;