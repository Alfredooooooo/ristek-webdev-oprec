import { formType } from '@/lib/interface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface typeForState {
    value: formType;
    isEditing: string;
    editErrorMessage: string;
    initialIsCloseFriend: boolean;
    initialContent: string;
    initialImage: string;
}

const initialState: typeForState = {
    value: {
        id: '',
        content: '',
        image: '',
        isCloseFriend: false,
    },
    isEditing: '',
    editErrorMessage: '',
    initialIsCloseFriend: false,
    initialContent: '',
    initialImage: '',
};

export const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        setForm: (state, action: PayloadAction<formType>) => {
            state.value = action.payload;
        },
        setIsEditing: (state, action: PayloadAction<string>) => {
            state.isEditing = action.payload;
        },
        setEditErrorMessage: (state, action: PayloadAction<string>) => {
            state.editErrorMessage = action.payload;
        },
        setInitialIsCloseFriend: (state, action: PayloadAction<boolean>) => {
            state.initialIsCloseFriend = action.payload;
        },
        setInitialContent: (state, action: PayloadAction<string>) => {
            state.initialContent = action.payload;
        },
        setInitialImage: (state, action: PayloadAction<string>) => {
            state.initialImage = action.payload;
        },
    },
});

export const {
    setForm,
    setIsEditing,
    setEditErrorMessage,
    setInitialIsCloseFriend,
    setInitialContent,
    setInitialImage,
} = formSlice.actions;
export const selectFormValue = (state: RootState) => state.form.value;
export const selectIsEditing = (state: RootState) => state.form.isEditing;
export const selectEditErrorMessage = (state: RootState) =>
    state.form.editErrorMessage;
export const selectInitialIsCloseFriend = (state: RootState) =>
    state.form.initialIsCloseFriend;
export const selectInitialContent = (state: RootState) =>
    state.form.initialContent;

export const selectInitialImage = (state: RootState) => state.form.initialImage;

export default formSlice.reducer;
