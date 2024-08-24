import { useEffect } from "react";
import { useForm } from "react-hook-form"

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import { ErrorMessage } from "@hookform/error-message";

import { FormValues } from '../Models.tsx';
import { useAuth } from "../hooks/useAuth";

export default function Register() {
    const { doRegister, isRegisterPending, registerError } = useAuth();
    const { register, handleSubmit, setError, formState: { errors }, getFieldState } = useForm<FormValues>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: FormValues) => {
        await doRegister(data);
    }

    useEffect(() => {
        if (registerError) {
            setError('password', {
                type: "server",
                message: registerError.message,
            });
        }
    }, [registerError, setError]);

    return (
        <Card sx={{ minWidth: 275, maxWidth: 400, margin: 'auto' }}>
            <CardContent>
                <div className="containerbox">
                    <h3>Register</h3>
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
                                validate: {
                                    isValidEmail: (value) =>
                                        /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(value) || "Email is not valid",
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
                                validate: {
                                    minLength: (value) =>
                                        value.length >= 8 || "Minimum length of password is 8 characters",
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
                            <Button variant="contained" type="submit" disabled={isRegisterPending}>Register</Button>
                        </div>
                    </Box>

                </div>
            </CardContent>
        </Card>
        
    );
}
