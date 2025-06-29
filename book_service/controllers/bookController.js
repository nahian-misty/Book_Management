import * as bookService from "../services/bookService.js"

export const addBook= async(req,res)=>{
    console.log(req.body.title);
    try {
        const book= await bookService.createBook(req.body);
        res.status(201).json(book)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export const searchBook= async(req, res)=>{
    try {
        const book= await bookService.searchBooks(req.query.search);
        if(!book){
            return res.status(404).json({error:"no book found"})
        }
        res.status(200).json(book)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export const getBook= async(req, res)=>{
    try {
        const book= await bookService.getBook(req.params.id);
        if(!book){
            return res.status(404).json({error:"no book found with this id"})
        }

        res.status(200).json(book)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export const updateBook= async(req,res)=>{
    try {
        const book=await bookService.updateBook(req.params.id, req.body);
        if(!book){
            return res.status(404).json({error:"no book found with this id"})
        }

        res.status(200).json(book)
    } catch (error) {
        res.status(500).json({error:error.message})

    }
}

export const updateAvailability= async(req,res)=>{
    try {
        const {available_copies, operation}= req.body;
        const book= await bookService.updateAvailability(req.params.id, available_copies, operation)
        res.status(200).json(book)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export const deleteBook= async(req,res)=>{
    try {
        await bookService.deleteBook(req.params.id);
        res.status(200).json({message:"book deleted"})
    } catch (error) {
        res.status(500).json({error:error.message})       
    }
}