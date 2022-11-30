import { Router, Request, Response, NextFunction } from 'express';
import Controller from '../../utils/interfaces/controller.interfaces';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/post/post.validation';
import UserService from './user.controller';
import bodyParser from 'body-parser';
var jsonParser = bodyParser.json();
class UserController implements Controller {
    public path = '/';
    public router = Router()

    constructor() {
        this.initialiseRoutes()
    }
    private initialiseRoutes(): void {
        console.log('Entered Router');
        this.router.get('/hello',(req,res)=>{
            res.send('hello')
        })
        this.router.post('/api', UserService.verifyToken, UserService.createNewUser);
        this.router.put('/api/:id', UserService.verifyToken,UserService.updateUser);
        this.router.delete('/api/:id', UserService.verifyToken,UserService.deleteUser);
        this.router.get('/api', UserService.verifyToken,UserService.retrieveUser);
        this.router.get('/re',UserService.authentication);
        this.router.get('/auth', UserService.oauthAuthentication)
        this.router.post('/login',jsonParser, UserService.userLogin);
    }

    
}

export default UserController;