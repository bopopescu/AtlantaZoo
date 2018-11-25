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

const register = (username, email, password, userType) =>
    fetch('http://localhost:5000/users',
        {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
                username,
                email,
                password,
                user_type: userType
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
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

const logout = () =>
    fetch('http://localhost:5000/logout',
    {
        credentials: 'include',
        method: 'GET',
    })
    .catch(e => console.error(e))
    .then(standardHandler);

const LoginService = {
    login,
    register,
    checkForExistingLogin,
    logout,
};

export default LoginService;
