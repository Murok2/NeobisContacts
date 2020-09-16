import * as axios from "axios";
const instance = axios.create({
    baseURL: 'https://my-json-server.typicode.com/RomanChasovitin/demo-api/'
})

export const getUsersApi = () => instance.get('users');