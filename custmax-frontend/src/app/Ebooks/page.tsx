// pages/Ebooks/EbookPage.tsx
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import UserInfo from './userInfo/page'; // 导入 UserInfo 组件
import MyBooks from './MyBooks/page';
import MyAccount from './myaccount/page'// 导入 MyBooks 组件
import MyTrade from './mytrade/page'// 导入 MyBooks 组件
import MyUpload from './myupload/page'// 导入 MyBooks 组件


const EbookPage: React.FC = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true); // 用户登录状态
    const [activeTab, setActiveTab] = useState<'userinfo' | 'mybooks' | 'myaccount' | 'mytrade' | 'myupload'>('userinfo');

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleLogin = () => {
        // 跳转到登录页面
        window.location.href = '/Ebooks/Login'; // 跳转到登录页面
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center p-8">
            <header className="w-3/4 mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold">电子书商店</h1>
                <div className="relative">
                    <button
                        className="bg-blue-600 text-white py-2 px-4 rounded"
                        onClick={isLoggedIn ? toggleDropdown : handleLogin}
                    >
                        {isLoggedIn ? '我的账户' : '登录'}
                    </button>
                    {showDropdown && isLoggedIn && (
                        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
                            <ul className="py-2">
                                <button
                                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                                    onClick={handleLogout}
                                >
                                    登出
                                </button>
                            </ul>
                        </div>
                    )}
                </div>
            </header>

            {/* 选项卡导航 */}
            <div className="hidden sm:block w-full mb-4">
                <nav className="-mb-px flex w-full justify-center " aria-label="Tabs">
                    <div className="border-b w-3/4 flex border-gray-200 gap-6">
                        <button
                            onClick={() => setActiveTab('userinfo')}
                            className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${
                                activeTab === 'userinfo' ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            }`}
                        >
                            我的信息
                        </button>
                        <button
                            onClick={() => setActiveTab('mybooks')}
                            className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${
                                activeTab === 'mybooks' ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            }`}
                        >
                            我的图书
                        </button>
                        <button
                            onClick={() => setActiveTab('myaccount')}
                            className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${
                                activeTab === 'myaccount' ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            }`}
                        >
                            我的账户
                        </button>
                        <button
                            onClick={() => setActiveTab('mytrade')}
                            className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${
                                activeTab === 'mytrade' ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            }`}
                        >
                            我的交易
                        </button>

                        <button
                            onClick={() => setActiveTab('myupload')}
                            className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${
                                activeTab === 'myupload' ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            }`}
                        >
                            我的上传
                        </button>

                    </div>
                </nav>

            </div>

            {/* 根据选中的选项卡渲染内容 */}
            {activeTab === 'userinfo' && <UserInfo/>}
            {activeTab === 'mybooks' && <MyBooks/>}
            {activeTab === 'myaccount' && <MyAccount/>}
            {activeTab === 'mytrade' && <MyTrade/>}
            {activeTab === 'myupload' && <MyUpload/>}

        </div>
    );
};

export default EbookPage;