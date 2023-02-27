import styles from '@/styles/Loader.module.css';
import { HashLoader } from 'react-spinners';

const LoaderWrap = () => {
    return (
        <div className={styles.wrapper}>
            <HashLoader color="#eeeeee" size={80} />
        </div>
    );
};

export default LoaderWrap;
