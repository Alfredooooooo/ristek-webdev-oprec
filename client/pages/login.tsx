import AuthLayout from '@/components/AuthLayout';
import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/Auth.module.css';
import { HiAtSymbol, HiFingerPrint } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { validateLogin } from '@/lib/validate';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectNotifyRegister,
    setNotifyRegister,
} from '@/store/slices/registerSlice';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { setRefreshToken, setUser } from '@/store/slices/userSlice';
import { User } from '@/lib/interface';
import { setShowNotif } from '@/store/slices/loaderSlice';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req } = context;
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        return {
            redirect: {
                destination: '/',
            },
            props: {},
        };
    }
    return {
        props: {},
    };
};

const Login = () => {
    const [show, setShow] = useState(false);

    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        dispatch(setRefreshToken(''));
        dispatch(setUser(undefined as unknown as User));
    }, []);

    return (
        <AuthLayout>
            <Head>
                <title>Login</title>
            </Head>
            <div className="w-3/4 flex flex-col mx-auto gap-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-100 mb-2">
                        Login
                    </h1>
                    <h3 className="text-lg text-gray-300 mx-auto">
                        Please fill the field below to login, if you don&apos;t
                        have an account yet, please register below
                    </h3>
                </div>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validate={validateLogin}
                    onSubmit={async (values, { setSubmitting }) => {
                        const body = {
                            email: values.email,
                            password: values.password,
                        };
                        const res = await fetch(
                            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/`,
                            {
                                method: 'POST',
                                body: JSON.stringify(body),
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            }
                        );
                        const data = await res.json();

                        if (data.statusCode === 400) {
                            setSubmitting(false);
                            dispatch(
                                setShowNotif({
                                    message: data.message,
                                    type: 'error',
                                    show: true,
                                })
                            );
                            return;
                        }
                        setCookie('refreshToken', data.content.token);
                        setCookie('userId', data.content.userId);
                        if (data.code === 200) {
                            setSubmitting(false);
                            router.push('/');
                            dispatch(
                                setShowNotif({
                                    message: 'You have successfully logged in',
                                    type: 'success',
                                    show: true,
                                })
                            );
                            return;
                        }
                    }}
                >
                    {({ isSubmitting, errors, touched }) => (
                        <Form className="flex flex-col gap-10">
                            <div className={styles.formGroup}>
                                <div className={styles.errorFormGroup}>
                                    <>
                                        <ErrorMessage
                                            name="email"
                                            component="span"
                                            className="font-semibold mr-2 flex-auto text-gray-300"
                                        />
                                    </>
                                    <div className={`${styles.inputGroup}`}>
                                        <Field
                                            type="email"
                                            placeholder="Email"
                                            name="email"
                                            className={`${styles.inputText} ${
                                                errors.email && touched.email
                                                    ? 'border-rose-600'
                                                    : 'focus: border-indigo-400'
                                            }`}
                                        />
                                        <span className={styles.icons}>
                                            <HiAtSymbol size={25} />
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.errorFormGroup}>
                                    <>
                                        <ErrorMessage
                                            name="password"
                                            component="span"
                                            className="font-semibold mr-2 flex-auto text-center text-gray-300"
                                        />
                                    </>
                                    <div className={styles.inputGroup}>
                                        <Field
                                            type={show ? 'text' : 'password'}
                                            placeholder="Password"
                                            name="password"
                                            className={`${styles.inputText} ${
                                                errors.password &&
                                                touched.password
                                                    ? 'border-rose-600'
                                                    : 'focus: border-indigo-400'
                                            }`}
                                        />
                                        <span
                                            className={styles.icons}
                                            onClick={() =>
                                                setShow((prev) => {
                                                    return !prev;
                                                })
                                            }
                                        >
                                            <HiFingerPrint size={25} />
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <button
                                    type="submit"
                                    className={styles.buttonLogin}
                                    disabled={isSubmitting}
                                >
                                    Login
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>

                <p className="text-center text-gray-300">
                    Don&apos;t have an account yet?{' '}
                    <Link
                        href="/register"
                        className="text-blue-400 font-bold hover:text-blue-100 hover:scale-150 transition duration-500 ease-in-out"
                        onClick={() => dispatch(setNotifyRegister(''))}
                    >
                        Sign Up!
                    </Link>{' '}
                </p>
            </div>
        </AuthLayout>
    );
};

export default Login;
