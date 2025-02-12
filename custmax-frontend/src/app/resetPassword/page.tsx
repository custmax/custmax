'use client';

import React, { useEffect, useState } from 'react';
import { TextField, IconButton, Button, Typography, Box, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import styles from './page.module.scss';
import { useSearchParams } from 'next/navigation';
import { forgetPassword } from "@/server/forgetPassword";
import {SUCCESS_CODE} from "@/constant/common"; // 请根据你的项目目录调整路径

const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const email = searchParams.get('email');
        if (email) {
            setEmail(email);
        } else {
            setMessage({ text: 'Invalid email parameter.', type: 'error' });
        }
    }, [searchParams]);

    const handlePasswordReset = async () => {
        if (newPassword !== confirmPassword) {
            setMessage({ text: 'Passwords do not match.', type: 'error' });
            return;
        }
        if (!email) {
            setMessage({ text: 'Email is not available.', type: 'error' });
            return;
        }
        console.log(newPassword)
        try {
            const res = await forgetPassword(email, newPassword);

            if (res.code === SUCCESS_CODE) {
                setMessage({ text: 'Your password has been reset successfully . You can log in with your new password.', type: 'success' });
            } else {

                setMessage({ text: 'Failed to reset password. Please try again.', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'An error occurred. Please try again.', type: 'error' });
        }
    };

    return (
        <Box className={styles.container}>
            <Box className={styles.card}>
                <img className={styles.logo} src="/img/logo2.png" alt="CusOb logo" />
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', marginBottom: '1rem' }}>
                    Reset Password
                </Typography>
                <TextField
                    type={showPassword ? 'text' : 'password'}
                    label="New Password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        ),
                    }}
                />
                <TextField
                    type={showConfirmPassword ? 'text' : 'password'}
                    label="Retype New Password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)}>
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        ),
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handlePasswordReset}
                    disabled={!newPassword || !confirmPassword}
                    className={styles.button}
                >
                    Reset password
                </Button>
                {message && (
                    <Alert severity={message.type} className={styles.message}>
                        {message.text}
                    </Alert>
                )}
            </Box>
        </Box>
    );
};

export default ResetPassword;
