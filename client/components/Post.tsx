import {
    selectDeleteModalValue,
    setOpenDelete,
} from '@/store/slices/modalSlices';
import {
    selectIsEditing,
    setForm,
    setInitialContent,
    setInitialImage,
    setInitialIsCloseFriend,
    setIsEditing,
} from '@/store/slices/formSlices';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProfilePicture from './ProfilePicture';
import moment from 'moment';
import {
    deleteBookmarkOnUser,
    selectRefreshToken,
    selectUserValue,
    createBookmarkOnUser,
} from '@/store/slices/userSlice';
import { PostProps, User } from '@/lib/interface';
import { useRouter } from 'next/router';
import {
    selectLoaderState,
    setLoaderState,
    setShowNotif,
} from '@/store/slices/loaderSlice';
import { checkAccessToken, fetchAccessToken } from '@/lib/fetchCommand';
import { deleteBookmark, setBookmark } from '@/store/slices/postsSlices';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Post = ({
    idPost,
    content,
    image,
    isCloseFriend,
    createdAt,
    createdBy,
    currentUser,
}: PostProps) => {
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const loadingState = useSelector(selectLoaderState);
    const isEditingGlobal = useSelector(selectIsEditing);
    const isThisDeletedPost = useSelector(selectDeleteModalValue);
    const dispatch = useDispatch();
    const user = useSelector(selectUserValue);
    const refreshToken = useSelector(selectRefreshToken);

    function expand(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        setDropdownOpen((prev) => !prev);
    }

    function setDispatchOnEdit() {
        if (isEditingGlobal === idPost) {
            dispatch(setIsEditing(''));
            dispatch(
                setForm({
                    id: '',
                    content: '',
                    image: '',
                    isCloseFriend: false,
                })
            );
        } else {
            dispatch(setIsEditing(idPost));
            dispatch(
                setForm({
                    id: idPost,
                    content,
                    image,
                    isCloseFriend,
                })
            );
            dispatch(setInitialIsCloseFriend(isCloseFriend));
            dispatch(setInitialContent(content));
            dispatch(setInitialImage(image));
        }
    }

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
        dispatch(
            setLoaderState({
                isRouteChanging: false,
            })
        );
    };

    const fetchingAPI = async (accessToken: string) => {
        const body = {
            postId: idPost,
        };
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/bookmarks/`,
            {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }
        );

        return await res.json();
    };

    const handleBookmark = async () => {
        showNotif();
        handleStart();

        let accessToken;

        accessToken = await fetchAccessToken(refreshToken!);

        const status = checkAccessToken(accessToken);
        if (status === false) {
            router.push('/');
            handleFinish();
            return;
        }

        const data = await fetchingAPI(accessToken!);

        if (data.content === null) {
            dispatch(deleteBookmark(idPost));
            dispatch(deleteBookmarkOnUser(idPost));
            dispatch(
                setShowNotif({
                    show: true,
                    message: `Unbookmarked ${
                        createdBy.fullName.split(' ')[0]
                    }'s post successfully`,
                    type: 'success',
                })
            );
        } else {
            dispatch(setBookmark(data.content));
            dispatch(createBookmarkOnUser(data.content));
            dispatch(
                setShowNotif({
                    show: true,
                    message: `Bookmarked ${
                        createdBy.fullName.split(' ')[0]
                    }'s post successfully`,
                    type: 'success',
                })
            );
        }
        handleFinish();
        // dispatch(setUser({ ...user, bookmarks: [...user.bookmarks, idPost] }));
    };

    return (
        <motion.div
            className={`shadow-md  rounded-md mb-5 transition-all duration-300 ease-in-out p-4 ${
                isThisDeletedPost === idPost
                    ? 'shadow-red-300'
                    : 'shadow-gray-300'
            } ${
                isEditingGlobal === idPost
                    ? 'shadow-yellow-300'
                    : 'shadow-gray-300'
            }`}
            initial={{ opacity: 0, x: 10, y: 10 }}
            whileInView={{
                opacity: 1,
                x: 0,
                y: 0,
                transition: {
                    duration: 0.5,
                },
            }}
            viewport={{ once: true }}
        >
            <div className="flex gap-3 items-center">
                <Link
                    href={`/profile/${createdBy?.id}`}
                    className="hidden xs:block"
                >
                    <span className="cursor-pointer">
                        <ProfilePicture
                            profilePicture={
                                user?.id === createdBy?.id
                                    ? user.profilePicture
                                    : createdBy?.profilePicture
                            }
                        />
                    </span>
                </Link>
                <div className="grow">
                    <Link href={`/profile/${createdBy?.id}`} className="inline">
                        <span className="mr-1 font-semibold cursor-pointer hover:underline">
                            {createdBy?.fullName}
                        </span>
                    </Link>
                    <span className="hidden xxs:inline">shared a post</span>
                    <p className="text-gray-500 text-sm">
                        {moment(createdAt)
                            .format('MMMM Do YYYY, h:mm:ss a')
                            .toString()}
                    </p>
                </div>
                <button className="relative" onClick={handleBookmark}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 transition duration-300 ease-in-out"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill={`${
                                user === undefined
                                    ? currentUser.bookmarks.some((bookmark) => {
                                          return bookmark.postId === idPost;
                                      })
                                        ? 'white'
                                        : 'none'
                                    : user.bookmarks.some((bookmark) => {
                                          return bookmark.postId === idPost;
                                      })
                                    ? 'white'
                                    : 'none'
                            }`}
                            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                        />
                    </svg>
                </button>
                {user?.id === createdBy?.id && (
                    <div className="relative">
                        <button className="text-gray-400" onClick={expand}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                                />
                            </svg>
                        </button>
                        <div className="relative">
                            {dropdownOpen && (
                                <div className="absolute right-0 top-2 shadow-md shadow-gray-300 p-3 rounded-sm border border-gray-100 w-40 sm:w-52 bg-bgWeb z-10">
                                    <button
                                        type="button"
                                        className="flex gap-3 py-2 my-2 hover:bg-socialBlue hover:text-white -mx-4 px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300"
                                        onClick={() => {
                                            dispatch(setOpenDelete(idPost));
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                            />
                                        </svg>
                                        Delete Post
                                    </button>
                                    <button
                                        className="flex gap-3 py-2 my-2 hover:bg-socialBlue hover:text-white -mx-4 px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300"
                                        onClick={() => {
                                            setDispatchOnEdit();
                                            setDropdownOpen(false);
                                            isEditingGlobal !== idPost
                                                ? router.replace('#postForm')
                                                : router.replace('#');
                                        }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                                            />
                                        </svg>
                                        {idPost === isEditingGlobal
                                            ? 'Cancel Edit'
                                            : 'Edit Post'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div>
                <p className="my-3 text-sm break-words">{content}</p>
                <div className="rounded-md overflow-hidden">
                    <img src={image as string} alt="" />
                </div>
            </div>
        </motion.div>
    );
};

export default Post;
