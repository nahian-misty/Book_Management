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

export const history= async(id)=>{
    const loans= await prisma.loan.findMany({
        where:{
            userId:id,
            //orderBy: {issueDate: desc}
        }
    })

    const newLoans= await Promise.all(
        loans.map(async(loan)=>{
        const [bookResponse,userResponse]= await Promise.all([
            fetch(`${BOOK_URL}/api/books/${loan.bookId}`, {method: 'GET'}),
            fetch(`${USER_URL}/api/users/${loan.userId}`, {method:'GET'}),
    ]);

    if(!bookResponse.ok || !userResponse.ok){
        throw new Error('Failed to fetch user/book info');
    }

    const bookData= await bookResponse.json();
    //const userData= await userResponse.json();

    return{
        id: loan.id,
            book:{
            id:bookData.id,
            title: bookData.title,
            author:bookData.author,
        },
        issueDate: loan.issueDate,
        dueDate:loan.dueDate,
        return_date:loan.returnDate,
        status:loan.status   
    };
    })
);

return {
    loans: newLoans,
    total: loans.length
};
    
}

export const details= async(id)=>{
    const loan= await prisma.loan.findUnique({
        where:{
            id:id
        }
    })

    const userRes= await fetch(`${USER_URL}/api/users/${loan.userId}`, {method:'GET'});
    const bookRes= await fetch(`${BOOK_URL}/api/books/${loan.bookId}`, {method:'GET'});

    const user= await userRes.json();
    const book= await bookRes.json();
    return {
        id: id,
        user:{
            id:user.id,
            name:user.name,
            email:user.email
        },
        book:{
            id:book.id,
            title:book.title,
            author:book.author
        },
        issue_date:loan.issueDate,
        due_date:loan.dueDate,
        return_date:loan.returnDate,
        status:loan.status
    };
}