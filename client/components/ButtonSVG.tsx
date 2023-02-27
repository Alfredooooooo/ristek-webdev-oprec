import { ReactElement } from 'react';

interface ButtonProps {
    children: ReactElement;
    handleClick?: () => void;
    gap?: number;
}

const ButtonSVG = ({ children, handleClick, gap }: ButtonProps) => {
    return (
        <label
            className={`flex cursor-pointer items-center ${
                gap ? `gap-${gap}` : 'gap-1'
            }`}
            onClick={handleClick}
        >
            {children}
        </label>
    );
};

export default ButtonSVG;
