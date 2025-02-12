// pages/Ebooks/Login.tsx
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {message} from "antd";
import {login, register} from "@/server/Ebooks/user";
import {SUCCESS_CODE} from "@/constant/common";
import {setLocalUser, setToken} from "@/util/storage";
import { TextField, IconButton, Button, Typography, Box, Alert } from '@mui/material';
import ForgotPwModal from "@/app/Ebooks/component/ForgotPwModal";
import {Visibility, VisibilityOff} from "@mui/icons-material"; // 使用 next/navigation 而不是 next/router

const LoginPage: React.FC = () => {
    const [identifier, setIdentifier] = useState(''); // 合并昵称和邮箱为一个输入
    const [password, setPassword] = useState('');
    const [turnstileToken, setTurnstileToken] = useState('');
    const router = useRouter();
    const [showForgotPw, setShowForgotPw] = useState<boolean>(false);


    const [showPassword, setShowPassword] = useState(false);
    const onForgotPwOk = () => {
        setShowForgotPw(false)
    }

    const onForgotPwCancel = () => {
        setShowForgotPw(false)
    }
    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        // 输入验证
        if (!identifier || !password) {
            message.error("请填写所有字段");
            return;
        }

        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

        // 使用类型断言明确 userData 的结构
        const userData: { email?: string; nickname?: string; password: string } = {
            password,
            ...(isEmail ? {email: identifier} : {nickname: identifier}),
        };

        try {
            message.loading({content: 'Login...', duration: 0});
            // @ts-ignore
            const res = await login(userData);

            message.destroy(); // 清除 loading

            if (res.code === SUCCESS_CODE) {
                const {token = '', firstName = '', lastName = '', avatar = '', id} = res?.data || {};
                setToken(token);
                setLocalUser({firstName, lastName, avatar, id});
                message.success({
                    content: '登录成功！',
                    onClose: () => {
                        router.push('/Ebooks/HomePage');
                    },
                });
            } else {
                message.error({content: res.message});
            }
        } catch (error) {
            message.error("登录请求失败，请重试");
            console.error('登录请求失败:', error);
        }
    };

    const onTurnstileVerify = (token: string) => {
        setTurnstileToken(token);
    };

    return (
        <div className="relative bg-gray-100 min-h-screen flex items-center justify-center p-8">
            {/* 背景图片 */}
            <img
                src="/img/Ebooks/backG.jpeg"
                alt="背景图"
                className="absolute inset-0 w-full h-full object-cover z-0"
            />

            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm z-10">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleLogin}>


                    <div className="mb-4">
                        <TextField
                            type="text"
                            label="Email or Nickname"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder=""
                            className="mt-1"
                        />
                    </div>
                    <div className="mb-4">
                        <TextField
                            type={showPassword ? 'text' : 'password'}
                            label="Password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder=""
                            InputProps={{
                                endAdornment: (
                                    <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                                        {showPassword ? <VisibilityOff/> : <Visibility/>}
                                    </IconButton>
                                ),
                            }}
                        />
                    </div>

                    <button type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                        Login
                    </button>
                </form>
                <div className="mt-4 text-left flex ">
                    <a href="/Ebooks/register" className="text-blue-600 hover:underline">Register an account</a>
                    <div className="grow"></div>
                    <a
                        onClick={() => setShowForgotPw(true)} // 假设您有一个状态来控制模态框的显示
                        className="text-blue-600 hover:underline cursor-pointer"
                    >
                        Forget password？
                    </a>
                </div>
            </div>

            {/* 模态框 */}
            <ForgotPwModal
                visible={showForgotPw}
                onOk={onForgotPwOk}
                onCancel={onForgotPwCancel}
            />
        </div>
    );
};

export default LoginPage;