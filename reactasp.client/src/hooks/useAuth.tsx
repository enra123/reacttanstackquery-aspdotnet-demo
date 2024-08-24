import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { User } from '../Models.tsx';
import { getUserProfile, loginUser, registerUser, logoutUser } from '../AuthApi.tsx';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { data, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: getUserProfile,
        staleTime: Infinity,
        retry: false,
    });
    
    const user: User = (data) ? data : { email: '', permissions: [''] };
    const email = user.email;
    const permissions = user.permissions;

    // For Login
    const { mutateAsync: doLogin, isPending: isLoginPending, error: loginError } = useMutation({
        mutationFn: loginUser,
        onSuccess: () => {
            navigate("/");
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });

    // For Register
    const { mutateAsync: doRegister, isPending: isRegisterPending, error: registerError } = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            navigate("/login");
        },
    });

    // For Logout
    const doLogout = () => {
        logoutUser();
        navigate(0);
    }

    if (isLoading) {
        return <h4>loading...</h4>
    } else {
        return (
            <AuthContext.Provider value={{
                email, permissions, doRegister, isRegisterPending, registerError, doLogin, isLoginPending, loginError, doLogout
            }}>
                {children}
            </AuthContext.Provider>
        )
    }
};

export const useAuth = () => {
    const userData = useContext(AuthContext)
    return userData
};
