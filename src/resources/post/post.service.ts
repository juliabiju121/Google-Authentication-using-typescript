import PostModel from '@/resources/post/post.model';
import Post from '@/resources/post/post.interface';

class PostService{
    private post=PostModel;
    public async Create(title:string,body:string ):Promise<Post>{
        try{this
            const post=await this.post.create({title,body});
            return post;
        }
        catch (error){
            throw new Error('unable to creae post')
        }
        }

    }
    export default PostService;
