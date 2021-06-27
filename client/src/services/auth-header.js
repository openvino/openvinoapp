export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (user && token) {
    console.log("token " + token);
     return { Authorization: 'Bearer ' + token }; // for Spring Boot back-end
    //  return { 'x-access-token': token };       // for Node.js Express back-end
  } else {
    return {};
  }
}

