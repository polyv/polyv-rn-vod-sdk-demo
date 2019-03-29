import axios from 'axios';

const token = 'token';
const headers = {
    Accept: 'application/json;charset=utf-8',
    'Content-Type': 'application/json;charset=utf-8',
    'Accept-Encoding': 'gzip, deflate',
};

export function setAxios() {
    console.log('init http')
    axios.defaults.headers = headers;
    axios.defaults.headers['x-auth-token'] = token;
    // 添加请求拦截器
    axios.interceptors.response.use((response) => {
        const { config, data, request} = response;
        console.log('请求的url: ', `${config.method}:${request.responseURL}`);
        console.log('token: ', config.headers['x-auth-token']);
        console.log('请求body: ', config.data ? JSON.parse(config.data) : undefined);
        console.log('返回值: ', data);
        
        if (data.code === 200 || data.data ) {
            return Promise.resolve(data);
        }
        return Promise.reject(data);
    })
}
