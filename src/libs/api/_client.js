import axios from "axios";
import { history } from "../../index";

const client = axios.create();

client.defaults.baseURL = "http://localhost:3000/";

// 응답에 대한 요청을 가로채서 해당하는 부분으로 이동
client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { status, data } = error.response;
    console.log(status);

    if (status === 401) {
      history.push("/addprofile");
    }

    return Promise.reject(error);
  }
);

export default client;
