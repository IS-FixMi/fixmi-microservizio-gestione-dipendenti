import { AUTH_IP } from '../server';



// This function returns the profile info from the authentication microservice
export default async function getProfileInfo(token) {

  // Preparing the query for the authentication microservice
  const formData = new URLSearchParams();
  formData.append('token', token);
  const authentication_url = "http://"      // protocol
                             + AUTH_IP +    // ip
                             ":3001" +      // port
                             "/api/auth/authenticate"; // path

  // Fetching the profile info
  const response = await fetch(authentication_url, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData.toString()
  }).then(response => {

  if(!response.ok) {
    //console.log(JSON.stringify(response.body))
    const e = {status: 404,error: {'error': 'User not found with the given token'}};
    throw e;
  }

  return response.json();
  });
  console.log("oooooo "+JSON.stringify(response));
  return response;
}
