// @ts-ignore
"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { login } from "@/server/Ebooks/user";
import { islogin } from "@/server/user";
import {SUCCESS_CODE} from "@/constant/common";

const EbookPage: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [cart, setCart] = useState<number[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 用户登录状态
    const [userName, setUserName] = useState(''); // 用户昵称
    const [password, setPassword] = useState('');
    const [identifier, setIdentifier] = useState('');

    // 电子书示例数据
    const ebooks = [
        { id: 1, title: 'React for Beginners', author: 'John Doe', price: 10 },
        { id: 2, title: 'Advanced Tailwind CSS', author: 'Jane Smith', price: 15 },
        { id: 3, title: 'Understanding Shadcn', author: 'Alice Johnson', price: 12 },
    ];

    const handleLinkClick = () => {
        setOpen(false);
        // 在这里添加跳转逻辑
    };

    const addToCart = (id: number) => {
        setCart([...cart, id]);
    };

    // 模拟请求函数，检查用户是否已登录
    const checkLoginStatus = async () => {
        try {
            const data = await islogin(); // 直接调用
            console.log('Data:', data); // 打印数据

            if (data.code === SUCCESS_CODE) {
                setIsLoggedIn(true);
                setUserName(data.data.nickName);

            } else {
                console.error('Login failed, code:', data.code);
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            setIsLoggedIn(false);
        }
    };

    useEffect(() => {
        checkLoginStatus(); // 组件挂载时检查登录状态
    }, []);

    useEffect(() => {
        console.log('Is logged in:', isLoggedIn);
        console.log('User name:', userName);
    }, [isLoggedIn, userName]); // 监听状态变化

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center">
            <nav className="flex justify-center w-full items-center p-4 bg-gray-100 text-black">
                <div className="flex items-center w-3/4 justify-center">
                    <div className="text-3xl font-bold">首页</div>
                    <div className="flex-grow"></div>
                    <div>
                        {isLoggedIn ? (
                            <button className="ml-10 text-blue-600 hover:underline">
                                <Link href="/Ebooks">
                                    欢迎回来, {userName}
                                </Link>
                            </button>
                        ) : (
                            <button className="ml-10 text-blue-600 hover:underline">
                                <Link href="/Ebooks/Login">
                                    登录
                                </Link>
                            </button>
                        )}
                    </div>
                </div>
            </nav>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-3/4 pt-8">
                {ebooks.map((ebook) => (
                    <div key={ebook.id} className="bg-white shadow-md rounded-lg p-4">
                        <h3 className="text-lg font-semibold">{ebook.title}</h3>
                        <p className="text-gray-600">作者: {ebook.author}</p>
                        <p className="text-xl font-bold">${ebook.price}</p>
                        <button
                            className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
                            onClick={() => addToCart(ebook.id)}
                        >
                            添加到购物车
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EbookPage;