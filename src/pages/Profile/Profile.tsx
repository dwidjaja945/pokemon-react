import * as React from 'react';
import { useParams } from 'react-router-dom';
import {
    cssBind,
    getPokemonImage,
    capitalize,
    makeCancelable,
} from '@toolkit/helper';
import useScript from '@toolkit/hooks/useScript';
import { SavedPokemon } from '../../App';

import styles from './Profile.scss';

const css = cssBind(styles);

const getPokemonDataEndpoint = (id: number):string => `https://pokeapi.co/api/v2/pokemon/${id}`;

const GOOGLE_MAP_API_KEY = 'HHko9Fuxf293b3w56zAJ89s3IcO9D5enaEPIg86l';
// TODO - store in process.env

interface Props {
    savedPokemon: SavedPokemon;
    setSavedPokemon: React.Dispatch<SavedPokemon>;
}

const Profile: React.FC<Props> = (props) => {
    useScript(`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&callback=initMap`);
    const {
        id,
    } = useParams();
    const { savedPokemon, setSavedPokemon } = props;
    const [
        pokemonData,
        setPokemonData,
    ] = React.useState<any>(null);

    React.useEffect(() => {
        const cancelableCall = makeCancelable(fetch(getPokemonDataEndpoint(id)));

        cancelableCall.promise.then((res) => res.json()).then((response) => {
            setPokemonData(response);
        });
        return (): void => {
            if (cancelableCall.isPending()) cancelableCall.cancel();
        };
    }, []);

    React.useEffect(() => {
        const map = new google.maps.Map(
            document.getElementById('map') as HTMLElement,
            {
                zoom: 4,
                center: 
            }
        );
    }, []);
    
    const handleCheck = (): void => {
        if (savedPokemon[id]) {
            delete savedPokemon[id];
        } else {
            savedPokemon[id] = true;
        }
        setSavedPokemon({ ...savedPokemon });
    };

    const renderTypes = (): JSX.Element => {
        const { types } = pokemonData;
        return (
            <>
                {(types as any[]).map((typeData: any): JSX.Element => {
                    const { type } = typeData;
                    return (
                        <div className={css('type')}>
                            {capitalize(type.name)}
                        </div>
                    );
                })}
            </>
        );
    };

    if (!pokemonData) return null;

    return (
        <div className={css('container')}>
            <div className={css('leftPanel')}>
                <div className={css('imageContainer')}>
                    <img
                        src={getPokemonImage(id)}
                        className={css('image')}
                    />
                    <span className={css('name')}>
                        {capitalize(pokemonData.name)}
                    </span>
                </div>
                <div className={css('typeContainer')}>
                    <div className={css('typeTitle')}>Types:</div>
                    <div className={css('types')}>{renderTypes()}</div>
                </div>
                <div
                    className={css('bag')}
                >
                    In Bag:
                    <input
                        type="checkbox"
                        onChange={handleCheck}
                        checked={savedPokemon[id]}
                    />
                </div>
                <div className={css('description')}>
                    Lorem ipsum dolor sit, amet consectetur
                    adipisicing elit. Doloribus veniam laboriosam
                    rovident saepe commodi! Error, deleniti inventore
                    autem laborum et ratione labore placeat sed minus fuga
                    quis quidem modi incidunt reiciendis vitae hic, enim
                    perferendis ipsum repellendus officia quod dicta?
                </div>
            </div>
            <div>
                <div id="map" />
            </div>
        </div>
    );
};
export default Profile;
