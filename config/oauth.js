
function getGoogleOAuthURL()
{
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
module.exports = getGoogleOAuthURL;