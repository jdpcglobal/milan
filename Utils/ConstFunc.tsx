import { useDispatch, useSelector } from "react-redux";
import { LoginState } from "./Types";
import { saveToken, removeToken } from "../Fetures/Login/LoginSlice";

const dispatch = useDispatch();
export const getAuthToken = () => {
    const token : string = useSelector((state : LoginState) => state.logins.auth_token);
    return token;
}

export const saveAuthToken = (token:string) => {
    dispatch(saveToken(token));
}

export const removeAuthToken = () => {
    dispatch(removeToken())
}