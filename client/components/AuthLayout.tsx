import { FC, useEffect } from 'react';
import styles from '@/styles/AuthLayout.module.css';
import { ChildrenProps } from '@/lib/interface';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectLoaderState,
    selectShowNotif,
    setShowNotif,
} from '@/store/slices/loaderSlice';
import LoaderWrap from './LoaderWrap';
import Notification from './Notification';
import { motion } from 'framer-motion';

const AuthLayout: FC<ChildrenProps> = ({ children }) => {
    const loadingState = useSelector(selectLoaderState);
    const notificationState = useSelector(selectShowNotif);
    const dispatch = useDispatch();

    useEffect(() => {
        if (notificationState.show === true) {
            setTimeout(() => {
                dispatch(setShowNotif({ show: false, message: '', type: '' }));
            }, 4500);
        }
    }, [notificationState]);

    return (
        <>
            {loadingState.isRouteChanging && <LoaderWrap />}

            <div className="flex h-screen w-screen bg-bgWeb">
                {notificationState.show && (
                    <Notification
                        message={notificationState.message}
                        type={notificationState.type}
                    />
                )}
                <motion.div
                    className="m-auto rounded-md w-3/5 h-[90%] grid xl:grid-cols-2 bg-gradient-to-r from-[#707070] to-[#808080] shadow-2xl shadow-blue-300 overflow-auto 3xl:overflow-hidden"
                    initial={{
                        opacity: 0,
                        x: 100,
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                        transition: {
                            duration: 0.25,
                        },
                    }}
                >
                    <div className="flex flex-col justify-evenly p-8">
                        <div className="text-center py-10">{children}</div>
                    </div>
                    <div className={styles.bg}>
                        <div className={styles.bgPerson}></div>
                        <div className={styles.bgCloud1}></div>
                        <div className={styles.bgCloud2}></div>
                        <div className={styles.bgCloud3}></div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default AuthLayout;
