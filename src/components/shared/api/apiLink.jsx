import axios from 'axios';

// Access the correct environment variable
const Api = axios.create({
    baseURL: 'https://dev-api.fendolgroup.com/api/v1', // Use the updated variable name
    headers: {
        'Content-Type': 'application/json',
    },
});


// Request interceptor to add Authorization header
Api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default Api;
