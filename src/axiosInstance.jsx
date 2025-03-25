// import axios from "axios";

// // Create an Axios instance with default settings

// const axiosInstance = axios.create({
//     baseURL: "http://127.0.0.1:8000/api/",
//     headers: {
//         "Content-Type": "application/json",
//     },
// });

// // Add a request interceptor to include JWT token automatically

// axiosInstance.interceptors.request.use((config) => {
//     const token = localStorage.getItem("access");   // Get token from localStorage
//     if (token) {
//         config.headers["Authorization"] = `Bearer ${token}`;    // Attach JWT token
//     }
//     return config;
// });

// export default axiosInstance;