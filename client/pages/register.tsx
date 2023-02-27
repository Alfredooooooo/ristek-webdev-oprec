import AuthLayout from '@/components/AuthLayout';
import Head from 'next/head';
import Link from 'next/link';
import RegisterUserProfile from '@/components/RegisterUserProfile';
import { useMultistepForm } from '@/hook/useMultipleForm';
import Bio from '@/components/Bio';
import SetupProfilePicture from '@/components/SetupProfilePicture';
import StepRoad from '../components/StepRoad';
import { useDispatch, useSelector } from 'react-redux';
import { setErrorRegisterMessage } from '@/store/slices/registerSlice';
import { GetServerSideProps } from 'next';
import { motion } from 'framer-motion';
import { selectCurrentStepIndex } from '@/store/slices/registerSlice';

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

const Register = () => {
    const { step, isLastStep } = useMultistepForm([
        <RegisterUserProfile />,
        <Bio />,
        <SetupProfilePicture />,
    ]);
    const currentStepIndex = useSelector(selectCurrentStepIndex);
    const dispatch = useDispatch();
    return (
        <AuthLayout>
            <Head>
                <title>Register</title>
            </Head>
            <motion.div
                className="w-3/4 flex flex-col mx-auto gap-5"
                key={currentStepIndex}
                initial={{
                    opacity: 0,
                    x: 25,
                }}
                animate={{
                    opacity: 1,
                    x: 0,
                    transition: {
                        duration: 0.15,
                    },
                }}
            >
                <StepRoad />
                <div>
                    <h1 className="text-3xl font-bold text-gray-100 mb-2">
                        Register
                    </h1>
                    <h3 className="text-lg text-gray-300 mx-auto">
                        {isLastStep
                            ? 'This step requires you to choose your own profile image'
                            : 'Please fill the field below to create your account'}
                    </h3>
                </div>

                {step}

                <p className="text-center text-gray-300">
                    Have an account?{' '}
                    <Link
                        href="/login"
                        className="text-blue-400 font-bold hover:text-blue-100 hover:scale-150 transition duration-500 ease-in-out"
                        onClick={() => dispatch(setErrorRegisterMessage(''))}
                    >
                        Login!
                    </Link>{' '}
                </p>
            </motion.div>
        </AuthLayout>
    );
};

export default Register;
