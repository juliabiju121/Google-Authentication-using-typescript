
const axios = require("axios")
const google_access_token_endpoint = 'https://oauth2.googleapis.com/token';

const get_access_token = async auth_code => {
  const access_token_params = {
    redirect_uri:'http://localhost:5000/re',
    client_id: "1061601123166-1tlfa3u3ctortlp0da207jtvueg84shv.apps.googleusercontent.com",
    client_secret:"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",
    code: auth_code,
    grant_type: 'authorization_code',
  };
  const query_string=new URLSearchParams(access_token_params)
  console.log(query_string);
  return await axios ({
    method: 'post',
    url: `${google_access_token_endpoint}?${query_string.toString()}`,
  });
};

module.exports =  get_access_token;