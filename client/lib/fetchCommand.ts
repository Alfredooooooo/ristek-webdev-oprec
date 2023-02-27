import { deleteCookie } from 'cookies-next';
import { GetServerSidePropsContext, PreviewData } from 'next';
import router from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { User, PostType } from './interface';

export async function fetchAccessToken(
    refreshToken: string
): Promise<string | undefined> {
    let accessToken;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh/`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${refreshToken}`,
        },
    })
        .then((result) => {
            if (result.status === 401) {
                deleteCookie('user');
                deleteCookie('refreshToken');
                return {
                    redirect: {
                        destination: '/login',
                    },
                    props: {},
                };
            } else {
                return result.json();
            }
        })
        .then((data) => {
            if (data.statusCode >= 400) {
                deleteCookie('user');
                deleteCookie('refreshToken');
            } else {
                accessToken = data.content.access_token;
            }
        });

    return accessToken;
}

export function checkAccessToken(
    accessToken: string | undefined,
    context?: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
): boolean {
    if (accessToken === undefined && !context) {
        deleteCookie('userId');
        deleteCookie('refreshToken');
        return false;
    } else if (accessToken === undefined && context) {
        context.res.setHeader('Set-Cookie', [
            `user=deleted; Max-Age=0; path=/`,
            `refreshToken=deleted; Max-Age=0; path=/`,
        ]);
        return false;
    }
    return true;
}

export async function findAllPosts(
    accessToken: string
): Promise<PostType[] | undefined> {
    let posts;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            posts = data.content;
        });

    return posts;
}

export async function findUser(
    accessToken: string
): Promise<User[] | undefined> {
    let users;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            users = data.content;
        });

    return users;
}

export async function findUserById(
    userId: string,
    accessToken: string
): Promise<User | undefined> {
    let userLogin;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            userLogin = data.content;
        });
    return userLogin;
}

export async function findCurrentUser(id: string): Promise<User | undefined> {
    let user;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${id}`)
        .then((result) => {
            return result.json();
        })
        .then((data) => {
            user = data.content;
        });
    return user;
}
