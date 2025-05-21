import {PrismaClient} from "@prisma/client";
const prisma= new PrismaClient();

export const registerUser = async (data)=>{
    return prisma.user.create({
        data:{
            name:data.name,
            email:data.email,
            role:data.role
        }
    })
}

export const getUser = async (id)=>{
    return prisma.user.findUnique({
        where:{id}
    })
}

export const updateUser = async(id, data)=>{
    return prisma.user.update({
        where: {id}, 
        data:{
            name:data.name,
            email:data.email
        }
    })
}