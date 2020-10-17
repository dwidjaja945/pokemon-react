import * as React from 'react';
import { cssBind } from '@toolkit/helper';

import styles from './Header.scss';

const css = cssBind(styles);

interface Props {}

const Header: React.FC<Props> = (props): JSX.Element => (
    <header className={css('header')}>
        Where&apos;s that Pokémon?
    </header>
);

export default Header;
