import * as loanService from "../services/loanService.js";

export const issueBook= async (req, res)=>{
    try {
        
        const loan= await loanService.loanBook(req.body);
        res.status(201).json(loan)
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

export const returnBook= async(req,res)=>{
    try {
        const loan= await loanService.returned(parseInt(req.body.loan_id));
        res.status(200).json(loan);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}