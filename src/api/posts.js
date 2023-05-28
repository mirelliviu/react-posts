import axios from 'axios'; 

const postsAPI = axios.create({
    baseURL: 'http://localhost:3501',
});

const updatePasswordApi = axios.create({
    baseURL: 'https://localhost',
});

const emailAPI = axios.create({
    baseURL: 'http://localhost:3500',
});
const invoicesAPI = axios.create({
    baseURL: 'http://localhost:3501',
});

export {
    postsAPI,
    emailAPI,
    invoicesAPI,
    updatePasswordApi
}