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
        const book= await bookService.search(req.query);
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
        const book= await bookService.bookInfo(parseInt(req.params.id));
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
        const book=await bookService.updateBookInfo(parseInt(req.params.id), req.body);
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
        const {availableCopies, operation}= req.body;
        const book= await bookService.availabilityUpdate(parseInt(req.params.id), availableCopies, operation)
        res.status(200).json(book)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export const deleteBook= async(req,res)=>{
    try {
        await bookService.bookDeletion(parseInt(req.params.id));
        res.status(200).json({message:"book deleted"})
    } catch (error) {
        res.status(500).json({error:error.message})       
    }
}