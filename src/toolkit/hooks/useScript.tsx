import * as React from 'react';

const useScript = (src: string, defer? = false): void => {
    React.useEffect(() => {
        const script = document.createElement('script');
        script.src = src;
        script.defer = defer;

        document.body.appendChild(script);

        return (): void => {
            document.body.removeChild(script);
        };
    }, []);
};

export default useScript;
