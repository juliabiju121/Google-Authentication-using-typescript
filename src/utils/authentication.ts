import axios from "axios";

class Authentication{
    public static async getAcessToken(auth_code: any) {
        const axios = require("axios")
        const google_access_token_endpoint = 'https://oauth2.googleapis.com/token';

            const access_token_params = {
                redirect_uri: 'http://localhost:5000/re',
                client_id: "1061601123166-1tlfa3u3ctortlp0da207jtvueg84shv.apps.googleusercontent.com",
                client_secret: "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",
                code: auth_code,
                grant_type: 'authorization_code',
            };
            const query_string = new URLSearchParams(access_token_params)
            console.log(query_string);
            return  axios({    
                method: 'post',
                url: `${google_access_token_endpoint}?${query_string.toString()}`,
            });
      
    }

    public static async getprofiledata( access_token: any){
        return await axios ({
            method: 'post',
            url: `https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${access_token}`,
          });
        };
    
        public static async getGoogleOAuthURL(){
            const rootUrl="https://accounts.google.com/o/oauth2/v2/auth";
            const options={
        
                redirect_uri:'http://localhost:5000/re',
                client_id:"1061601123166-1tlfa3u3ctortlp0da207jtvueg84shv.apps.googleusercontent.com",
                access_type:'offline',
                response_type:'code',
                prompt:'consent',
                scope:[
                    'https://www.googleapis.com/auth/userinfo.profile',
                    'https://www.googleapis.com/auth/userinfo.email'
        
                ].join(" ")
            };
            console.log({ options })
            const qs=new URLSearchParams(options);
            console.log({ qs })
          return `${rootUrl}?${qs.toString()}`;
        }
    
}
export default Authentication;
