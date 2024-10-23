import React from 'react';
import {ReloadIcon} from "@radix-ui/react-icons";

const Loader = ({isShow, className}: {
    isShow: boolean,
    className: string,
}) => {
    return (
        <>
            {isShow
                ? <div className={className}><ReloadIcon className="h-4 w-4 animate-spin"/></div>
                : <></>
            }
        </>
    );
};

export default Loader;