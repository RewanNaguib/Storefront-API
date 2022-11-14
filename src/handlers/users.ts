import express, {Request, Response} from "express";
import {UserType, User} from "../models/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {authentication} from "../middlewares/authentication";
import bcrypt from "bcrypt";

dotenv.config();

const tokenSecret = process.env.TOKEN_SECRET;
const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS;
const user = new User();

const index = async(req: Request, res: Response) => {
    try{
        const users: UserType[] = await user.index();
        res.json(users);
    } catch(error){
        res.status(500).json((error as Error).message);
    }  
};

const show = async(req: Request, res: Response) => {
        const id: string = req.params.id;
        if(id){
            try{
                const thisUser: UserType = await user.show(id);
                if(thisUser){
                    res.json(thisUser);
                }
                else{
                    res.sendStatus(404);
                }
            } catch(error){
                res.sendStatus(500);
            }
        }
        else{
            res.sendStatus(400);
        }
};

const update = async(req: Request, res: Response) => {
    // hashing the password recived from the request before updating it in the database
    req.body.userpassword = (await bcrypt.hashSync(req.body.userpassword + pepper, parseInt(saltRounds as string))) as string;
    const id: string = req.params.id;
    const userObject: UserType = {
        username: req.body.username,
        useremail: req.body.useremail,
        userpassword: req.body.userpassword
    };
    if(id){
        try{
            const updatedUser: UserType = await user.update(id, userObject.username, userObject.useremail, userObject.userpassword);
            if(updatedUser){
                if(updatedUser && typeof userObject.username == 'string' && userObject.username.trim().length !== 0 && typeof userObject.useremail == 'string' && userObject.useremail.trim().length !== 0 && typeof userObject.userpassword == 'string' && userObject.userpassword.trim().length !== 0){
                res.json(updatedUser);
                }
                else{
                    res.sendStatus(400);
                }
            }
            else{
                res.sendStatus(404);
            }
        } catch(error){
            res.sendStatus(500);
        }
    }
    else{
        res.sendStatus(400);
    }
};

const destroy = async(req: Request, res: Response) => {
    const id: string = req.params.id;
    if(id){
        try{
            const deletedUser: number = await user.destroy(id);
            if(deletedUser){
                res.status(204).json(deletedUser);
            }
            else{
                res.sendStatus(404);
            }  
        } catch(error){
            res.sendStatus(500);
        }
    }
    else{
        res.sendStatus(400);
    }
}

const create = async(req: Request, res: Response) => {
        const userObject: UserType = {
            username: req.body.username,
            useremail: req.body.useremail,
            userpassword: req.body.userpassword
        };
    try{
        if(userObject && typeof userObject.username == 'string' && userObject.username.trim().length!==0 && typeof userObject.useremail == 'string' && userObject.useremail.trim().length!==0 && typeof userObject.userpassword == 'string' && userObject.userpassword.trim().length!==0){
            const newUser: UserType = await user.create(userObject);
            const token = jwt.sign(
                {
                    user: {
                        id: newUser.id,
                        username: newUser.username,
                        useremail: newUser.useremail
                    }
                }, tokenSecret as string
            );
            res.json(token);
        }
        else{
            res.sendStatus(400);
        }
    } catch(error){
        res.status(400).json((error as Error).message);
    }
};

const authenticate = async(req: Request, res: Response) => {
    const useremail: string = req.body.useremail;
    const userpassword: string = req.body.userpassword;
    try{
        if(useremail && typeof useremail == 'string' && userpassword && typeof userpassword == 'string') {
            const loggedInUser: UserType | null = await user.authenticate(useremail, userpassword);
            if(loggedInUser){
                const token = jwt.sign(
                    {
                        user: {
                            id: loggedInUser.id,
                            username: loggedInUser.username,
                            useremail: loggedInUser.useremail
                        }
                    }, tokenSecret as string
                );
                res.json(token);
            }
            else{
                res.sendStatus(401);
            }
        }
        else{
            res.sendStatus(400);
        }

    } catch(error){
        res.status(401).json((error as Error).message);
    }
};


const userRoutes = (app: express.Application): void => {
    app.get('/users', authentication, index);
    app.get('/users/:id', authentication, show);
    app.patch('/users/:id', authentication ,update);
    app.delete('/users/:id', authentication, destroy);
    app.post('/signup', create);
    app.post('/login', authenticate);
};

export default userRoutes;
