import { Bookmarks, PostType } from '@/lib/interface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface typeForState {
    value: PostType[];
    currentUserPosts: PostType[];
}

const initialState: typeForState = {
    value: [],
    currentUserPosts: [],
};

export const postsSlices = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        createPost: (state, action: PayloadAction<PostType>) => {
            state.value = [action.payload, ...state.value];
        },

        editPost: (state, action: PayloadAction<PostType>) => {
            state.value = state.value.map((post: PostType) => {
                if (post.id === action.payload.id) {
                    return {
                        ...post,
                        ...action.payload,
                    };
                }
                return post;
            });
        },

        setPosts: (state, action: PayloadAction<PostType[]>) => {
            state.value = action.payload;
        },

        setCurrentUserPosts: (state, action: PayloadAction<PostType[]>) => {
            state.currentUserPosts = action.payload;
        },

        createCurrentUserPost: (state, action: PayloadAction<PostType>) => {
            state.currentUserPosts = [
                action.payload,
                ...state.currentUserPosts,
            ];
        },

        editCurrentUserPost: (state, action: PayloadAction<PostType>) => {
            state.currentUserPosts = state.currentUserPosts.map(
                (post: PostType) => {
                    if (post.id === action.payload.id) {
                        return {
                            ...post,
                            ...action.payload,
                        };
                    }
                    return post;
                }
            );
        },

        setBookmark: (state, action: PayloadAction<Bookmarks>) => {
            state.value = state.value.map((post: PostType) => {
                if (post.id === action.payload.postId) {
                    return {
                        ...post,
                        Bookmarks: [action.payload, ...post.Bookmarks],
                    };
                }
                return post;
            });
            state.currentUserPosts = state.currentUserPosts.map(
                (post: PostType) => {
                    if (post.id === action.payload.postId) {
                        return {
                            ...post,
                            Bookmarks: [action.payload, ...post.Bookmarks],
                        };
                    }
                    return post;
                }
            );
        },

        deleteBookmark: (state, action: PayloadAction<string>) => {
            state.value = state.value.map((post: PostType) => {
                if (post.id === action.payload) {
                    return {
                        ...post,
                        Bookmarks: post.Bookmarks.filter(
                            (bookmark) => bookmark.postId !== action.payload
                        ),
                    };
                }
                return post;
            });
            state.currentUserPosts = state.currentUserPosts.map(
                (post: PostType) => {
                    if (post.id === action.payload) {
                        return {
                            ...post,
                            Bookmarks: post.Bookmarks.filter(
                                (bookmark) => bookmark.postId !== action.payload
                            ),
                        };
                    }
                    return post;
                }
            );
        },
    },
});

export const {
    createPost,
    editPost,
    setPosts,
    setCurrentUserPosts,
    createCurrentUserPost,
    editCurrentUserPost,
    setBookmark,
    deleteBookmark,
} = postsSlices.actions;
export const selectPostsValue = (state: RootState) => state.posts.value;
export const selectCurrentUserPostsValue = (state: RootState) =>
    state.posts.currentUserPosts;
export default postsSlices.reducer;
