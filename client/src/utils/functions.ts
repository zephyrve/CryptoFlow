export const calculateUnlockEvery = (
    Every: number,
    EveryType: number,
) => {
    let unlockSeconds = Every;
    switch (EveryType) {
        case 2:
            unlockSeconds *= 60;
            break;
        case 3:
            unlockSeconds *= 60 * 60;
            break;
        case 4:
            unlockSeconds *= 60 * 60 * 24;
            break;
        case 5:
            unlockSeconds *= 60 * 60 * 24 * 7;
            break;
        case 6:
            unlockSeconds *= 60 * 60 * 24 * 30;
            break;
        case 7:
            unlockSeconds *= 60 * 60 * 24 * 365;
            break;
    }
    return unlockSeconds;
};

export const truncateNumberByLength = (number: number, maxLength: number) => {
    const numberStr = number.toString();
    if (numberStr.length <= maxLength) {
        return number === 0 ? 0 : parseFloat(number.toFixed(4));
    }
    const truncatedStr = numberStr.slice(0, maxLength);
    const truncatedNumber = parseFloat(truncatedStr);
    return truncatedNumber === 0 ? 0 : parseFloat(truncatedNumber.toFixed(4));
};
