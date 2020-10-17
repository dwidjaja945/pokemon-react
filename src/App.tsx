import React, { Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from '@components/Header';
import Loader from '@components/Loader';
import { cssBind } from '@toolkit/helper';

import styles from './App.scss';

const css = cssBind(styles);

const defaultSuspense = {
    fallback: <Loader />,
};

const PokemonDisplay = lazy(() => import(/* webpackChunkName: "PokemonDisplay" */'./pages/PokemonDisplay'));
const Profile = lazy(() => import(/* webpackChunkName: "PokemonDisplay" */'./pages/Profile'));

export interface SavedPokemon {
    [key: string]: boolean;
}

const App = (): JSX.Element => {
    const [savedPokemon, setSavedPokemon] = React.useState<SavedPokemon>({});

    const savePokemon = (id: string): void => {
        const item = localStorage.getItem(id);
        if (!item) {
            localStorage.setItem(id, 'true');
        } else {
            localStorage.removeItem(id);
        }
    };

    return (
        <div>
            <Header />
            <div className={css('container')}>
                <Switch>
                    <Route exact path="/">
                        <Suspense {...defaultSuspense}>
                            <PokemonDisplay
                                savedPokemon={savedPokemon}
                                setSavedPokemon={setSavedPokemon}
                            />
                        </Suspense>
                    </Route>
                    <Route exact path="/pokemon/:id">
                        <Suspense {...defaultSuspense}>
                            <Profile savedPokemon={savedPokemon} savePokemon={savePokemon} />
                        </Suspense>
                    </Route>
                </Switch>
            </div>
        </div>
    );
};

export default App;
