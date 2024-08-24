export type FormValues = {
    email: string;
    password: string;
    rememberme?: boolean;
};

export type User = {
    email: string;
    permissions: string[];
};
