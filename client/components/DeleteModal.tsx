import { DeleteModalProps } from '@/lib/interface';
import {
    selectDeleteModalValue,
    setOpenDelete,
} from '@/store/slices/modalSlices';
import { useDispatch, useSelector } from 'react-redux';
import styles from '@/styles/DeleteModal.module.css';

const DeleteModal = ({ handleOnDelete }: DeleteModalProps) => {
    const postId = useSelector(selectDeleteModalValue);
    const dispatch = useDispatch();
    return (
        <>
            <div className={styles.top}>
                <div className={styles.rel}>
                    <div className={styles.cont}>
                        <button
                            type="button"
                            className={styles.svgclose}
                            onClick={() => {
                                dispatch(setOpenDelete(''));
                            }}
                        >
                            <svg
                                aria-hidden="true"
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="p-6 text-center">
                            <svg
                                aria-hidden="true"
                                className="mx-auto mb-4 text-primary sm:w-14 sm:h-14 h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                            </svg>
                            <h3 className={styles.text}>
                                Are you sure you want to delete this?
                            </h3>
                            <div className={styles.buttonGroup}>
                                <button
                                    data-modal-hide="popup-modal"
                                    type="button"
                                    className={styles.deleteButton}
                                    onClick={() => {
                                        handleOnDelete(postId);
                                        dispatch(setOpenDelete(''));
                                    }}
                                >
                                    Yes, I&apos;m sure
                                </button>
                                <button
                                    data-modal-hide="popup-modal"
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={() => {
                                        dispatch(setOpenDelete(''));
                                    }}
                                >
                                    No, cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DeleteModal;
