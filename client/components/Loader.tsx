import { useNProgress } from '@tanem/react-nprogress';
import styles from '@/styles/Loader.module.css';

export interface LoaderProps {
    isRouteChanging: boolean;
}

const Loader = ({ isRouteChanging }: LoaderProps) => {
    const { animationDuration, isFinished, progress } = useNProgress({
        isAnimating: isRouteChanging,
    });

    return (
        <>
            <style jsx>{`
                .container {
                    transition: opacity ${animationDuration}ms linear;
                }
                .bar {
                    margin-left: ${(-1 + progress) * 100}%;
                    transition: margin-left ${animationDuration}ms linear;
                }
            `}</style>
            <div
                className={`pointer-events-none ease-linear container ${
                    isFinished ? 'opacity-0' : 'opacity-100'
                }`}
            >
                <div
                    className={`bg-[#14699a] h-[2px] left-0 fixed top-0 bar w-full z-50`}
                >
                    <div
                        className={`block h-full opacity-100 absolute right-0 w-24 ${styles.spinner}`}
                    />
                </div>
            </div>
        </>
    );
};

export default Loader;
