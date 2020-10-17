import * as React from 'react';
import { cssBind } from '@toolkit/helper';

import styles from './Button.scss';

const css = cssBind(styles);

interface Props {
    ariaLabel?: string;
    outlined?: boolean;
    primary?: boolean;
    className?: string;
    onClick?(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

const Button: React.FC<Props> = (props) => {
    const {
        onClick,
        ariaLabel = '',
        outlined = false,
        primary = true,
        className,
        children,
    } = props;
    return (
        <button
            type="button"
            aria-label={ariaLabel}
            onClick={onClick}
            className={css('button', primary && 'primary', outlined && 'outlined', className)}
        >
            {children}
        </button>
    );
};

export default Button;
