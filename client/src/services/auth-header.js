export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = JSON.parse(localStorage.getItem('token'));

  if (user && token) {
    //console.log("token " + token);
    return { Authorization: 'Bearer ' + token };
  } else {
    return {};
  }
}

