
const axios=require('axios')
    const get_profile_data = async access_token => {
    return await axios ({
      method: 'post',
      url: `https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${access_token}`,
    });
  };
  
  module.exports=get_profile_data
  