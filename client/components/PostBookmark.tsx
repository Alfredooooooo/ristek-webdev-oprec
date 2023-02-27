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
import Link from 'next/link';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from './Card';
import ProfilePicture from './ProfilePicture';
import moment from 'moment';
import { selectUserValue } from '@/store/slices/userSlice';
import { PostProps, User } from '@/lib/interface';
import { useRouter } from 'next/router';

const Post = ({ content, image, createdBy }: Partial<PostProps>) => {
    return (
        <Card padding="4">
            <div className="flex gap-3 items-center">
                <Link
                    href={`/profile/${createdBy?.id}`}
                    className="hidden sm:block"
                >
                    <span className="cursor-pointer">
                        <ProfilePicture
                            profilePicture={createdBy?.profilePicture!}
                        />
                    </span>
                </Link>
                <div className="grow">
                    <Link href={`/profile/${createdBy?.id}`}>
                        <span className="mr-1 font-semibold cursor-pointer hover:underline">
                            {createdBy?.fullName}
                        </span>
                    </Link>
                </div>
            </div>
            <div>
                <p className="my-3 text-sm break-words">{content}</p>
                <div className="rounded-md overflow-hidden">
                    <img src={image as string} alt="" />
                </div>
            </div>
        </Card>
    );
};

export default Post;
