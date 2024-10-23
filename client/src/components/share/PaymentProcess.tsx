import {useEffect, useState} from "react";
import {getUnlockSetting} from "@/utils/paymentRequest";
import {calculateUnlockEvery} from "@/utils/funstions";

let i: any = null;
const PaymentProcess = ({payment}: any) => {
    const [unlockAmount, setUnlockAmount] = useState(0);
    const [firstLoading, setFirstLoading] = useState(false);

    useEffect(() => {
        const {unlockedAmount} = getUnlockSetting(payment);
        setUnlockAmount(unlockedAmount);

        if (!firstLoading) {
            const paymentAmount = payment.paymentAmount;
            const timeToUnlock = calculateUnlockEvery(
                payment.unlockEvery,
                payment.unlockEveryType,
            );

            if (payment.status === 1) {
                i = setInterval(function () {
                    const {unlockedAmount} = getUnlockSetting(payment);
                    setUnlockAmount(unlockedAmount);
                }, timeToUnlock * 1000);
            } else {
                if (i) {
                    clearInterval(i);
                }
                setUnlockAmount(paymentAmount);
            }
            setFirstLoading(true);
        }
    }, [firstLoading, payment]);

    return <span>{unlockAmount} / {payment.paymentAmount}</span>
};
export default PaymentProcess
