import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../Fetures/Login/LoginSlice";
import { combineReducers } from "@reduxjs/toolkit";
 
export const store =  configureStore({
    reducer : loginReducer
});