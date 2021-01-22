import axios from 'axios'

const API_URL = "http://localhost:5001/api/auth";

const register = (user) => {
    return axios.post(`${API_URL}/register`, {
        mobileNumber: user.mobileNumber,
        userName: user.userName,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password
    })
}

const login = (mobileNumber, password) => {
    return axios.post(`${API_URL}/login`, {
        mobileNumber,
        password
    }).then((response) => {
        console.log("API-RESPONSE" + JSON.stringify(response))
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response;
    })
}

const logout = () => {
    localStorage.removeItem("user");
};

export default {
    register, login, logout
}
