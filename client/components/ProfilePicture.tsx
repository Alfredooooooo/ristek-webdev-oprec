import { checkAccessToken, fetchAccessToken } from '@/lib/fetchCommand';
import { selectLoaderState, setLoaderState } from '@/store/slices/loaderSlice';
import { setUser } from '@/store/slices/userSlice';
import { deleteCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface ProfilePictureProps {
    size?: string;
    profilePicture: string;
    allowEdit?: boolean;
    userId?: string;
    refreshToken?: string;
    showNotif?: (message?: string, type?: string) => void;
}
const ProfilePicture = ({
    size,
    profilePicture,
    allowEdit,
    userId,
    refreshToken,
    showNotif,
}: ProfilePictureProps) => {
    const router = useRouter();

    let width = `${
        size === 'lg'
            ? 'w-24 md:w-36 animate-wiggle'
            : `${size === 'md' ? 'w-[3.25rem]' : 'w-12'}`
    }`;

    const [imageInput, setImageInput] = useState<File | undefined>();
    const isFirstRender = useRef(true);
    const loadingState = useSelector(selectLoaderState);
    const dispatch = useDispatch();
    const [changing, setChanging] = useState(false);

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
        setChanging(false);
    };

    useEffect(() => {
        if (allowEdit) {
            if (isFirstRender.current) {
                isFirstRender.current = false;
                return;
            }
            const changePicture = async () => {
                showNotif!();
                const formData = new FormData();
                formData.append('profilePicture', imageInput as File);

                handleStart();

                let accessToken;

                accessToken = await fetchAccessToken(refreshToken!);

                const status = checkAccessToken(accessToken);
                if (status === false) {
                    router.push('/');
                    handleFinish();
                    return;
                }

                return await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/user/`,
                    {
                        method: 'PATCH',
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                        body: formData,
                    }
                )
                    .then((result) => {
                        return result.json();
                    })
                    .then((data) => {
                        dispatch(setUser(data.content));
                        handleFinish();
                        showNotif!('Profile picture changed', 'success');
                    });
            };

            if (changing) {
                changePicture();
            }
        }
    }, [imageInput, changing]);

    return (
        <>
            <div
                className={`${width} rounded-full overflow-hidden cursor-pointer transition duration-300 ease-in-out ${
                    allowEdit
                        ? 'relative hover:opacity-50'
                        : `${size === 'lg' && 'cursor-none'}`
                } ${size === 'md' || size === 'lg' ? '' : 'hidden xs:block'}`}
                onClick={() => {
                    if (userId) {
                        router.push(`/profile/${userId}`);
                        return;
                    }
                }}
            >
                {profilePicture ? (
                    <img
                        src={profilePicture}
                        alt="Profile"
                        className={`${
                            size === 'lg'
                                ? 'w-36 h-36'
                                : `${
                                      size === 'md'
                                          ? 'w-[3.25rem] h-[3.25rem]'
                                          : 'w-12 h-12'
                                  }`
                        }`}
                    ></img>
                ) : (
                    <img
                        src={'/assets/profile.svg'}
                        alt="Profile"
                        width={`${
                            size === 'lg' ? 136 : `${size === 'md' ? 52 : 48}`
                        }`}
                        height={`${
                            size === 'lg' ? 136 : `${size === 'md' ? 52 : 48}`
                        }`}
                    />
                )}
                {allowEdit && (
                    <label className="hover:opacity-100 absolute inset-0 flex flex-col justify-center items-center text-white opacity-0 transition duration-300 ease-in-out gap-2">
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
                                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                            />
                        </svg>
                        <span className="text-sm text-gray-200 font-bold w-1/2 text-center">
                            Edit Profile
                        </span>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/png, image/jpeg, image/jpg, image/gif"
                            onChange={async (e) => {
                                const file = e.target.files![0];
                                setImageInput(file);
                                setChanging(true);
                            }}
                        />
                    </label>
                )}
            </div>
        </>
    );
};

export default ProfilePicture;
