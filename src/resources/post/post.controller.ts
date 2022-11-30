import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interfaces';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/post/post.validation';
import PostService from '@/resources/post/post.service';
class PostController implements Controller {
    public path = '/posts';
    public router = Router();
    private PostService = new PostService()

    constructor() {
        this.initialiseRoutes()
    }
    private initialiseRoutes(): void {
        // this.router.post('/api',.createNewUser);
        // this.router.put('/api/:id',this.updateUser);
        // this.router.delete('/api/:id',this.deleteUser);
        // this.router.get('/api',this.retrieve);
        // this.router.get('/re',this.Authentication);
        // this.router.get('/auth',this.OauthAuthentication)
        // this.router.post('/login', this.Login);
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { title, body } = req.body;
            const post = await this.PostService.Create(title, body);
            res.status(201).json({ post })
        } catch (error) {
            next(new HttpException(400, 'cannot create post'));
        }
    };
}

export default PostController;