import { Bookmarks, PostType, User } from '@/lib/interface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface typeForState {
    value: User;
    refreshToken: string;
}

const initialState: typeForState = {
    value: undefined as unknown as User,
    refreshToken: undefined as unknown as string,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.value = action.payload;
        },
        setRefreshToken: (state, action: PayloadAction<string>) => {
            state.refreshToken = action.payload;
        },

        createBookmarkOnUser: (state, action: PayloadAction<Bookmarks>) => {
            state.value.bookmarks = [...state.value.bookmarks, action.payload];
        },

        editBookmarkOnUser: (state, action: PayloadAction<PostType>) => {
            state.value.bookmarks = state.value.bookmarks.map(
                (bookmark: Bookmarks) => {
                    if (bookmark.postId === action.payload.id) {
                        return {
                            ...bookmark,
                            posts: action.payload,
                        };
                    }
                    return bookmark;
                }
            );
        },

        deleteBookmarkOnUser: (state, action: PayloadAction<string>) => {
            state.value.bookmarks = state.value.bookmarks.filter(
                (bookmark: Bookmarks) => bookmark.postId !== action.payload
            );
        },
    },
});

export const {
    setUser,
    setRefreshToken,
    createBookmarkOnUser,
    editBookmarkOnUser,
    deleteBookmarkOnUser,
} = userSlice.actions;
export const selectUserValue = (state: RootState) => state.user.value;
export const selectRefreshToken = (state: RootState) => state.user.refreshToken;

export default userSlice.reducer;
