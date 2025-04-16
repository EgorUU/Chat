// src/store/reducers/loginReducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";



interface LoginState {
    name: string,
  email: string;
  password: string;
}

const initialState: LoginState = {
  name: "",
  email: "",
  password: ""
};

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setNameReg: (state, action: PayloadAction<string>) => {
        state.name = action.payload;
    },
    setEmailReg: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPasswordReg: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    }
  }
});

// Правильный экспорт:
export default registerSlice.reducer; // Дефолтный экспорт редюсера
export const { setEmailReg, setPasswordReg, setNameReg } = registerSlice.actions; // Именованный экспорт экшенов