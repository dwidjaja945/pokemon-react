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

const App = (): JSX.Element => (
    <div>
        <Header />
        <div className={css('container')}>
            <Switch>
                <Route path="/">
                    <Suspense {...defaultSuspense}>
                        <PokemonDisplay />
                    </Suspense>
                </Route>
            </Switch>
        </div>
    </div>
);

export default App;
