export const useAddress = () => {
    const getShortAddress = (address: string, length: number = 4) => {
        return address
            .slice(0, length)
            .concat("...")
            .concat(address.slice(address.length - length, address.length));
    };

    return {getShortAddress};
};
