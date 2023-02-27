import { selectCurrentStepIndex } from '@/store/slices/registerSlice';
import { useSelector } from 'react-redux';

const StepRoad = () => {
    const currentStepIndex = useSelector(selectCurrentStepIndex);
    const classBullet = `w-12 h-12 font-bold border-2 rounded-full text-gray-200 flex items-center justify-center`;
    const bgSet =
        'bg-gradient-to-r from-blue-500 to-indigo-500 border-none shadow-md';
    return (
        <div className="flex flex-row items-center justify-center">
            <div
                className={`${classBullet} ${
                    currentStepIndex >= 0 ? bgSet : ''
                }`}
            >
                1
            </div>
            <div
                className={`flex-auto border-t-2 ${
                    currentStepIndex >= 1 ? 'border-indigo-500' : ''
                }`}
            ></div>
            <div
                className={`${classBullet} ${
                    currentStepIndex >= 1 ? bgSet : ''
                }`}
            >
                2
            </div>
            <div
                className={`flex-auto border-t-2 ${
                    currentStepIndex >= 2 ? 'border-indigo-500' : ''
                }`}
            ></div>
            <div
                className={`${classBullet} ${
                    currentStepIndex >= 2 ? bgSet : ''
                }`}
            >
                3
            </div>
        </div>
    );
};

export default StepRoad;
