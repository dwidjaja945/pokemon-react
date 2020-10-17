import * as React from 'react';
import { render } from '@testing-library/react';
import PokemonDisplay, { Props } from './PokemonDisplay';

const defaultProps: Props = {
    setSavedPokemon: jest.fn(),
    savedPokemon: {
        1: true,
    },
};

const Component = (props?: Partial<Props>): JSX.Element =>
    <PokemonDisplay {...defaultProps} {...props} />;

// TODO - unfortunately, test cases aren't working quite yet because
// I need to configure mocking window.fetch
// Fortunately, there are libraries like Mock Service Worker (https://github.com/mswjs/msw)
// that handle this issue. Recommended by Kent Dodds himself (https://kentcdodds.com/blog/stop-mocking-fetch)
// For now, these test cases will not successfully run
describe.skip('PokemonDisplay', () => {
    test('PokemonDisplay should render elements', () => {
        const { getByText } = render(<Component />);
        expect(getByText('All')).toBeInTheDocument();
        expect(getByText('Saved')).toBeInTheDocument();
    });

    test('PokemonDisplay should show skeleton when no data is present', () => {
        const { getByTestId } = render(<Component />);
        for (let i = 0; i < 20; i++) {
            expect(getByTestId(`skeleton-${i}`)).toBeInTheDocument();
        }
    });
});
