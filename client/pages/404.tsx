import Error from 'next/error';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Custom404 = () => {
    const [time, setTime] = useState(5);
    const [redirect, setRedirect] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (redirect) {
            router.back();
            return;
        }
        const timer = setInterval(() => {
            setTime((time) => time - 1);
        }, 1000);

        if (time === 0) {
            setRedirect(true);
            clearInterval(timer);
        }

        return () => clearInterval(timer);
    }, [time, redirect, router]);

    return (
        <div>
            <Error
                statusCode={404}
                title={`Redirecting to the previous page in ${time} seconds`}
            />
        </div>
    );
};

export default Custom404;
