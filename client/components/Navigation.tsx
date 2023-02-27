import { checkAccessToken, fetchAccessToken } from '@/lib/fetchCommand';
import { NavigationProps } from '@/lib/interface';
import { setShowNotif } from '@/store/slices/loaderSlice';
import {
    openCloseFriendModalValue,
    setOpenCloseFriend,
} from '@/store/slices/modalSlices';
import { selectRefreshToken, selectUserValue } from '@/store/slices/userSlice';
import { deleteCookie } from 'cookies-next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Card from './Card';

const Navigation = ({ handleCloseFriendModal }: NavigationProps) => {
    const dispatch = useDispatch();
    const openCloseFriend = useSelector(openCloseFriendModalValue);
    const router = useRouter();
    const { asPath: pathname } = router;
    const activeElementClasses =
        'text-sm md:text-md flex gap-1 md:gap-3 py-3 my-1 text-white md:-mx-7 px-6 md:px-7 rounded-md shadow-md shadow-gray-300 items-center';
    const nonActiveElementClasses =
        'text-sm md:text-md flex gap-1 md:gap-3 py-2 my-2 hover:bg-blue-500 hover:bg-opacity-20 md:-mx-4 px-6 md:px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300 items-center duration-150 ease-in-out';
    const user = useSelector(selectUserValue);

    const refreshToken = useSelector(selectRefreshToken);

    const logout = async () => {
        if (refreshToken === undefined) {
            router.push('/login');
            return;
        }

        let accessToken;

        accessToken = await fetchAccessToken(refreshToken!);

        const status = checkAccessToken(accessToken);
        if (status === false) {
            router.push('/');
            return;
        }

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        deleteCookie('user');
        deleteCookie('refreshToken');
        router.push('/login');
        dispatch(
            setShowNotif({
                show: true,
                message: 'Logged out successfully',
                type: 'success',
            })
        );
    };

    return (
        <Card padding={'0'}>
            <div className="px-4 py-3 flex justify-center sm:justify-between md:block shadow-md shadow-gray-500 md:shadow-none flex-wrap items-center">
                <h2 className="text-gray-200 font-bold mb-3 hidden md:block">
                    Navigation
                </h2>
                <Link
                    href="/"
                    className={
                        pathname === '/'
                            ? activeElementClasses
                            : nonActiveElementClasses
                    }
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        x
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                        />
                    </svg>
                    <span className="hidden md:block">Home</span>
                </Link>
                <Link
                    href={`/profile/${user?.id}`}
                    className={
                        pathname === `/profile/${user?.id}`
                            ? activeElementClasses
                            : nonActiveElementClasses
                    }
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
                            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>

                    <span className="hidden md:block">Profile</span>
                </Link>
                <div
                    className={`${
                        openCloseFriend ? 'pointer-events-auto' : ''
                    }`}
                    onClick={(e) => handleCloseFriendModal()}
                >
                    <button
                        className={`${nonActiveElementClasses} ${
                            openCloseFriend &&
                            ` bg-blue-500 bg-opacity-20 animate-pulse`
                        } w-[115%] `}
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
                                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                            />
                        </svg>
                        <span className="hidden md:block text-center">
                            Close Friends
                        </span>
                    </button>
                </div>
                <div
                    className={`${nonActiveElementClasses} cursor-pointer`}
                    onClick={logout}
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
                            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                        />
                    </svg>
                    <span className="hidden md:block">Logout</span>
                </div>
            </div>
        </Card>
    );
};

export default Navigation;
