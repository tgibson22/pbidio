import http from "./axiosService";
import {InputUrl} from './types'
import {AxiosResponse} from "axios";


class UrlDataService {
    getAll(): Promise<AxiosResponse> {
        return http.get("/");
    }

    shortenUrl(inputUrl: InputUrl) {
        return http.post("/", {"url" : inputUrl});
    }
}

export const urlDataService = new UrlDataService();
