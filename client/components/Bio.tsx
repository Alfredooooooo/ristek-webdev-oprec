import { Form, ErrorMessage, Field, Formik } from 'formik';
import styles from '@/styles/Auth.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectFormData,
    setBackStepIndex,
    setFormData,
    setNextStepIndex,
} from '@/store/slices/registerSlice';
import { LoremIpsum } from 'lorem-ipsum';
import { validateBio } from '@/lib/validate';

const Bio = () => {
    const formData = useSelector(selectFormData);
    const dispatch = useDispatch();

    const lorem = new LoremIpsum({
        sentencesPerParagraph: {
            max: 8,
            min: 4,
        },
        wordsPerSentence: {
            max: 16,
            min: 4,
        },
    });

    return (
        <Formik
            initialValues={formData}
            validate={validateBio}
            onSubmit={(values, { setSubmitting }) => {
                dispatch(setFormData({ ...values }));
                dispatch(setNextStepIndex());
                setTimeout(() => {
                    setSubmitting(false);
                }, 400);
            }}
        >
            {({ isSubmitting, errors, touched, setFieldValue, values }) => (
                <Form className="flex flex-col gap-10">
                    <div className={styles.formGroup}>
                        <div className={styles.errorFormGroup}>
                            <>
                                <ErrorMessage
                                    name="bio"
                                    component="span"
                                    className="font-semibold mr-2 flex-auto text-gray-300"
                                />
                            </>
                            <div className={`${styles.inputGroup}`}>
                                <Field
                                    type="text"
                                    as="textarea"
                                    placeholder="Enter your desired bio"
                                    name="bio"
                                    className={`${styles.textArea} ${
                                        errors?.bio && touched?.bio
                                            ? 'border-rose-600'
                                            : 'focus: border-indigo-400'
                                    }`}
                                />
                            </div>
                        </div>
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
                        >
                            Next
                        </button>
                    </div>

                    <p
                        className="text-blue-400 font-bold text-2xl hover:text-blue-100 hover:scale-110 transition duration-500 ease-in-out cursor-pointer"
                        onClick={() => {
                            setFieldValue('bio', lorem.generateWords(100));
                        }}
                    >
                        Generate Default Bio!
                    </p>
                </Form>
            )}
        </Formik>
    );
};

export default Bio;
