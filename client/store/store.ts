import { configureStore } from '@reduxjs/toolkit';
import formReducer from './slices/formSlices';
import postReducer from './slices/postsSlices';
import closeFriendModalReducer from './slices/modalSlices';
import registerReducer from './slices/registerSlice';
import userReducer from './slices/userSlice';
import loaderReducer from './slices/loaderSlice';

export const store = configureStore({
    reducer: {
        form: formReducer,
        posts: postReducer,
        closeFriendModal: closeFriendModalReducer,
        register: registerReducer,
        user: userReducer,
        loader: loaderReducer,
    },
    devTools: true,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// export const wrapper = createWrapper(makeStore);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
