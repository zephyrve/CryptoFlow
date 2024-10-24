type UserPermission = {
    label: string;
    value: string;
};

export const userPermissions: UserPermission[] = [
    {
        label: "Sender",
        value: "0",
    },
    {
        label: "Recipient",
        value: "1",
    },
    {
        label: "Both",
        value: "2",
    },
    {
        label: "None",
        value: "3",
    },
];
