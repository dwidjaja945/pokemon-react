import * as React from 'react';
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';
import { cssBind } from '@toolkit/helper';
import Button from '@components/Button';
import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Cancel';
import { makeCancelable } from '@toolkit/helper/makeCancelable';

import styles from './PokemonDisplay.scss';

const css = cssBind(styles);

const API_ENDPOINT = 'https://pokeapi.co/api/v2/pokedex/2';

interface Props {}

enum ToggleMode {
    ALL = 1,
    SAVED = 2,
}

const getImage = (id: number): string =>
    `https://pokeres.bastionbot.org/images/pokemon/${id}.png`;

const PokemonDisplay = (props: Props): JSX.Element => {
    const [toggleMode, setToggleMode] = React.useState(ToggleMode.ALL);
    const [skeletonLoading, setSkeletonLoading] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [pokemonList, setPokemonList] = React.useState<any[]>([]);
    const [searchValue, setSearchValue] = React.useState('');
    const pokemonListRef = React.useRef<any>([]);

    const handleToggleClick = (toggle: ToggleMode) => (): void => {
        setToggleMode(toggle);
    };

    const didMountRef = React.useRef(false);
    React.useEffect(() => {
        if (!didMountRef.current) {
            setSkeletonLoading(true);
            didMountRef.current = true;
        }
        setIsLoading(true);
        const cancelableCall = makeCancelable(fetch(API_ENDPOINT));
        cancelableCall.promise
            .then((res) => res.json())
            .then((resp: any): void => { // TODO - type api response
                setSkeletonLoading(false);
                setIsLoading(false);
                setPokemonList(resp.pokemon_entries);
                pokemonListRef.current = resp.pokemon_entries;
            });
        return () => {
            if (cancelableCall.isPending()) cancelableCall.cancel();
        };
    }, []);

    React.useEffect(() => {
        if (searchValue.length === 0) {
            setPokemonList(pokemonListRef.current);
            return;
        }
        const newList = pokemonList.filter(({ pokemon_species }): boolean => {
            const { name } = pokemon_species;
            return name.includes(searchValue);
        });
        setPokemonList(newList);
    }, [searchValue]);

    const getIcon = (): JSX.Element => {
        if (searchValue.length) {
            return (
                <button type="button" className={css('closeButton')} onClick={(): void => setSearchValue('')}>
                    <CancelIcon />
                </button>
            );
        }
        return <SearchIcon />;
    };

    const capitalizeName = (name: string): string => {
        const nameArray = name.split('');
        nameArray[0] = nameArray[0].toUpperCase();
        return nameArray.join('');
    };

    const renderList = (): JSX.Element => {
        if (skeletonLoading) {
            return (
                <>
                    {Array.from({ length: 20 }, (): JSX.Element => (
                        <li className={css('panel skeleton')} />
                    ))}
                </>
            );
        }
        if (isLoading) {
            return <>Loading...</>;
        }
        return (
            <>
                {pokemonList.map((pokemon): JSX.Element => {
                    const { entry_number, pokemon_species } = pokemon;
                    return (
                        <li>
                            <Link
                                to={`pokemon/${entry_number}`}
                                className={css('panel')}
                                aria-label={pokemon_species.name}
                            >
                                <img
                                    src={getImage(entry_number)}
                                    alt={pokemon_species.name}
                                    className={css('pokemonImage')}
                                />
                                <span className={css('name')}>{capitalizeName(pokemon_species.name)}</span>
                            </Link>
                        </li>
                    );
                })}
            </>
        );
    };

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
            <div className={css('inputContainer')}>
                <div className={css('inputContent')}>
                    <input
                        value={searchValue}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            setSearchValue(event.target.value)}
                        type="text"
                        placeholder="Search..."
                        className={css('input')}
                    />
                    <div className={css('searchIconContainer')}>{getIcon()}</div>
                </div>
            </div>
            <ul className={css('pokemonContainer')}>
                {renderList()}
            </ul>
        </div>
    );
};

export default PokemonDisplay;
