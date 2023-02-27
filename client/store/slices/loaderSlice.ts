import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface loadingStateChild {
    isRouteChanging: boolean;
    loadingKey: number;
}

interface showNotifChild {
    show: boolean;
    message: string;
    type: string;
}

interface typeForState {
    loadingState: loadingStateChild;
    profilePictureChanging: boolean;
    bioChanging: boolean;
    showNotif: showNotifChild;
}

const initialState: typeForState = {
    loadingState: {
        isRouteChanging: false,
        loadingKey: 0,
    },
    profilePictureChanging: false,
    bioChanging: false,
    showNotif: {
        show: false,
        message: '',
        type: '',
    },
};

export const loaderSlice = createSlice({
    name: 'loader',
    initialState,
    reducers: {
        setLoaderState: (
            state,
            action: PayloadAction<Partial<loadingStateChild>>
        ) => {
            state.loadingState = { ...state.loadingState, ...action.payload };
        },
        setProfilePictureChanging: (state, action: PayloadAction<boolean>) => {
            state.profilePictureChanging = action.payload;
        },
        setBioChanging: (state, action: PayloadAction<boolean>) => {
            state.profilePictureChanging = action.payload;
        },
        setShowNotif: (
            state,
            action: PayloadAction<Partial<showNotifChild>>
        ) => {
            state.showNotif = { ...state.showNotif, ...action.payload };
        },
    },
});

export const {
    setLoaderState,
    setProfilePictureChanging,
    setBioChanging,
    setShowNotif,
} = loaderSlice.actions;
export const selectLoaderState = (state: RootState) =>
    state.loader.loadingState;
export const selectProfilePictureChanging = (state: RootState) =>
    state.loader.profilePictureChanging;
export const selectBioChanging = (state: RootState) => state.loader.bioChanging;
export const selectShowNotif = (state: RootState) => state.loader.showNotif;

export default loaderSlice.reducer;
