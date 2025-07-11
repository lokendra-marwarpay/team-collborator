import axios from 'axios';
import { auth } from '../firebase'; // adjust the path based on your structure

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

instance.interceptors.request.use(async (config) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const token = await currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default instance;
