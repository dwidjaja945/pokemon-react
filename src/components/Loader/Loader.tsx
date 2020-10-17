import * as React from 'react';
import { cssBind } from '@toolkit/helper';

import styles from './Loader.scss';

const css = cssBind(styles);

const Loader = (): JSX.Element => (
    <div
        className={css('container')}
    >
        {/* TODO - add pokeball icon here */}
        Loading...
    </div>
);

export default Loader;
