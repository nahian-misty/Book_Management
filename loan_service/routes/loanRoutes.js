import express from "express";
import { issueBook , returnBook} from "../controllers/loanController.js";

const loanRouter= express.Router();

loanRouter.post("/", issueBook);
loanRouter.post("/returns", returnBook);

export default loanRouter;