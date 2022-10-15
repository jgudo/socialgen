import axios, { AxiosRequestConfig } from "axios";
import { startLogout } from "~/redux/slice/authSlice";
import { store } from '~/redux/store/store2';

const foodieUrl = import.meta.env.VITE_API_URL || 'http://localhost:9000';
const foodieApiVersion = import.meta.env.VITE_API_VERSION || 'v1';
axios.defaults.baseURL = `${foodieUrl}/api/${foodieApiVersion}`;
axios.defaults.withCredentials = true;

let isLogoutTriggered = false;

function resetIsLogoutTriggered() {
  isLogoutTriggered = false;
}

axios.interceptors.response.use(
  response => response,
  error => {
    const { data, status } = error.response;
    if (status === 401
      && (data?.error?.type || '') !== 'INCORRECT_CREDENTIALS'
      && error.config
      && !error.config.__isRetryRequest
    ) {
      if (!isLogoutTriggered) {
        isLogoutTriggered = true;
        store.dispatch(startLogout() as any);
      }
    }
    return Promise.reject(error);
  }
);

const httpRequest = <T>(req: AxiosRequestConfig): Promise<T> => {
  return new Promise(async (resolve, reject) => {
    try {
      const request = await axios(req);

      resolve(request.data.data)
    } catch (e: any) {
      reject(e?.response?.data || {
        status_code: 500
      });
    }
  });
}

export default httpRequest;
