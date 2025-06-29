import * as loanService from "../services/loanService.js";

export const issueBook= async (req, res)=>{
    try {
        
        const loan= await loanService.createLoan(req.body);
        res.status(201).json(loan)
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

export const returnBook= async(req,res)=>{
    try {
        const loan= await loanService.returnBook(req.body.loan_id);
        res.status(200).json(loan);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

export const historyBook=async(req,res)=>{
    try {
        const loans= await loanService.getUserLoans(req.params.id);
        res.status(200).json(loans)
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

export const detailsLoan= async(req, res)=>{
    try {
        const loan= await loanService.getLoan(req.params.id);
        res.status(200).json(loan);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}