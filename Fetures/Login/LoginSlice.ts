import { PayloadAction, createSlice } from "@reduxjs/toolkit";
 
// // Define the initial state using that type
// interface LoginState {
//     logins: {
//         auth_token: string;
//     };
// }

// Define the initial state using that type
const initialState = {
    logins: {
        auth_token: ''
    }
};
 
export const LoginSlice = createSlice(
    {
        name : 'login',
        initialState, 
        reducers : {
            saveToken : (state,action) => {
                   state.logins.auth_token = action.payload
            },
            removeToken : (state) => {
                state.logins.auth_token = ""
            }
        }
    }
);

export const {saveToken,removeToken} = LoginSlice.actions;
export default LoginSlice.reducer;