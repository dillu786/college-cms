import express from "express";
import cors from "cors";
import {prismaClient} from "db/client"
import { middleware } from "./middlware";
import { SigninSchema } from "common/inputs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const app = express();
app.use(cors());
app.use(express.json())

app.post("/signin",async (req, res)=>{

    const parsedBody = SigninSchema.safeParse(req.body);
    if(!parsedBody.success){
        return res.status(400).json({
            message: "Invalid body"+parsedBody.error
        })
    }
    const {email, password} = parsedBody.data;
    const user = await prismaClient.user.findUnique({
        where: {email}
    })
    if(!user){
        return res.status(400).json({
            message: "User not found"
        })
    }
    //const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = password == user.password;
    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid password"
        })
    }
    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET as string);
    return res.status(200).json({
        message: "User signed in",
        token
    })



})

app.get("/calender/:courseId", middleware,async(req,res)=>{
    const courseId = req.params.courseId;
    const userId = req.userId;
    const course = await prismaClient.course.findUnique({
        where: {id: courseId}
    })
    if(!course){
        return res.status(400).json({
            message: "Course not found"
        })
    }
    const purchase = await prismaClient.purchase.findFirst({
       where:{
        userId: userId,
        courseId: courseId
       }
    })

    if (!purchase){
        return res.status(400).json({
            message: "No course found"
        })
    }
    return res.status(200).json({
        message: "Course fetched successfully",
        data:{
            id: course.id,
            calenderId: course.calenderNotionId
        }
    })
});

app.listen(process.env.PORT || 3000);