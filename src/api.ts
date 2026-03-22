import axios from "axios";

export const serverApi = axios.create({
    baseURL: location.origin + "/api",
});