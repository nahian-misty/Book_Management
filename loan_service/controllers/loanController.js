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

export const historyBook=async(req,res)=>{
    try {
        const loans= await loanService.history(parseInt(req.params.id));
        res.status(200).json(loans)
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

export const detailsLoan= async(req, res)=>{
    try {
        const loan= await loanService.details(parseInt(req.params.id));
        res.status(200).json(loan);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}