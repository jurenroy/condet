import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/"
});

export function createUserProfile(data, headers) {
  return api.post("api/v1/accounts/users/", data, headers);
}

export function UserLogin(data, headers) {
  return api.post("api/v1/accounts/token/login", data, headers);
}
export function UserRegistration (data, headers){
  return api.post ("api/v1/accounts/registration")
}