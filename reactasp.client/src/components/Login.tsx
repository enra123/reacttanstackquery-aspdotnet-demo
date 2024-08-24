import { useEffect } from "react";
import { useForm } from "react-hook-form"

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Input from '@mui/material/Input';
import { ErrorMessage } from "@hookform/error-message";

import { FormValues } from '../Models.tsx';
import { useAuth } from "../hooks/useAuth";

export default function Login() {
    const { doLogin, isLoginPending, loginError } = useAuth();

    const { register, handleSubmit, setError, formState: { errors }, getFieldState } = useForm<FormValues>({
        defaultValues: {
            email: "",
            password: "",
            rememberme: false,
        },
    });

    const onSubmit = async (data: FormValues) => {
        await doLogin(data);
    }

    useEffect(() => {
        if (loginError) {
            setError('password', {
                type: "server",
                message: loginError.message,
            });
        }
    }, [loginError, setError]);

    return (
        <Card sx={{ minWidth: 275, maxWidth: 400, margin: 'auto' }}>
            <CardContent>
                <div className="containerbox" >
                    <h3>Login</h3>
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1 },
                        }}
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <FormControl error={getFieldState("email").invalid}>
                            <Input placeholder="Email" type="email" {...register("email", {
                                required: {
                                    value: true,
                                    message: "Email is required",
                                },
                            })}
                            />
                        
                            <ErrorMessage
                                errors={errors}
                                name="email"
                                render={({ message }) => (
                                    <FormHelperText>{message}</FormHelperText>
                                )}
                            />
                        </FormControl>
                        <FormControl error={getFieldState("password").invalid}>
                            <Input placeholder="Password" type="password" {...register("password", {
                                required: {
                                    value: true,
                                    message: "Password is required",
                                },
                            })}
                            />
                            <ErrorMessage
                                errors={errors}
                                name="password"
                                render={({ message }) => (
                                    <FormHelperText>{message}</FormHelperText>
                                )}
                            />
                        </FormControl>
                        <div>
                            <FormControlLabel control={<Checkbox {...register("rememberme")} />} label="Remember me" />
                        </div>
                        <div>
                            <Button variant="contained" type="submit" disabled={isLoginPending}>Login</Button>
                        </div>
                    </Box>
                </div>
            </CardContent>
        </Card>
        
    );
}
