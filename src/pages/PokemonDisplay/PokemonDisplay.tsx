import * as React from 'react';
import { cssBind } from '@toolkit/helper';

import styles from './PokemonDisplay.scss';

const css = cssBind(styles);

interface Props {}

const PokemonDisplay = (props: Props): JSX.Element => (
    <div>
        pokemon display
    </div>
);

export default PokemonDisplay;
