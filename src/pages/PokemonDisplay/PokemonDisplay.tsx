import * as React from 'react';
import { cssBind } from '@toolkit/helper';
import Button from '@components/Button';
import { makeCancelable } from '@toolkit/helper/makeCancelable';

import styles from './PokemonDisplay.scss';

const css = cssBind(styles);

const API_ENDPOINT = 'https://pokeapi.co/api/v2/pokemon/?limit=153';

interface Props {}

interface Pokemon {
    name: string;
    url: string;
}
interface ApiResponse {
    count: number;
    next: null | string;
    previous: null | string;
    results: Pokemon[];
}

enum ToggleMode {
    ALL = 1,
    SAVED = 2,
}

const PokemonDisplay = (props: Props): JSX.Element => {
    const [toggleMode, setToggleMode] = React.useState(ToggleMode.ALL);
    const [pokemonList, setPokemonList] = React.useState<Pokemon[]>([]);

    const handleToggleClick = (toggle: ToggleMode) => (): void => {
        setToggleMode(toggle);
    };

    React.useEffect(() => {
        const cancelableCall = makeCancelable(fetch(API_ENDPOINT));
        cancelableCall.promise
            .then((res) => res.json())
            .then((resp: ApiResponse): void => {
                setPokemonList(resp.results);
            });
        return () => {
            if (cancelableCall.isPending()) cancelableCall.cancel();
        };
    }, []);

    return (
        <div className={css('container')}>
            <div className={css('buttonToggle')}>
                <Button
                    outlined={toggleMode !== ToggleMode.ALL}
                    className={css('button')}
                    onClick={handleToggleClick(ToggleMode.ALL)}
                >
                    All
                </Button>
                <Button
                    outlined={toggleMode === ToggleMode.ALL}
                    className={css('button')}
                    onClick={handleToggleClick(ToggleMode.SAVED)}
                >
                    Saved
                </Button>
            </div>
            <div className={css('pokemonContainer')} />
        </div>
    );
};

export default PokemonDisplay;
