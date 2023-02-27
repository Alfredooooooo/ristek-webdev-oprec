import '@splidejs/react-splide/css';
import Card from '@/components/Card';
import Layout from '@/components/Layout';
import Post from '@/components/Post';
import PostFormLayout from '@/components/PostFormLayout';
import ProfilePicture from '@/components/ProfilePicture';
import {
    checkAccessToken,
    fetchAccessToken,
    findCurrentUser,
    findUser,
    findUserById,
} from '@/lib/fetchCommand';
import { ProfileIdProps, User } from '@/lib/interface';
import {
    selectLoaderState,
    setLoaderState,
    setShowNotif,
} from '@/store/slices/loaderSlice';
import {
    selectCurrentUserPostsValue,
    selectPostsValue,
    setCurrentUserPosts,
    setPosts,
} from '@/store/slices/postsSlices';
import {
    selectUserValue,
    setRefreshToken,
    setUser,
} from '@/store/slices/userSlice';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostBookmark from '@/components/PostBookmark';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.query;

    const refreshToken = context.req.cookies.refreshToken;

    if (!refreshToken) {
        return {
            redirect: {
                destination: '/login',
            },
            props: {},
        };
    }

    let accessToken;

    accessToken = await fetchAccessToken(refreshToken);

    const status = checkAccessToken(accessToken, context);
    if (status === false) {
        return {
            redirect: {
                destination: '/login',
            },
            props: {},
        };
    }

    const userId = context.req.cookies.userId!;

    let userLogin;
    userLogin = await findUserById(userId, accessToken!);

    let user;
    user = await findCurrentUser(id as string);

    if (!user) {
        return {
            notFound: true,
            props: {
                message: 'User not found',
            },
        };
    }

    user = JSON.parse(JSON.stringify(user));

    let users;
    users = await findUser(accessToken!);

    if (users === undefined) {
        users = [];
    } else {
        users = JSON.parse(JSON.stringify(users));
    }

    return {
        props: {
            userLogin,
            currentUser: user,
            refreshToken,
            currentUserPosts: user.posts,
            users: users,
        },
    };
};

const ProfileId = ({
    currentUser,
    userLogin,
    refreshToken,
    currentUserPosts,
    users,
}: ProfileIdProps) => {
    const [isBioOpen, setIsBioOpen] = useState(true);
    const loadingState = useSelector(selectLoaderState);
    const dispatch = useDispatch();
    const user = useSelector(selectUserValue);
    const [isEditing, setIsEditing] = useState(false);
    const currentBio = useRef<HTMLTextAreaElement>(null);
    const router = useRouter();
    const allPosts = useSelector(selectCurrentUserPostsValue);

    const filteredPosts = useMemo(() => {
        if (allPosts === undefined) return;
        return allPosts.filter(
            (post) =>
                currentUser.id === userLogin.id ||
                (post.isCloseFriend === true
                    ? currentUser.closeFriend.includes(userLogin.id)
                    : true)
        );
    }, [allPosts, currentUserPosts, currentUser]);

    useEffect(() => {
        dispatch(setCurrentUserPosts(currentUserPosts));
        dispatch(setUser(userLogin));
        dispatch(setRefreshToken(refreshToken));
    }, []);

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

    const handleFinish = (status?: boolean, data?: any) => {
        dispatch(
            setLoaderState({
                isRouteChanging: false,
            })
        );
        if (status === false) return;
        setIsEditing(false);
        if (status === true) {
            dispatch(setUser(data.content));
        }
    };

    const fetchingAPI = async (accessToken: string, formData?: FormData) => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user/`,
            {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: formData,
            }
        );
        const data = await res.json();

        return data;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        showNotif();
        const bio = currentBio.current?.value;

        handleStart();

        let accessToken;

        accessToken = await fetchAccessToken(refreshToken!);

        const status = checkAccessToken(accessToken);
        if (status === false) {
            router.push('/');
            handleFinish();
            return;
        }

        const formData = new FormData();

        if (bio === user?.bio) {
            const data = await fetchingAPI(accessToken!);
            handleFinish(false);
            showNotif(data.message, 'error');
            return;
        }
        formData.append('bio', bio!);

        const data = await fetchingAPI(accessToken!, formData);

        handleFinish(true, data);
        showNotif('Bio ' + data.message.toLowerCase(), 'success');
    };

    const decidePage = () => {
        return user?.bookmarks.length > 1 ? 2 : 1;
    };

    return (
        <>
            <Head>
                <title>{currentUser.fullName.split(' ')[0]}'s Profile</title>
            </Head>
            <Layout
                profilePicture={
                    userLogin.id === currentUser.id
                        ? user?.profilePicture || userLogin?.profilePicture
                        : userLogin?.profilePicture
                }
                refreshToken={refreshToken}
                users={users}
            >
                <Card padding="8">
                    <div className="flex flex-col items-center gap-2 p-4 w-full h-full ">
                        <ProfilePicture
                            size="lg"
                            profilePicture={
                                userLogin?.id === currentUser.id
                                    ? user?.profilePicture ||
                                      userLogin?.profilePicture
                                    : currentUser.profilePicture
                            }
                            allowEdit={currentUser.id === userLogin?.id}
                            refreshToken={refreshToken}
                            showNotif={showNotif}
                        />
                        <h1 className="text-white font-bold text-3xl text-center">
                            {currentUser.fullName}
                        </h1>
                        <button
                            className="relative items-center mt-3 justify-center p-0.5 mb-2 mr-2 overflow-hidden rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white text-white focus:ring-4 focus:outline-none focus:ring-purple-800"
                            onClick={() => {
                                setIsBioOpen((prev) => !prev);
                            }}
                        >
                            <span className="relative px-4 py-2 xs:px-5 xs:py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0 flex gap-3 items-center justify-center">
                                <span className="text-sm font-bold xs:text-xl">
                                    {isBioOpen ? 'Hide Bio' : 'Show Bio'}
                                </span>
                                {isBioOpen && (
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
                                            d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                )}
                                {!isBioOpen && (
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
                                            d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                )}
                            </span>
                        </button>

                        {isBioOpen && (
                            <>
                                {currentUser.id === userLogin.id &&
                                isEditing ? (
                                    <>
                                        <form
                                            className="flex flex-col gap-5 w-full items-center mt-2 justify-center animate-opacity duration-300 ease-in-out"
                                            onSubmit={handleSubmit}
                                        >
                                            <textarea
                                                id="message"
                                                rows={4}
                                                className="block p-2.5 w-full h-60 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="Write your bio here..."
                                                required
                                                defaultValue={currentUser.bio}
                                                ref={currentBio}
                                            ></textarea>
                                            <div className="sm:flex sm:flex-row flex-col text-center">
                                                <button
                                                    className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white text-white focus:ring-4 focus:outline-none focus:ring-pink-800"
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                    }}
                                                >
                                                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 w-full rounded-md group-hover:bg-opacity-0 font-bold">
                                                        Cancel Edit
                                                    </span>
                                                </button>
                                                <button
                                                    className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-bold text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                                                    type="submit"
                                                >
                                                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0 text-white">
                                                        Update Bio
                                                    </span>
                                                </button>
                                            </div>
                                        </form>
                                    </>
                                ) : (
                                    <div className="animate-opacity duration-300 ease-in-out flex flex-col items-center justify-center w-full">
                                        <div
                                            className={`text-center text-xl mt-1 p-4 text-white w-full break-words`}
                                        >
                                            {currentUser.id === userLogin.id
                                                ? user?.bio[0].toUpperCase() +
                                                      user?.bio.slice(1) ||
                                                  userLogin.bio[0].toUpperCase() +
                                                      userLogin.bio.slice(1)
                                                : currentUser.bio[0].toUpperCase() +
                                                  currentUser.bio.slice(1)}
                                        </div>
                                        {currentUser.id === userLogin.id && (
                                            <div>
                                                <button
                                                    className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm text-white font-bold rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-800"
                                                    onClick={() =>
                                                        setIsEditing(true)
                                                    }
                                                >
                                                    <span className="relative px-5 sm:px-12 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                                        Edit Bio
                                                    </span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </Card>
                <PostFormLayout
                    allPosts={filteredPosts!}
                    refreshToken={refreshToken}
                    userProps={currentUser}
                >
                    {filteredPosts!.map((post) => {
                        return (
                            <Post
                                key={post.id}
                                idPost={post.id}
                                content={post.content}
                                image={post.image}
                                createdAt={post.createdAt}
                                createdBy={currentUser}
                                isCloseFriend={post.isCloseFriend}
                                Bookmarks={post.Bookmarks}
                                currentUser={currentUser}
                            />
                        );
                    })}
                </PostFormLayout>
                {currentUser.id === user?.id && (
                    <>
                        <h3 className="2xl:text-5xl lg:text-4xl md:text-2xl text-3xl font-bold text-primary my-10 text-center">
                            Bookmarked List
                        </h3>
                        {user?.bookmarks.length !== 0 && (
                            <Splide
                                options={{
                                    perPage: decidePage(),
                                    gap: '2rem',
                                    drag: 'free',
                                    autoplay: true,
                                    arrows: false,
                                    pagination: false,
                                    interval: 3000,
                                }}
                            >
                                {currentUser.id === user?.id
                                    ? user?.bookmarks.map(({ posts }) => {
                                          return (
                                              <SplideSlide key={posts.id}>
                                                  <PostBookmark
                                                      key={posts.id}
                                                      idPost={posts.id}
                                                      content={posts.content}
                                                      image={posts.image}
                                                      createdBy={posts.user}
                                                  />
                                              </SplideSlide>
                                          );
                                      })
                                    : currentUser.bookmarks.map(({ posts }) => {
                                          return (
                                              <SplideSlide key={posts.id}>
                                                  <PostBookmark
                                                      key={posts.id}
                                                      idPost={posts.id}
                                                      content={posts.content}
                                                      image={posts.image}
                                                      createdBy={posts.user}
                                                  />
                                              </SplideSlide>
                                          );
                                      })}
                            </Splide>
                        )}
                        {user?.bookmarks.length === 0 && (
                            <div className="text-2xl text-center text-primary font-bold uppercase tracking-wide">
                                No bookmarks to be found. Go add something!
                            </div>
                        )}
                    </>
                )}

                {/* {currentUser.id === user?.id ? user?.bookmarks.length === 0 && <div>No Bookmark</div> : } */}
            </Layout>
        </>
    );
};

export default ProfileId;
