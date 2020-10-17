import * as React from 'react';

type OnLoad = () => void;

const useScript = (src: string, defer = false, async = false): boolean => {
    const [loaded, setLoaded] = React.useState(false);
    const onLoad = (): void => {
        setLoaded(true);
    };
    React.useEffect(() => {
        const script = document.createElement('script');
        script.src = src;
        script.defer = defer;
        script.async = async;

        window.document.body.appendChild(script);

        script.addEventListener('load', onLoad);

        return (): void => {
            script.removeEventListener('load', onLoad);
            window.document.body.removeChild(script);
        };
    }, []);
    return loaded;
};

export default useScript;
