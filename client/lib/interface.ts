import { FormikErrors, FormikTouched } from 'formik';
import { ReactNode } from 'react';

export interface LayoutProps {
    children: ReactNode;
    profilePicture: string;
    refreshToken: string;
    users: User[];
}

export interface PostFormLayoutProps {
    children: ReactNode;
    refreshToken: string;
    allPosts: PostType[];
    userProps: User;
}

export interface HomeProps {
    posts: PostType[];
    userProps: User;
    refreshToken: string;
    users: User[];
}

export interface NavigationProps {
    handleCloseFriendModal: () => void;
}

export interface PostProps {
    idPost: string;
    content: string;
    image: string;
    isCloseFriend: boolean;
    createdAt: string;
    createdBy: User;
    Bookmarks: Bookmarks[];
    currentUser: User;
}

export interface ProfileIdProps {
    currentUser: User;
    userLogin: User;
    refreshToken: string;
    posts: PostType[];
    currentUserPosts: PostType[];
    users: User[];
}

export interface ChildrenProps {
    children: ReactNode;
}

export interface CardProps {
    padding?: string;
    children: ReactNode;
    isCloseFriend?: boolean;
    isBeingDeleted?: boolean;
    isBeingEdited?: boolean;
}

export interface baseAuthenticateProps {
    email: string;
    password: string;
}

export interface LoginProps extends baseAuthenticateProps {}

export interface RegisterDataProps extends baseAuthenticateProps {
    fullName: string;
    confirmPassword: string;
}

export interface BioDataProps {
    bio: string;
}
export interface ProfilePictureDataProps {
    profilePicture: File;
}

export interface ProfilePictureErrorProps {
    profilePicture: string;
}

export interface TotalRegisterProps
    extends RegisterDataProps,
        BioDataProps,
        ProfilePictureDataProps {}

export interface PostType {
    id: string;
    content: string;
    image: string;
    isCloseFriend: boolean;
    createdAt: string;
    user: User;
    userId: string;
    Bookmarks: Bookmarks[];
}

export interface User {
    email: string;
    fullName: string;
    id: string;
    profilePicture: string;
    closeFriend: string[];
    bio: string;
    bookmarks: Bookmarks[];
    posts: PostType[];
}

export interface Bookmarks {
    id: Number;
    postId: string;
    userId: string;
    posts: PostType;
}

export interface formType {
    id?: string;
    content: string;
    image?: File | string;
    isCloseFriend: boolean;
}

export interface DeleteModalProps {
    handleOnDelete: (postId: string) => void;
}

export interface CloseFriendModalProps {
    users: User[];
    refreshToken: string;
    handleCloseFriendModal: () => void;
}
