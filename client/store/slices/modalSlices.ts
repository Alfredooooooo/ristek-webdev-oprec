import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface typeForState {
    closeFriend: boolean;
    delete: string;
}

const initialState: typeForState = {
    closeFriend: false,
    delete: '',
};

export const closeFriendModalSlices = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setOpenCloseFriend: (state, action: PayloadAction<boolean>) => {
            state.closeFriend = action.payload;
        },

        setOpenDelete: (state, action: PayloadAction<string>) => {
            state.delete = action.payload;
        },
    },
});

export const { setOpenCloseFriend, setOpenDelete } =
    closeFriendModalSlices.actions;
export const openCloseFriendModalValue = (state: RootState) =>
    state.closeFriendModal.closeFriend;
export const selectDeleteModalValue = (state: RootState) =>
    state.closeFriendModal.delete;
export default closeFriendModalSlices.reducer;
