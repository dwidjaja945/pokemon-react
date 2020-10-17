export const getPokemonImage = (id: number): string =>
    `https://pokeres.bastionbot.org/images/pokemon/${id}.png`;
export const capitalize = (name: string): string => {
    const nameArray = name.split('');
    nameArray[0] = nameArray[0].toUpperCase();
    return nameArray.join('');
};
