import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useState } from 'react';
import { HiAtSymbol, HiFingerPrint, HiOutlineUser } from 'react-icons/hi';
import styles from '@/styles/Auth.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectFormData,
    setFormData,
    setNextStepIndex,
} from '@/store/slices/registerSlice';
import { validateRegister } from '@/lib/validate';

const RegisterUserProfile = () => {
    const formData = useSelector(selectFormData);
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false,
    });
    return (
        <Formik
            initialValues={formData}
            validate={validateRegister}
            onSubmit={(values, { setSubmitting }) => {
                dispatch(setFormData(values));
                dispatch(setNextStepIndex());
                setTimeout(() => {
                    setSubmitting(false);
                }, 400);
            }}
        >
            {({ isSubmitting, errors, touched }) => (
                <Form className="flex flex-col gap-10">
                    <div className={styles.formGroup}>
                        <div className={styles.errorFormGroup}>
                            <>
                                <ErrorMessage
                                    name="fullName"
                                    component="span"
                                    className="font-semibold mr-2 flex-auto text-gray-300"
                                />
                            </>
                            <div className={styles.inputGroup}>
                                <Field
                                    type="text"
                                    placeholder="Username"
                                    name="fullName"
                                    className={`${styles.inputText} ${
                                        errors?.fullName && touched?.fullName
                                            ? 'border-rose-600'
                                            : 'focus:border-indigo-400'
                                    }`}
                                />
                                <span className={styles.icons}>
                                    <HiOutlineUser size={25} />
                                </span>
                            </div>
                        </div>
                        <div className={styles.errorFormGroup}>
                            <>
                                <ErrorMessage
                                    name="email"
                                    component="span"
                                    className="font-semibold mr-2 flex-auto text-gray-300"
                                />
                            </>
                            <div className={styles.inputGroup}>
                                <Field
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    className={`${styles.inputText} ${
                                        errors?.email && touched?.email
                                            ? 'border-rose-600'
                                            : 'focus:border-indigo-400'
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
                                    className="font-semibold mr-2 flex-auto text-gray-300"
                                />
                            </>
                            <div className={styles.inputGroup}>
                                <Field
                                    type={
                                        showPassword.password
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder="Password"
                                    name="password"
                                    className={`${styles.inputText} ${
                                        errors?.password && touched?.password
                                            ? 'border-rose-600'
                                            : 'focus:border-indigo-400'
                                    }`}
                                />
                                <span
                                    className={styles.icons}
                                    onClick={() =>
                                        setShowPassword((prev) => {
                                            return {
                                                ...prev,
                                                password: !prev.password,
                                            };
                                        })
                                    }
                                >
                                    <HiFingerPrint size={25} />
                                </span>
                            </div>
                        </div>
                        <div className={styles.errorFormGroup}>
                            <>
                                <ErrorMessage
                                    name="confirmPassword"
                                    component="span"
                                    className="font-semibold mr-2 flex-auto text-gray-300"
                                />
                            </>
                            <div className={`${styles.inputGroup}`}>
                                <Field
                                    type={
                                        showPassword.confirmPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder="Confirm Password"
                                    name="confirmPassword"
                                    className={`${styles.inputText} ${
                                        errors?.confirmPassword &&
                                        touched?.confirmPassword
                                            ? 'border-rose-600'
                                            : 'focus:border-indigo-400'
                                    }`}
                                />
                                <span
                                    className={styles.icons}
                                    onClick={() =>
                                        setShowPassword((prev) => {
                                            return {
                                                ...prev,
                                                confirmPassword:
                                                    !prev.confirmPassword,
                                            };
                                        })
                                    }
                                >
                                    <HiFingerPrint size={25} />
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.registerGroupButton}>
                        <button
                            type="submit"
                            className={styles.buttonLogin}
                            disabled={isSubmitting}
                        >
                            Next
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default RegisterUserProfile;
