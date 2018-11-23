const standardHandler = (response) => {
    if (!response.ok) {
        return Promise.reject(response);
    }
    return response.json();
};

const login = (email, password) =>
      fetch('http://localhost:5000/login',
            {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ email, password }),
                headers: {
                    'Content-Type': 'application/json'
                }})
      .catch(e => console.error(e))
      .then(standardHandler);


const checkForExistingLogin = () =>
      fetch('http://localhost:5000/whoami',
            {
                credentials: 'include',
                method: 'GET',
            })
      .catch(e => console.error(e))
      .then(standardHandler);


const LoginService = {
    login,
    checkForExistingLogin,
};

export default LoginService;
