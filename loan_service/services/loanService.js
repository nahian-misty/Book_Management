import {PrismaClient} from "@prisma/client";
const USER_URL= process.env.USER_URL;
const BOOK_URL= process.env.BOOK_URL;

const prisma= new PrismaClient();

export const loanBook= async(data)=>{
    const user= await fetch(`${USER_URL}/api/users/${data.user_id}`);
    if(!user){
        return res.status(404).json({error:"user not found"})
    }

    const book= await fetch(`${BOOK_URL}/api/books/${data.book_id}`);
    if(!book || book.availableCopies<0){
        return res.status(404).json({error:"book not found or unavailable"})
    }

    await fetch(`${BOOK_URL}/api/books/${data.book_id}/availability`,
        {
            method: "PATCH", // or "POST" depending on your API
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                availableCopies: 1,
                operation: "decrement"
            })
        }
    )
    return prisma.loan.create({
        data:{
            userId: data.user_id,
            bookId:data.book_id,
            dueDate:new Date(data.due_date),
            status:'ACTIVE'
        }
    })
}

export const returned= async(loan_id)=>{
    const loan= await prisma.loan.findUnique({
        where:{
            id:loan_id
        }
    })
    await fetch(`${BOOK_URL}/api/books/${loan.bookId}/availability`,{
        method:"PATCH",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            availableCopies:1,
            operation:"increment"
        })
    })
    return prisma.loan.update({
        where:{id:loan_id},
        data:{
            status:"RETURNED"
        }
    })
}