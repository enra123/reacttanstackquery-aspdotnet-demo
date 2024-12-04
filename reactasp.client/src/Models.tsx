export type FormValues = {
    email: string;
    password: string;
    rememberme?: boolean;
};

export type User = {
    email: string;
    permissions: string[];
};

export type Wcldata = {
    key: number;
    time: number;
    abilityId: string;
    abilityName: string;
    imgUrl: string;
}

export type Wcldatafilter = {
    abilityId: string;
    imgUrl: string;
}
