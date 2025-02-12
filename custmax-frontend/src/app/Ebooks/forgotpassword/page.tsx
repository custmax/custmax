// pages/Ebooks/Login.tsx
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {message} from "antd";
import {login, register} from "@/server/Ebooks/user";
import {SUCCESS_CODE} from "@/constant/common";
import {setLocalUser, setToken} from "@/util/storage"; // 使用 next/navigation 而不是 next/router

const LoginPage: React.FC = () => {
    const [identifier, setIdentifier] = useState(''); // 合并昵称和邮箱为一个输入
    const [password, setPassword] = useState('');
    const [turnstileToken, setTurnstileToken] = useState('');
    const router = useRouter();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        // 输入验证
        if (!identifier || !password) {
            message.error("请填写所有字段");
            return;
        }

        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

        // 使用类型断言明确 userData 的结构
        const userData: { email?: string; nickname?: string; password: string} = {
            password,
            ...(isEmail ? { email: identifier } : { nickname: identifier }),
        };

        try {
            message.loading({ content: 'Login...', duration: 0 });
            // @ts-ignore
            const res = await login(userData);

            message.destroy(); // 清除 loading

            if (res.code === SUCCESS_CODE) {
                const { token = '', firstName = '', lastName = '', avatar = '', id } = res?.data || {};
                setToken(token);
                setLocalUser({ firstName, lastName, avatar, id });
                message.success({
                    content: '登录成功！',
                    onClose: () => {
                        router.push('/Ebooks');
                    },
                });
            } else {
                message.error({ content: res.message });
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
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-8">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">登录</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="identifier">邮箱或昵称</label>
                        <input
                            type="text"
                            id="identifier"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="请输入邮箱或昵称"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="password">密码</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="请输入密码"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                        登录
                    </button>
                </form>
                <div className="mt-4 text-left flex ">
                    <a href="/Ebooks/register" className="text-blue-600 hover:underline">注册新账户</a>
                    <div className="grow"></div>
                    <a href="/Ebooks/forgotpassword" className="text-blue-600 hover:underline">忘记密码？</a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;