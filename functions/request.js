const axios = require("axios")


const SANDBOX_URL = "https://sandbox.monnify.com"
const LIVE_URL = "https://api.monnify.com"

const TEST_API_KEY = "MK_TEST_YAVPYZQBBD"
const TEST_SECRET_KEY = "KGWTAUQ86TQ5S3CGM93ATMSMGFPZ6K53"




// Create axios instance
const axiosClient = axios.create({
    baseURL: SANDBOX_URL,
});




// Define the authenticate function
export const authenticate = async () => {
    console.log("Authenticating...");
    const base64 = Buffer.from(`${TEST_API_KEY}:${TEST_SECRET_KEY}`).toString('base64');

    const response = await axios.post<ApiResponse<Authenticated>>(isLive ? LIVE_URL : SANDBOX_URL + "/api/v1/auth/login", "{}", {
        headers: {
            Authorization: `Basic ${base64}`
        }
    });
    console.log("Authenticated", response.data.responseBody);
    return response.data.responseBody
};


// Add a request interceptor
axiosClient.interceptors.request.use(async function (config) {
    // Do something before request is sent
    const authData = await authenticate();
    config.headers.Authorization = `Bearer ${authData.accessToken}`;
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});


const Request = async (url, method = "GET", data = undefined) => {
    try {
        const response = await axiosClient.request({
            method,
            url,
            data,
        })

        return response.data.responseBody
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 2xx
            console.error('Response error:', error.response.data);
            console.error('Status:', error.response.status);
        } else if (error.request) {
            // Request was made but no response was received
            console.error('No response received:', error.message);
        } else {
            // Something else happened while setting up the request
            console.error('Error setting up request:', error.message);
        }
    }
}


module.exports = Request