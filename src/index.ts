import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import PostController from '@/resources/post/post.controller';
import UserController from './resources/user/user.router';
const app=new App([new UserController()],Number(process.env.PORT));
app.listen();

