import { TotalRegisterProps } from '@/lib/interface';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface typeForState {
    currentStepIndex: number;
    formData: TotalRegisterProps;
    fileString: string;
    errorRegisterMessage: string;
    errorLoginMessage: string;
    notifyRegister: string;
}

const initialState: typeForState = {
    currentStepIndex: 0,
    formData: {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        bio: '',
        profilePicture: undefined as unknown as File,
    },
    fileString: '',
    errorRegisterMessage: '',
    errorLoginMessage: '',
    notifyRegister: '',
};

export const registerSlice = createSlice({
    name: 'register',
    initialState,
    reducers: {
        setNextStepIndex: (state) => {
            state.currentStepIndex += 1;
        },
        setBackStepIndex: (state) => {
            state.currentStepIndex -= 1;
        },
        setFormData: (state, action) => {
            state.formData = { ...state.formData, ...action.payload };
        },
        setFileString: (state, action) => {
            state.fileString = action.payload;
        },
        resetStepIndex: (state) => {
            state.currentStepIndex = 0;
        },
        setErrorRegisterMessage: (state, action) => {
            state.errorRegisterMessage = action.payload;
        },
        setErrorLoginMessage: (state, action) => {
            state.errorLoginMessage = action.payload;
        },
        setNotifyRegister: (state, action) => {
            state.notifyRegister = action.payload;
        },
    },
});

export const {
    setNextStepIndex,
    setBackStepIndex,
    setFormData,
    setFileString,
    resetStepIndex,
    setErrorRegisterMessage,
    setErrorLoginMessage,
    setNotifyRegister,
} = registerSlice.actions;
export const selectCurrentStepIndex = (state: RootState) =>
    state.register.currentStepIndex;
export const selectFormData = (state: RootState) => state.register.formData;
export const selectFileString = (state: RootState) => state.register.fileString;
export const selectErrorRegisterMessage = (state: RootState) =>
    state.register.errorRegisterMessage;
export const selectErrorLoginMessage = (state: RootState) =>
    state.register.errorLoginMessage;
export const selectNotifyRegister = (state: RootState) =>
    state.register.notifyRegister;

export default registerSlice.reducer;
