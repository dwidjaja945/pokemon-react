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

const getPokemonDataEndpoint = (id: number): string => `https://pokeapi.co/api/v2/pokemon/${id}`;
const getPokemonLocationEndpoint = (id: number): string => `https://api.craft-demo.net/pokemon/${id}`;

interface Props {
    savedPokemon: SavedPokemon;
    setSavedPokemon: React.Dispatch<SavedPokemon>;
}

interface Coords {
    lat: number;
    lng: number;
}

const Profile: React.FC<Props> = (props) => {
    const {
        id,
    } = useParams();
    const { savedPokemon, setSavedPokemon } = props;
    const [
        pokemonData,
        setPokemonData,
    ] = React.useState<any>(null);
    const [locations, setLocations] = React.useState<string[]>([]);

    const mapRef = React.useRef<HTMLDivElement | null>(null);
    const scriptLoaded = useScript(`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAP_API_KEY}&callback=initMap`, true, true);

    const createGoogleMap = (center: Coords): any => new (window as any).google.maps.Map(mapRef.current, {
        zoom: 10,
        center,
    });
    React.useEffect(() => {
        if (locations.length) {
            const firstLocation = locations[0];
            if (firstLocation) {
                const [lat, lng] = firstLocation?.split(',');
                const center: Coords = {
                    lat: Number(lat),
                    lng: Number(lng),
                };
                const map = createGoogleMap(center);
                locations.forEach((location) => {
                    const [lat, lng] = location.split(',');
                    const position: Coords = {
                        lat: Number(lat),
                        lng: Number(lng),
                    };
                    const marker = new (window as any).google.maps.Marker({
                        position,
                        map,
                    });
                });
            }
        }
    }, [scriptLoaded, locations]);

    React.useEffect(() => {
        const pokemonDataCall = makeCancelable(fetch(getPokemonDataEndpoint(id)));
        const locationCall = makeCancelable(fetch(getPokemonLocationEndpoint(id), {
            method: 'GET',
            headers: {
                'x-api-key': 'HHko9Fuxf293b3w56zAJ89s3IcO9D5enaEPIg86l',
            },
        }));
        pokemonDataCall.promise.then((res) => res.json()).then((response) => {
            setPokemonData(response);
        });
        locationCall.promise.then((res) => res.json()).then(({ locations }) => {
            setLocations(locations);
        });
        return (): void => {
            if (pokemonDataCall.isPending()) pokemonDataCall.cancel();
        };
    }, []);

    React.useEffect(() => {

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
                        <div className={css('type')} key={`type-${id}-${type.name}`}>
                            {capitalize(type?.name)}
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
                <div ref={mapRef} className={css('map')} />
            </div>
        </div>
    );
};
export default Profile;
