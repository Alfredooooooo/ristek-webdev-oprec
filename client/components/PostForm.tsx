import { formType } from '@/lib/interface';
import {
    selectFormValue,
    selectInitialContent,
    selectInitialImage,
    selectInitialIsCloseFriend,
    setForm,
} from '@/store/slices/formSlices';
import { selectUserValue } from '@/store/slices/userSlice';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ButtonSVG from './ButtonSVG';
import Card from './Card';
import ProfilePicture from './ProfilePicture';

interface PostFormType {
    onSubmit: (postData: formType) => void;
    profilePicture: string;
}

const PostForm = ({ onSubmit, profilePicture }: PostFormType) => {
    const [imagePost, setImagePost] = useState<string>('');
    const [imageInput, setImageInput] = useState<File | undefined>();

    const { id, image, content, isCloseFriend } = useSelector(selectFormValue);
    const contentBody = useRef<HTMLTextAreaElement>(null);
    const user = useSelector(selectUserValue);
    const initialContent = useSelector(selectInitialContent);
    const initialImage = useSelector(selectInitialImage);

    const initialIsCloseFriend = useSelector(selectInitialIsCloseFriend);
    const dispatch = useDispatch();
    const handleCloseFriendClick = () => {
        dispatch(
            setForm({
                id,
                content: contentBody.current?.value || '',
                image: imagePost,
                isCloseFriend: !isCloseFriend,
            })
        );
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        onSubmit({
            id,
            content: id
                ? contentBody.current!.value !== initialContent
                    ? contentBody.current!.value
                    : (undefined as unknown as string)
                : contentBody.current!.value,
            image: id
                ? imagePost === initialImage
                    ? (undefined as unknown as File)
                    : imageInput === undefined
                    ? ''
                    : imageInput
                : imageInput,
            isCloseFriend: id
                ? isCloseFriend === initialIsCloseFriend
                    ? (undefined as unknown as boolean)
                    : isCloseFriend
                : isCloseFriend,
        });
        contentBody.current!.value = '';
        setImagePost('');
        setImageInput(undefined);
        dispatch(
            setForm({
                id: '',
                content: '',
                image: '',
                isCloseFriend: false,
            })
        );
    };

    const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        setImageInput(file);

        const fileReader = new FileReader();
        fileReader.onload = read;
        function read(e: ProgressEvent<FileReader>) {
            const img = e.target?.result as string;
            setImagePost(img);
        }
        if (file) {
            fileReader.readAsDataURL(file);
        }
        e.target.value = '';
    };

    useEffect(() => {
        contentBody.current!.value = content;
        setImagePost(image as string);
    }, [content, image]);

    return (
        <div className="mt-2" id="postForm">
            <Card padding="4" isCloseFriend={isCloseFriend}>
                <form onSubmit={handleSubmit}>
                    <div
                        className={`flex items-center gap-2 ${
                            isCloseFriend ? 'border-teal-500' : ''
                        }`}
                    >
                        <div>
                            <ProfilePicture
                                profilePicture={profilePicture}
                                userId={user?.id}
                            />
                        </div>
                        <textarea
                            className={`flex-grow p-3 h-20 bg-transparent border-2 rounded-md focus:outline-none placeholder-gray-400 transition duration-300 ease-in-out ${
                                isCloseFriend
                                    ? 'focus:border-teal-500 border-teal-500'
                                    : 'focus:border-primary border-primary'
                            }`}
                            placeholder={`What do you want to share, ${
                                user?.fullName.split(' ')[0]
                            }?`}
                            defaultValue={content}
                            ref={contentBody}
                            required
                        />
                    </div>
                    <div className="flex items-center mt-2 justify-between px-2 py-1 flex-col xs:flex-row gap-4">
                        <div className="flex gap-5">
                            <ButtonSVG>
                                <>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/png, image/jpeg, image/jpg, image/gif"
                                        onChange={addImage}
                                    />
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
                                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                        />
                                    </svg>
                                    <span className="hidden md:block md:ml-1">
                                        Add Image
                                    </span>
                                </>
                            </ButtonSVG>{' '}
                            <ButtonSVG handleClick={handleCloseFriendClick}>
                                <>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className={`w-6 h-6 transition duration-300 ease-in-out ${
                                            isCloseFriend
                                                ? 'text-green-700 scale-110'
                                                : ''
                                        }`}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                        />
                                    </svg>
                                    <span
                                        className={`hidden md:block ${
                                            isCloseFriend ? 'font-bold' : ''
                                        }`}
                                    >
                                        {isCloseFriend
                                            ? 'Unmark for close friend'
                                            : 'Mark for close friend'}
                                    </span>
                                </>
                            </ButtonSVG>
                        </div>
                        <div className="text-right">
                            <button
                                className="bg-gradient-to-r from-sky-200 to-slate-100 sm:px-10 px-4 py-2 rounded-md text-black font-bold flex gap-2 justify-center items-center shadow-lg shadow-gray-300 hover:scale-110 transition duration-300 ease-in-out"
                                type="submit"
                            >
                                Post
                                <span>
                                    <svg
                                        width="25"
                                        height="25"
                                        viewBox="0 0 25 25"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M7.47799 20.2928C7.47799 21.6638 9.12299 22.3348 10.055 21.3428L22.058 8.5388C23.018 7.5108 22.303 5.8158 20.909 5.8158H3.99599C2.67799 5.8158 2.00499 7.4228 2.91799 8.3878L7.47799 13.2158V20.2928ZM9.47099 19.0278V12.4008L4.35599 6.9848C4.65899 7.3068 4.43399 7.8418 3.99599 7.8418H19.959L9.47099 19.0278Z"
                                            fill="#01162D"
                                        />
                                        <path
                                            d="M8.91599 13.7178L12.926 11.7678C13.1665 11.6461 13.3503 11.4357 13.4388 11.1811C13.5272 10.9264 13.5133 10.6474 13.4 10.4028C13.3469 10.2823 13.2701 10.1737 13.1742 10.0835C13.0782 9.9933 12.9652 9.92331 12.8416 9.87769C12.7181 9.83206 12.5867 9.81175 12.4551 9.81795C12.3236 9.82416 12.1947 9.85675 12.076 9.9138L8.06599 11.8638C7.56899 12.1058 7.35599 12.7168 7.59099 13.2278C7.644 13.3485 7.72077 13.4573 7.81673 13.5477C7.91268 13.6381 8.02586 13.7083 8.14951 13.754C8.27315 13.7997 8.40474 13.8201 8.53643 13.8139C8.66812 13.8076 8.7972 13.775 8.91599 13.7178Z"
                                            fill="#01162D"
                                        />
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </div>
                    {imagePost && (
                        <div className="mt-4 ml-2 relative w-fit">
                            <img
                                src={imagePost}
                                alt="imagePost"
                                className="h-24 rounded-md object-cover w-auto"
                            ></img>
                            <span
                                className="absolute z-99 right-0 top-0 cursor-pointer animate-pulse"
                                onClick={() => {
                                    setImagePost('');
                                    setImageInput(undefined);
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6 text-primary"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </span>
                        </div>
                    )}
                </form>
            </Card>
        </div>
    );
};

export default PostForm;
