// pages/Ebooks/Register.tsx
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Turnstile from "@/component/Turnstile";
import {message} from "antd";
import {sendVerifyCode, register, sendPhoneCode} from '@/server/Ebooks/user';
import {SUCCESS_CODE} from "@/constant/common";

const RegisterPage: React.FC = () => {
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [turnstileToken, setTurnstileToken] = useState('');
    const router = useRouter();


    const onTurnstileVerify = (token: string) => {
        setTurnstileToken(token);
    };

    const handleTurnstileCallback = (token: string) => {
        setTurnstileToken(token);
    };

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert("密码不匹配，请重新输入");
            return;
        }

        // if (!turnstileToken) {
        //     alert("请完成 Turnstile 验证。");
        //     return;
        // }

        const userData = {
            nickname,
            email,
            password,
            turnstileToken,
        };

        try {
            message.loading({ content: '注册中...', duration: 0 });
            const res = await register(userData); // 调用 register 函数

            message.destroy(); // 清除 loading

            if (res.code === SUCCESS_CODE) {
                message.success({
                    content: '注册成功！请检查你的邮箱以激活账户。',
                    onClose: () => {
                        router.push('/Ebooks/Login'); // 注册成功后跳转到登录页
                    },
                });
            } else {
                message.error({ content: res.message || '注册失败，请重试' });
            }
        } catch (error) {
            message.destroy();
            console.error('注册请求失败:', error);
            alert('注册请求失败，请重试');
        }
    };


    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-8">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">注册新账户</h2>
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="nickname">昵称</label>
                        <input
                            type="text"
                            id="nickname"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="请输入昵称"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="email">邮箱</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="请输入邮箱"
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
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="confirmPassword">确认密码</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="请再次输入密码"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                            required
                        />
                    </div>
                    {/* Turnstile 验证 */}
                    <div className="mb-4">

                        <Turnstile onVerify={onTurnstileVerify}/>
                        <div className="turnstile" data-sitekey="YOUR_TURNSTILE_SITE_KEY" data-callback={handleTurnstileCallback}></div>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                        注册
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-gray-600">已经有账户？<a href="/Ebooks/Login" className="text-blue-600 hover:underline">登录</a></p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;