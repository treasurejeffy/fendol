import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correct import as a named export

// Access the correct environment variable
const Api = axios.create({
    baseURL: 'https://dev-api.fendolgroup.com/api/v1', // Use the updated variable name
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to check if the token is expired
const isTokenExpired = (token) => {
    try {
        const decodedToken = jwtDecode(token); // Decode the token
        const currentTime = Date.now() / 1000; // Get the current time in seconds
        return decodedToken.exp < currentTime; // Check if token is expired
    } catch (error) {
        return true; // If there is an error decoding, assume the token is invalid
    }
};

// Request interceptor to add Authorization header and check for token expiration
Api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('authToken');
        console.log(token)
        if (token) {
            if (isTokenExpired(token)) {
                console.warn("Token is expired, please login again.");
                // Optionally redirect to login page or handle token refresh here
            } else {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default Api;
