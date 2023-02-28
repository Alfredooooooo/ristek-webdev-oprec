import { Form, ErrorMessage, Formik } from 'formik';
import styles from '@/styles/Auth.module.css';
import { validateProfilePicture } from '@/lib/validate';
import { useDispatch, useSelector } from 'react-redux';
import {
    resetStepIndex,
    selectFileString,
    selectFormData,
    setBackStepIndex,
    setErrorLoginMessage,
    setErrorRegisterMessage,
    setFileString,
    setFormData,
    setNotifyRegister,
} from '@/store/slices/registerSlice';
import { useRouter } from 'next/router';
import {
    selectLoaderState,
    setLoaderState,
    setShowNotif,
} from '@/store/slices/loaderSlice';

const SetupProfilePicture = () => {
    const formData = useSelector(selectFormData);
    const fileString = useSelector(selectFileString);
    const dispatch = useDispatch();
    const router = useRouter();
    const loadingState = useSelector(selectLoaderState);

    return (
        <Formik
            initialValues={formData}
            validate={validateProfilePicture}
            onSubmit={async (values, { setSubmitting }) => {
                const formData = new FormData();
                formData.append('fullName', values.fullName);
                formData.append('email', values.email);
                formData.append('password', values.password);
                formData.append('bio', values.bio);
                formData.append('profilePicture', values.profilePicture);

                dispatch(
                    setLoaderState({
                        isRouteChanging: true,
                        loadingKey: loadingState.loadingKey ^ 1,
                    })
                );

                await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register/`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                )
                    .then((res) => {
                        return res.json();
                    })
                    .then((data) => {
                        if (data.statusCode) {
                            setSubmitting(false);
                            dispatch(resetStepIndex());
                            dispatch(
                                setShowNotif({
                                    message: data.message,
                                    type: 'error',
                                    show: true,
                                })
                            );
                            return;
                        }

                        if (data.code === 201) {
                            dispatch(
                                setFormData({
                                    fullName: '',
                                    email: '',
                                    password: '',
                                    confirmPassword: '',
                                    bio: '',
                                    profilePicture:
                                        undefined as unknown as File,
                                })
                            );
                            dispatch(setFileString(''));
                            setSubmitting(false);
                            router.push('/login');
                            dispatch(resetStepIndex());
                            dispatch(
                                setLoaderState({
                                    isRouteChanging: false,
                                })
                            );
                            dispatch(
                                setShowNotif({
                                    message:
                                        'You have been registered successfully!',
                                    type: 'success',
                                    show: true,
                                })
                            );
                        }
                    });
            }}
        >
            {({ isSubmitting, errors, touched, setFieldValue, values }) => (
                <Form className="flex items-center justify-center w-full">
                    <div className={`${styles.errorFormGroup} w-full`}>
                        <>
                            <ErrorMessage
                                name="profilePicture"
                                component="span"
                                className="font-semibold mr-2 flex-auto text-gray-300"
                            />
                        </>
                        <div className={`${styles.inputGroup}`}>
                            <label
                                className={`flex flex-col items-center justify-center w-full h-64 rounded-lg cursor-pointer hover:bg-bray-800 bg-gray-700 hover:border-gray-500 hover:bg-gray-600 outline-none relative ${
                                    errors?.profilePicture &&
                                    touched?.profilePicture
                                        ? 'border-rose-600'
                                        : 'focus:border-indigo-400 border-indigo-700'
                                }`}
                            >
                                <>
                                    {!fileString ? (
                                        <>
                                            <svg
                                                aria-hidden="true"
                                                className="w-10 h-10 mb-3 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                ></path>
                                            </svg>
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">
                                                    Click to set up your profile
                                                    image
                                                </span>{' '}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Only image please!
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <img
                                                src={fileString}
                                                alt="Desired Profile Picture"
                                                className="object-cover w-full h-full rounded-lg"
                                            ></img>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-16 h-16 absolute text-bgWeb z-99"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
                                                />
                                            </svg>
                                        </>
                                    )}

                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/png, image/jpeg, image/jpg, image/gif"
                                        onChange={(e) => {
                                            const file = e.target.files![0];
                                            setFieldValue(
                                                'profilePicture',
                                                e.target.files![0]
                                            );
                                            const fileReader = new FileReader();
                                            fileReader.onload = read;
                                            function read(
                                                e: ProgressEvent<FileReader>
                                            ) {
                                                const img = e.target
                                                    ?.result as string;
                                                dispatch(setFileString(img));
                                            }
                                            if (file) {
                                                fileReader.readAsDataURL(file);
                                            }
                                            e.target.value = '';
                                        }}
                                    />
                                </>
                            </label>
                        </div>
                        <div className={styles.registerGroupButton}>
                            <button
                                type="button"
                                className={styles.buttonLogin}
                                onClick={() => {
                                    dispatch(setFormData(values));
                                    dispatch(setBackStepIndex());
                                }}
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className={styles.buttonLogin}
                                disabled={isSubmitting}
                                onClick={() => {
                                    dispatch(setFormData(values));
                                }}
                            >
                                Register
                            </button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default SetupProfilePicture;
