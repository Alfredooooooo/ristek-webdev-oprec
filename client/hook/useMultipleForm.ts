import {
    selectCurrentStepIndex,
    setBackStepIndex,
    setNextStepIndex,
} from '@/store/slices/registerSlice';
import { ReactElement, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export function useMultistepForm(steps: ReactElement[]) {
    const currentStepIndex = useSelector(selectCurrentStepIndex);
    const dispatch = useDispatch();

    function next() {
        if (currentStepIndex >= steps.length - 1) return;
        dispatch(setNextStepIndex());
    }

    function back() {
        if (currentStepIndex <= 0) return;
        dispatch(setBackStepIndex());
    }

    return {
        step: steps[currentStepIndex],
        isLastStep: currentStepIndex === steps.length - 1,
    };
}
