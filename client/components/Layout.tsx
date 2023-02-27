import { checkAccessToken, fetchAccessToken } from '@/lib/fetchCommand';
import { LayoutProps } from '@/lib/interface';
import { setIsEditing } from '@/store/slices/formSlices';
import {
    selectLoaderState,
    selectShowNotif,
    setLoaderState,
    setShowNotif,
} from '@/store/slices/loaderSlice';
import {
    openCloseFriendModalValue,
    selectDeleteModalValue,
    setOpenCloseFriend,
} from '@/store/slices/modalSlices';
import {
    selectCurrentUserPostsValue,
    selectPostsValue,
    setCurrentUserPosts,
    setPosts,
} from '@/store/slices/postsSlices';
import {
    deleteBookmarkOnUser,
    selectUserValue,
} from '@/store/slices/userSlice';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CloseFriendModal from './CloseFriendModal';
import DeleteModal from './DeleteModal';
import LoaderWrap from './LoaderWrap';
import Navigation from './Navigation';
import Notification from './Notification';
import ProfilePicture from './ProfilePicture';

const Layout = ({
    children,
    profilePicture,
    refreshToken,
    users,
}: LayoutProps) => {
    const isCloseFriendOpen = useSelector(openCloseFriendModalValue);
    const isDeleteModalOpen = useSelector(selectDeleteModalValue);
    const allPosts = useSelector(selectPostsValue);
    const currentUserPosts = useSelector(selectCurrentUserPostsValue);
    const user = useSelector(selectUserValue);
    const loadingState = useSelector(selectLoaderState);
    const notificationState = useSelector(selectShowNotif);
    const dispatch = useDispatch();
    const router = useRouter();

    const fetchingAPI = async (accessToken: string, id: string) => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return await res.json();
    };

    const handleCloseFriendModal = () => {
        dispatch(setOpenCloseFriend(!isCloseFriendOpen));
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

    const handleOnDelete = async (idPost: string) => {
        dispatch(setShowNotif({ show: false }));

        handleStart();
        let accessToken;

        accessToken = await fetchAccessToken(refreshToken);

        const status = checkAccessToken(accessToken);
        if (status === false) {
            router.push('/login');
            handleFinish();
            return;
        }

        const data = await fetchingAPI(accessToken!, idPost);

        const newPosts = allPosts.filter((post) => idPost !== post.id);
        const newCurrentUserPosts = currentUserPosts.filter(
            (post) => idPost !== post.id
        );
        dispatch(setPosts(newPosts));
        dispatch(setCurrentUserPosts(newCurrentUserPosts));
        dispatch(deleteBookmarkOnUser(idPost));

        handleFinish();
        dispatch(
            setShowNotif({
                message: data.message.split('!')[0] + ' successfully!',
                type: 'success',
                show: true,
            })
        );
    };

    useEffect(() => {
        if (notificationState.show === true) {
            setTimeout(() => {
                dispatch(setShowNotif({ show: false, message: '', type: '' }));
            }, 4500);
        }
    }, [notificationState]);

    return (
        <>
            {loadingState.isRouteChanging && <LoaderWrap />}
            <div
                className={`bg-bgWeb text-white relative w-screen h-screen overflow-auto`}
            >
                {notificationState.show && (
                    <Notification
                        message={notificationState.message}
                        type={notificationState.type}
                    />
                )}

                <div
                    className={`flex justify-between items-center absolute w-full px-8 py-2 ${
                        loadingState.isRouteChanging && 'pointer-events-none'
                    }`}
                >
                    <Link className="flex items-center gap-2" href="/">
                        <Image
                            src={'/assets/ristek.svg'}
                            width={50}
                            height={50}
                            alt="Ristek"
                        />
                        <p className="font-bold lg:text-3xl text-lg hidden xs:block">
                            RISTEK MedSOS
                        </p>
                    </Link>
                    <Link
                        className="flex items-center xs:gap-2"
                        href={`/profile/${user?.id}`}
                    >
                        <ProfilePicture
                            profilePicture={profilePicture}
                            size="md"
                            userId={user?.id}
                        />
                        <p className="font-bold lg:text-lg text-md hidden xs:block">
                            {user?.fullName.split(' ')[0].toLowerCase()}
                        </p>
                    </Link>
                </div>
                <div
                    className={`absolute left-1/2 -translate-x-1/2 w-[80%] lg:flex lg:flex-wrap mt-[6rem] ${
                        loadingState.isRouteChanging && 'pointer-events-none'
                    } ${
                        isCloseFriendOpen || isDeleteModalOpen
                            ? 'pointer-events-none'
                            : ''
                    }`}
                >
                    <div
                        className={`px-8 py-4 lg:w-[22.5%] w-full mt-[0.3125rem]`}
                    >
                        <Navigation
                            handleCloseFriendModal={handleCloseFriendModal}
                        />
                    </div>
                    <div
                        className={`sm:flex-grow p-4 overflow-hidden lg:w-[77.5%]`}
                    >
                        {children}
                    </div>
                </div>
            </div>
            {isDeleteModalOpen && (
                <DeleteModal handleOnDelete={handleOnDelete} />
            )}

            {isCloseFriendOpen && (
                <CloseFriendModal
                    users={users}
                    refreshToken={refreshToken}
                    handleCloseFriendModal={handleCloseFriendModal}
                />
            )}
        </>
    );
};

export default Layout;
