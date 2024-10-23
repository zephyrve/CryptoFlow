export const VIDEO_DEMO_URL = 'https://vimeo.com/1017128833'
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as any

export const CONTRACT_ABI = [
    {
        "type": "constructor",
        "inputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "receive",
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "cancelPaymentRequest",
        "inputs": [
            {
                "name": "_requestId",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "sendToEmitter",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "createOneTimePayment",
        "inputs": [
            {
                "name": "_settings",
                "type": "tuple",
                "internalType": "struct Structs.OneTimeSetting",
                "components": [
                    {
                        "name": "tokenAddress",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "isNativeToken",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "startDate",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "isPayNow",
                        "type": "bool",
                        "internalType": "bool"
                    }
                ]
            },
            {
                "name": "_recipients",
                "type": "tuple[]",
                "internalType": "struct Structs.OneTimeRecipient[]",
                "components": [
                    {
                        "name": "recipient",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "amount",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "createRecurringPayments",
        "inputs": [
            {
                "name": "_settings",
                "type": "tuple",
                "internalType": "struct Structs.RecurringSetting",
                "components": [
                    {
                        "name": "tokenAddress",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "isNativeToken",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "startDate",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "whoCanCancel",
                        "type": "uint8",
                        "internalType": "uint8"
                    },
                    {
                        "name": "whoCanTransfer",
                        "type": "uint8",
                        "internalType": "uint8"
                    }
                ]
            },
            {
                "name": "_recipients",
                "type": "tuple[]",
                "internalType": "struct Structs.RecurringRecipient[]",
                "components": [
                    {
                        "name": "recipient",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "unlockEvery",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "unlockAmountPerTime",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "numberOfUnlocks",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "prepaidPercentage",
                        "type": "uint8",
                        "internalType": "uint8"
                    }
                ]
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "deposit",
        "inputs": [
            {
                "name": "_tokenAddress",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_amount",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "getBlockTimestamp",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getBlockTimestampNew",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getRecipientRequests",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "tuple[]",
                "internalType": "struct Structs.PaymentRequest[]",
                "components": [
                    {
                        "name": "requestId",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "sender",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "tokenAddress",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "isNativeToken",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "startDate",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "paymentAmount",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "remainingBalance",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "prepaidPercentage",
                        "type": "uint8",
                        "internalType": "uint8"
                    },
                    {
                        "name": "unlockAmountPerTime",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "unlockEvery",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "numberOfUnlocks",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "recipient",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "whoCanCancel",
                        "type": "uint8",
                        "internalType": "uint8"
                    },
                    {
                        "name": "whoCanTransfer",
                        "type": "uint8",
                        "internalType": "uint8"
                    },
                    {
                        "name": "status",
                        "type": "uint8",
                        "internalType": "uint8"
                    }
                ]
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getSenderRequests",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "tuple[]",
                "internalType": "struct Structs.PaymentRequest[]",
                "components": [
                    {
                        "name": "requestId",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "sender",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "tokenAddress",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "isNativeToken",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "startDate",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "paymentAmount",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "remainingBalance",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "prepaidPercentage",
                        "type": "uint8",
                        "internalType": "uint8"
                    },
                    {
                        "name": "unlockAmountPerTime",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "unlockEvery",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "numberOfUnlocks",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "recipient",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "whoCanCancel",
                        "type": "uint8",
                        "internalType": "uint8"
                    },
                    {
                        "name": "whoCanTransfer",
                        "type": "uint8",
                        "internalType": "uint8"
                    },
                    {
                        "name": "status",
                        "type": "uint8",
                        "internalType": "uint8"
                    }
                ]
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getUserTokensBalance",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "tuple[]",
                "internalType": "struct Structs.Balance[]",
                "components": [
                    {
                        "name": "tokenAddress",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "balance",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "lockedAmount",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "owner",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "paused",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "renounceOwnership",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "transferOwnership",
        "inputs": [
            {
                "name": "newOwner",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "transferPaymentRequest",
        "inputs": [
            {
                "name": "_requestId",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_to",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "sendToOldRecipient",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "withdrawBalance",
        "inputs": [
            {
                "name": "_tokenAddress",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_amount",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "withdrawFromPaymentRequest",
        "inputs": [
            {
                "name": "_requestId",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_amount",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "event",
        "name": "CancelPaymentRequest",
        "inputs": [
            {
                "name": "_caller",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "_requestId",
                "type": "uint256",
                "indexed": true,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "CreateOneTimePayment",
        "inputs": [
            {
                "name": "_sender",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "CreateRecurringPayment",
        "inputs": [
            {
                "name": "_sender",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "Deposit",
        "inputs": [
            {
                "name": "_sender",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "_tokenAddress",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "_amount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "OwnershipTransferred",
        "inputs": [
            {
                "name": "previousOwner",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "newOwner",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "Paused",
        "inputs": [
            {
                "name": "account",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "Receive",
        "inputs": [
            {
                "name": "_sender",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "_amount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "TransferPaymentRequest",
        "inputs": [
            {
                "name": "_caller",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "_requestId",
                "type": "uint256",
                "indexed": true,
                "internalType": "uint256"
            },
            {
                "name": "to",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "Unpaused",
        "inputs": [
            {
                "name": "account",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "WithdrawBalance",
        "inputs": [
            {
                "name": "_caller",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "_tokenAddress",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "amount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "WithdrawFromPaymentRequest",
        "inputs": [
            {
                "name": "_caller",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "_requestId",
                "type": "uint256",
                "indexed": true,
                "internalType": "uint256"
            },
            {
                "name": "_amount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "error",
        "name": "EnforcedPause",
        "inputs": []
    },
    {
        "type": "error",
        "name": "ExpectedPause",
        "inputs": []
    },
    {
        "type": "error",
        "name": "OwnableInvalidOwner",
        "inputs": [
            {
                "name": "owner",
                "type": "address",
                "internalType": "address"
            }
        ]
    },
    {
        "type": "error",
        "name": "OwnableUnauthorizedAccount",
        "inputs": [
            {
                "name": "account",
                "type": "address",
                "internalType": "address"
            }
        ]
    },
    {
        "type": "error",
        "name": "ReentrancyGuardReentrantCall",
        "inputs": []
    }
]
