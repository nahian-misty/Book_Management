import {PrismaClient} from "@prisma/client";
const prisma= new PrismaClient();

export const createBook=async (data)=>{
    //console.log(data.title);
    return prisma.book.create({
        data:{
            title: data.title,
            author: data.author,
            isbn: data.isbn,
            copies: data.copies,
            availableCopies: data.copies
        }
    })
}

export const search= async(data)=>{
    const {search}= data;
    return prisma.book.findMany({
        where:{
            OR:[
                {title: {contains:search}},
                {author: {contains:search}},
                {isbn: {contains:search}}
            ]
        }
    })
}

export const bookInfo= async (data)=>{
    const id= data;
    return prisma.book.findUnique({
        where:{id}
    })
}

export const updateBookInfo= async(id,data)=>{

    return prisma.book.update({
        where:{id},
        data:{
            copies:data.copies,
            availableCopies:data.copies
        }
    })
}

export const availabilityUpdate= async(id,availabileCopies,operation)=>{
    return prisma.book.update({
        where:{id},
        data:{
            availableCopies: operation==="increment"
            ? {increment: availabileCopies}
            : {decrement: availabileCopies}
        }
    })
}

export const bookDeletion= async (id)=>{
    return prisma.book.delete({
        where:{id}
    })
}