import cookieParser from 'cookie-parser';
import getMissingFields from './missingFields';


// This function returns the token from the request
export default function getToken(req) {

  let token;

  // getting the token from the request body
  token = req.body.token;

  if (token == undefined) {
    // getting the token from the cookie
    token = req.cookies.token;
  }

  // Check if the token is missing
  const missingFields = getMissingFields([["token", token]]);
  if (missingFields.length != 0) {
    const e =  {status: 401,error: { 'error': 'Missing token', missingfields: missingFields} };
    throw e;
  }

  return token;
}
