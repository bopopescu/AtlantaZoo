const query = params => Object.entries(params)
    .map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v))
    .join('&');

const standardHandler = (response) => {
    if (!response.ok) {
        return Promise.reject(response);
    }
    return response.json();
};

export { query, standardHandler };
