import * as React from 'react';
import { Link } from 'react-router-dom';
import { cssBind } from '@toolkit/helper';

import styles from './Button.scss';

const css = cssBind(styles);

interface Props {
    ariaLabel?: string;
    outlined?: boolean;
    primary?: boolean;
    className?: string;
    to?: string;
    onClick?(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.MouseEvent<HTMLAnchorElement>
    ): void;
}

const Button: React.FC<Props> = (props) => {
    const {
        onClick,
        ariaLabel = '',
        outlined = false,
        primary = true,
        className,
        to,
        children,
    } = props;
    const classNames = css('button', primary && 'primary', outlined && 'outlined', className);
    if (to) {
        return (
            <Link
                to={to}
                aria-label={ariaLabel}
                onClick={onClick}
                className={classNames}
            >
                {children}
            </Link>
        );
    }
    return (
        <button
            type="button"
            aria-label={ariaLabel}
            onClick={onClick}
            className={classNames}
        >
            {children}
        </button>
    );
};

export default Button;
