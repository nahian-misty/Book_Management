import * as userService from "../services/userService.js"
export const createUser= async(req,res)=>{
try {
    const user= await userService.registerUser(req.body);
    res.status(201).json(user)
} catch (error) {
    res.status(500).json({error:error.message})
}
}

export const fetchUser= async(req,res)=>{
    try {
        const user= await userService.getUser(parseInt(req.params.id))
        if(!user){
            return res.status(404).json({error:"user not found"})
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export const putUser= async(req,res)=>{
    try {
        const user= await userService.updateUser(parseInt(req.params.id),req.body);
        if(!user){
            return res.status(404).json({error:"user not found"})
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}