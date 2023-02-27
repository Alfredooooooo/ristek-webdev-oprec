import { DeleteModalProps } from '@/lib/interface';
import {
    selectDeleteModalValue,
    setOpenDelete,
} from '@/store/slices/modalSlices';
import { useDispatch, useSelector } from 'react-redux';

const DeleteModal = ({ handleOnDelete }: DeleteModalProps) => {
    const postId = useSelector(selectDeleteModalValue);
    const dispatch = useDispatch();
    return (
        <>
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse2">
                <div className="relative w-full h-full max-w-md md:h-auto">
                    <div className="relative bg-bgWeb/90 rounded-lg shadow">
                        <button
                            type="button"
                            className="absolute top-3 right-2.5 text-gray-200 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
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
                            <h3 className="mb-5 font-normal text-gray-200 sm:text-lg text-xs">
                                Are you sure you want to delete this?
                            </h3>
                            <div className="flex sm:flex-row flex-col gap-2 justify-center items-center">
                                <button
                                    data-modal-hide="popup-modal"
                                    type="button"
                                    className="text-white bg-primary/50 hover:bg-primary/20 focus:ring-4 focus:outline-none focus:ring-primary/70 md:font-medium rounded-lg md:text-sm text-xs xs:py-2.5 px-2 py-1 text-center transition duration-300 ease-in-out"
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
                                    className="text-gray-600 bg-white hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 md:text-sm text-xs font-medium xs:px-5 xs:py-2.5 px-2 py-1 hover:text-gray-900 hover:border-gray-500 focus:z-10 transition duration-300 ease-in-out"
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
