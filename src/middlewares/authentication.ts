import express, {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function authentication(req: Request, res: Response, next: NextFunction): void {
    try{
        const authorizationHeader = req.headers.authorization as string;
        const token = authorizationHeader.split(' ')[1];
        const tokenSecret = process.env.TOKEN_SECRET as string;
        jwt.verify(token, tokenSecret);
        return next();
    }catch(error){
        res.status(401).json('Access Denied, Invalid Token');
    }
}

