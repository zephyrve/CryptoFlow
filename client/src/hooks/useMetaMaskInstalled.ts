import { useState, useEffect } from 'react';

const useMetaMaskInstalled = () => {
    const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkMetaMaskInstallation = () => {
            if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
                setIsMetaMaskInstalled(true);
            } else {
                setIsMetaMaskInstalled(false);
            }
            setIsLoading(false);
        };

        checkMetaMaskInstallation();

        const handleEthereumInjection = () => {
            checkMetaMaskInstallation();
        };

        window.addEventListener('ethereum#initialized', handleEthereumInjection);

        return () => {
            window.removeEventListener('ethereum#initialized', handleEthereumInjection);
        };
    }, []);

    return { isMetaMaskInstalled, isLoading };
};

export default useMetaMaskInstalled;
