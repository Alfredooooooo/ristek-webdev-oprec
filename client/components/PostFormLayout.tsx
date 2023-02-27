import { checkAccessToken, fetchAccessToken } from '@/lib/fetchCommand';
import { formType, LayoutProps, PostFormLayoutProps } from '@/lib/interface';
import { setIsEditing } from '@/store/slices/formSlices';
import {
    selectLoaderState,
    setLoaderState,
    setShowNotif,
} from '@/store/slices/loaderSlice';
import {
    createCurrentUserPost,
    createPost,
    editCurrentUserPost,
    editPost,
} from '@/store/slices/postsSlices';
import { editBookmarkOnUser, selectUserValue } from '@/store/slices/userSlice';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import PostForm from './PostForm';

const PostFormLayout = ({
    children,
    refreshToken,
    allPosts,
    userProps,
}: PostFormLayoutProps) => {
    const dispatch = useDispatch();
    const loadingState = useSelector(selectLoaderState);
    const user = useSelector(selectUserValue);
    const router = useRouter();

    const showNotif = (message?: string, type?: string) => {
        if (message === undefined && type === undefined) {
            dispatch(
                setShowNotif({
                    show: false,
                })
            );
            return;
        }
        if (type === 'error') {
            dispatch(
                setShowNotif({
                    message: message,
                    type: 'error',
                    show: true,
                })
            );
        } else {
            dispatch(
                setShowNotif({
                    message: message,
                    type: 'success',
                    show: true,
                })
            );
        }
    };

    const handleStart = () => {
        dispatch(
            setLoaderState({
                isRouteChanging: true,
                loadingKey: loadingState.loadingKey ^ 1,
            })
        );
    };

    const handleFinish = () => {
        dispatch(setIsEditing(''));
        dispatch(
            setLoaderState({
                isRouteChanging: false,
            })
        );
    };

    const fetchingAPI = async ({
        accessToken,
        id,
        formData,
    }: Partial<{
        accessToken: string;
        id: string | undefined;
        formData: FormData | undefined;
    }>) => {
        let res;
        if (id) {
            res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: formData,
                }
            );
        } else {
            res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/`, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        }
        const data = await res.json();
        return data;
    };

    const handleOnSubmit = async (postData: formType) => {
        showNotif();
        if (postData.id) {
            const editedPost = allPosts.find((post) => post.id === postData.id);

            const { id, content, image, isCloseFriend } = postData;

            handleStart();
            let accessToken;

            accessToken = await fetchAccessToken(refreshToken);

            const status = checkAccessToken(accessToken);
            if (status === false) {
                router.push('/login');
                handleFinish();
                return;
            }

            if (
                content === undefined &&
                image === undefined &&
                isCloseFriend === undefined
            ) {
                const data = await fetchingAPI({
                    accessToken,
                    id: id,
                });
                handleFinish();
                showNotif(data.message, 'error');
            } else {
                let block = false;
                const formData = new FormData();

                if (content === undefined && image === undefined) {
                    formData.append('isCloseFriend', isCloseFriend.toString());
                } else if (
                    content === undefined &&
                    isCloseFriend === undefined
                ) {
                    if (image === '') {
                        block = true;
                    } else {
                        formData.append('image', image as File);
                    }
                } else if (image === undefined && isCloseFriend === undefined) {
                    formData.append('content', content);
                } else if (content === undefined) {
                    if (image === '') {
                        block = true;
                    } else {
                        formData.append('image', image as File);
                    }
                    formData.append('isCloseFriend', isCloseFriend.toString());
                } else if (image === undefined) {
                    formData.append('content', content);
                    formData.append('isCloseFriend', isCloseFriend.toString());
                } else if (isCloseFriend === undefined) {
                    formData.append('content', content);
                    if (image === '') {
                        block = true;
                    } else {
                        formData.append('image', image as File);
                    }
                } else {
                    formData.append('content', content);
                    formData.append('isCloseFriend', isCloseFriend.toString());
                    if (image === '') {
                        block = true;
                    } else {
                        formData.append('image', image as File);
                    }
                }

                if (block) {
                    handleFinish();
                    showNotif('Please upload an image', 'error');
                } else {
                    const data = await fetchingAPI({
                        accessToken,
                        id,
                        formData,
                    });
                    dispatch(editPost({ ...editedPost, ...data.content }));
                    dispatch(
                        editCurrentUserPost({ ...editedPost, ...data.content })
                    );
                    dispatch(
                        editBookmarkOnUser({ ...editedPost, ...data.content })
                    );
                    handleFinish();

                    showNotif(
                        data.message.split('!')[0] + ' successfully!',
                        'success'
                    );
                }
            }
        } else {
            const formData = new FormData();
            formData.append('image', postData.image as File);
            formData.append('content', postData.content);
            formData.append('isCloseFriend', postData.isCloseFriend.toString());

            handleStart();
            let accessToken;

            accessToken = await fetchAccessToken(refreshToken);

            const status = checkAccessToken(accessToken);
            if (status === false) {
                router.push('/login');
                handleFinish();
                return;
            }

            const data = await fetchingAPI({ accessToken, formData });
            dispatch(createPost(data.content));
            dispatch(createCurrentUserPost(data.content));
            handleFinish();
            showNotif(data.message.split('!')[0] + ' successfully', 'success');
        }
    };

    return (
        <>
            {user?.id === userProps.id && (
                <PostForm
                    onSubmit={handleOnSubmit}
                    profilePicture={
                        user?.profilePicture || userProps?.profilePicture
                    }
                />
            )}
            {children}
        </>
    );
};

export default PostFormLayout;
