import { BACKEND_URL } from "./constants";
import axios, { AxiosResponse, AxiosInstance } from "axios";
import { getFromSecureStore } from "./storage";
import { Session } from "../hooks/authentication/authentication";

interface IRequestMethods {
  get<T>(url: string, config?: any): Promise<T>;
  post<T>(url: string, body: any): Promise<T>;
  put<T>(url: string, body: any): Promise<T>;
  del<T>(url: string): Promise<T>;
  patch<T>(url: string, body: any): Promise<T>;
}

const instances = {
  test: BACKEND_URL,
};

const getSchool = async () => {
  const data: string = await getFromSecureStore("session");
  const session: Session = JSON.parse(data);
  const school = session?.user?.school?.domain?.slug ?? null;

  return school;
};

const getToken = async () => {
  // return "test";

  const data: string = await getFromSecureStore("session");
  const session = JSON.parse(data);

  const token = session?.backendToken?.accessToken ?? null;

  return token;
};

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const createInstance = (type: "test"): AxiosInstance => {
  const instance = axios.create({
    baseURL: instances[type],
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
      "Access-Control-Max-Age": "86400",
    },
  });

  if (type === "test") {
    instance.interceptors.request.use(async (config) => {
      const school = await getSchool();
      const token = await getToken();
      // console.log("Token: ", token);
      // console.log("School: ", school);

      if (school) {
        if (token) config.headers!.Authorization = `Bearer ${token}`;
      }

      return config;
    });
  }

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        //   const school = getSchool();
        switch (error.request.status) {
          case 400:
            console.error("Bad request", error.response);
            break;
          case 401:
            console.error("Unauthorized", error.response);
            break;
          case 405:
            console.error("Method not allowed", error.response);
            break;
          case 500:
            console.error("Internal Server Error", error.response);
            break;
          default:
            console.error("Unknown Error", error.response);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const createRequests = (type: "test"): IRequestMethods => {
  const axiosInstance = createInstance(type);
  return {
    get: <T>(url: string, config: any = undefined) =>
      axiosInstance.get<T>(url, config).then(responseBody),
    post: <T>(url: string, body: any) =>
      axiosInstance.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: any) =>
      axiosInstance.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axiosInstance.delete<T>(url).then(responseBody),
    patch: <T>(url: string, body: any) =>
      axiosInstance.patch<T>(url, body).then(responseBody),
  };
};

const requests: IRequestMethods = createRequests("test");

export { requests };
