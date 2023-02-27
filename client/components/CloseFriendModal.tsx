import { checkAccessToken, fetchAccessToken } from '@/lib/fetchCommand';
import { CloseFriendModalProps } from '@/lib/interface';
import {
    selectLoaderState,
    setLoaderState,
    setShowNotif,
} from '@/store/slices/loaderSlice';
import { setNotifyRegister } from '@/store/slices/registerSlice';
import { selectUserValue, setUser } from '@/store/slices/userSlice';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const CloseFriendModal = ({
    users,
    refreshToken,
    handleCloseFriendModal,
}: CloseFriendModalProps) => {
    const [search, setSearch] = useState('');
    const router = useRouter();
    const userProps = useSelector(selectUserValue);
    const loadingState = useSelector(selectLoaderState);
    const dispatch = useDispatch();
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            return user.fullName.toLowerCase().includes(search.toLowerCase());
        });
    }, [search, users]);

    const handleStart = () => {
        dispatch(
            setLoaderState({
                isRouteChanging: true,
                loadingKey: loadingState.loadingKey ^ 1,
            })
        );
    };

    const handleFinish = (id?: string) => {
        if (id) {
            if (userProps.closeFriend.includes(id)) {
                dispatch(
                    setUser({
                        ...userProps,
                        closeFriend: userProps.closeFriend.filter(
                            (item) => item !== id
                        ),
                    })
                );
            } else {
                dispatch(
                    setUser({
                        ...userProps,
                        closeFriend: [...userProps.closeFriend, id],
                    })
                );
            }
        }
        dispatch(
            setLoaderState({
                isRouteChanging: false,
            })
        );
    };

    const fetchingAPI = async (accessToken: string, friendId: string) => {
        const body = {
            friendId: friendId,
        };

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user/close-friend`,
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

    const onChange = async (id: string, fullName: string) => {
        handleStart();

        let accessToken;

        accessToken = await fetchAccessToken(refreshToken);

        const status = checkAccessToken(accessToken);
        if (status === false) {
            router.push('/');
            handleFinish();
            return;
        }

        const data = await fetchingAPI(accessToken!, id);

        if (data.code === 200) {
            const messages = data.message.split(' ');
            let message;
            if (messages[0] === 'Added') {
                message = `Added ${
                    fullName.split(' ')[0]
                } to your close friend list`;
            } else {
                message = `Removed ${
                    fullName.split(' ')[0]
                } from your close friend list`;
            }
            dispatch(
                setShowNotif({ show: true, message: message, type: 'success' })
            );
        } else {
            dispatch(
                setShowNotif({
                    show: false,
                    message: data.message,
                    type: 'error',
                })
            );
        }

        handleFinish(id);
    };

    return (
        <>
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse2">
                <div className="flex justify-center items-center h-screen">
                    <div className="z-10 rounded-xl shadow w-60 bg-gray-700 overflow-hidden">
                        <div className="p-3 flex items-center justify-between -mb-3">
                            <h3 className="sm:text-lg text-xs text-gray-400 font-bold pl-1">
                                Edit Close Friend
                            </h3>
                            <button
                                type="button"
                                className=" text-gray-200 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm"
                                onClick={() => {
                                    handleCloseFriendModal();
                                }}
                            >
                                <svg
                                    aria-hidden="true"
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="p-3">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg
                                        className="w-5 h-5 text-gray-400"
                                        aria-hidden="true"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    className="border text-sm rounded-lg block w-full pl-10 p-2.5  bg-gray-600 border-gray-500 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Search user"
                                    onChange={(e) => setSearch(e.target.value)}
                                    value={search}
                                />
                            </div>
                        </div>
                        <ul className="sm:h-48 h-28 px-3 pb-3 overflow-y-auto text-sm text-gray-200">
                            {filteredUsers.map((user) => {
                                return (
                                    <li key={user.id}>
                                        <label className="flex items-center p-2 rounded hover:bg-gray-600 border-b border-gray-600">
                                            {' '}
                                            <span className="w-full ml-2 text-sm font-medium rounded text-gray-300">
                                                {user.fullName}
                                            </span>
                                            <input
                                                type="checkbox"
                                                onChange={() => {
                                                    onChange(
                                                        user.id,
                                                        user.fullName
                                                    );
                                                }}
                                                checked={userProps.closeFriend.includes(
                                                    user.id
                                                )}
                                                className="w-4 h-4 rounded-md text-blue-600 focus:ring-blue-600 ring-offset-gray-700 focus:ring-offset-gray-700 focus:ring-2 border-gray-500 outline-none accent-gray-600 checked:accent-gray-600 checked:bg-gray-600"
                                            />
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CloseFriendModal;
