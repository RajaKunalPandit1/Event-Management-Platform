// import { useEffect, useState } from "react";
// import axiosInstance from "../axiosInstance";

// const ProtectedPage = () => {
//     const [message, setMessage] = useState("");

//     useEffect(() => {
//         axiosInstance.get("protected/") // add headers in every request
//             .then((res) => setMessage(res.data.message))
//             .catch((err) => setMessage("Unauthorized! Login first."));
//     }, []);

//     return <h1>{message}</h1>;
// };

// export default ProtectedPage;