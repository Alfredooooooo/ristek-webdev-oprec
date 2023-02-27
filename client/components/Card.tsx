import { CardProps } from '@/lib/interface';
import { motion } from 'framer-motion';

const Card = ({
    padding,
    children,
    isCloseFriend,
    isBeingDeleted,
    isBeingEdited,
}: CardProps) => {
    let classes = `shadow-md  rounded-md mb-5 transition-all duration-300 ease-in-out ${
        isCloseFriend ? 'shadow-teal-300' : 'shadow-gray-300'
    } ${isBeingDeleted ? 'shadow-red-300' : 'shadow-gray-300'} ${
        isBeingEdited ? 'shadow-yellow-300' : 'shadow-gray-300'
    }`;
    const p = `p-${padding}`;

    return (
        <motion.div
            className={`${classes} ${p}`}
            initial={{ opacity: 0 }}
            whileInView={{
                opacity: 1,
                transition: {
                    duration: 0.5,
                },
            }}
            viewport={{ once: true }}
        >
            {children}
        </motion.div>
    );
};
export default Card;
