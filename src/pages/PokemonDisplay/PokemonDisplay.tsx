import * as React from 'react';
import { Link } from 'react-router-dom';
import { cssBind, getPokemonImage, capitalize } from '@toolkit/helper';
import Button from '@components/Button';
import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Cancel';
import { makeCancelable } from '@toolkit/helper/makeCancelable';
import { SavedPokemon } from '../../App';

import styles from './PokemonDisplay.scss';

const css = cssBind(styles);

const API_ENDPOINT = 'https://pokeapi.co/api/v2/pokedex/2';

interface Props {
    savedPokemon: SavedPokemon;
    setSavedPokemon: React.Dispatch<SavedPokemon>;
}

enum ToggleMode {
    ALL = 1,
    SAVED = 2,
}

const PokemonDisplay: React.FC<Props> = (props) => {
    const [toggleMode, setToggleMode] = React.useState(ToggleMode.ALL);
    const [skeletonLoading, setSkeletonLoading] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [pokemonList, setPokemonList] = React.useState<any[]>([]);
    const [searchValue, setSearchValue] = React.useState('');
    const pokemonListRef = React.useRef<any>([]);

    const { savedPokemon, setSavedPokemon } = props;

    const handleToggleClick = (toggle: ToggleMode) => (): void => {
        setToggleMode(toggle);
    };

    React.useEffect(() => {
        let newList = pokemonListRef.current;
        if (toggleMode === ToggleMode.SAVED) {
            newList = [];
            pokemonListRef.current?.forEach((pokemon: any) => {
                const { entry_number } = pokemon;
                if (savedPokemon[entry_number]) newList.push(pokemon);
            });
        }
        setPokemonList(newList);
    }, [toggleMode]);

    const getSavedPokemon = (entries: any): void => {
        const saved: SavedPokemon = {};
        entries.forEach(({ entry_number }: any): void => {
            const item = localStorage.getItem(entry_number);
            if (item) {
                saved[entry_number] = true;
            }
        });
        setSavedPokemon(saved);
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
                getSavedPokemon(resp.pokemon_entries);
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

    const renderList = (): JSX.Element => {
        if (skeletonLoading) {
            return (
                <>
                    {Array.from({ length: 20 }, (_, index): JSX.Element => (
                        <li key={index} className={css('panel skeleton')} />
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
                        <li
                            key={entry_number}
                        >
                            <Link
                                to={`pokemon/${entry_number}`}
                                className={css('panel')}
                                aria-label={pokemon_species.name}
                            >
                                <img
                                    src={getPokemonImage(entry_number)}
                                    alt={pokemon_species.name}
                                    className={css('pokemonImage')}
                                />
                                <span className={css('name')}>{capitalize(pokemon_species.name)}</span>
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
