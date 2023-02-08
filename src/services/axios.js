import axios from 'axios';


const instance = axios.create({
    baseURL: "http://localhost:5000"
});

instance.interceptors.request.use(function (config) {
    config.baseURL = "http://localhost:5000"
    if (document.cookie) {
        var re = new RegExp("AUTH-TOKEN=([^;]+)");
        var value = re.exec(document.cookie);
        const token = (value != null) ? unescape(value[1]) : null;
        if (token) { config.headers.auth_token = token }
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return Promise.reject(error);
});

export default instance;