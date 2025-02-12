"use client";
import React, { useState } from 'react';

const UserInfo: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('张三');
    const [nickname, setNickname] = useState('小张');
    const [dob, setDob] = useState('1990-01-01');
    const [avatar, setAvatar] = useState<string | ArrayBuffer | null>(null);
    const [fileInput, setFileInput] = useState<File | null>(null);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
            setFileInput(file);
        }
    };

    const handleSave = () => {
        // 在这里可以添加保存逻辑，例如发送数据到后端
        console.log('保存用户信息:', { name, nickname, dob, avatar });

        // 关闭编辑模式
        setIsEditing(false);
    };

    return (
        <div className="p-8 bg-white rounded shadow-md max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4">我的信息</h2>
            <div className="flex flex-col mb-4">
                <label className="font-semibold">头像:</label>
                <div className="flex items-center">
                    {avatar ? (
                        <img src={avatar as string} alt="Avatar" className="w-20 h-20 rounded-full mr-4" />
                    ) : (
                        <div className="w-20 h-20 bg-gray-300 rounded-full mr-4" />
                    )}
                    {isEditing && (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="border border-gray-300 rounded p-2"
                        />
                    )}
                </div>
            </div>
            <div className="flex flex-col mb-4">
                <label className="font-semibold">姓名:</label>
                {isEditing ? (
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-gray-300 rounded p-2"
                    />
                ) : (
                    <p>{name}</p>
                )}
            </div>
            <div className="flex flex-col mb-4">
                <label className="font-semibold">昵称:</label>
                {isEditing ? (
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="border border-gray-300 rounded p-2"
                    />
                ) : (
                    <p>{nickname}</p>
                )}
            </div>
            <div className="flex flex-col mb-4">
                <label className="font-semibold">出生年月:</label>
                {isEditing ? (
                    <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="border border-gray-300 rounded p-2"
                    />
                ) : (
                    <p>{dob}</p>
                )}
            </div>
            <button
                onClick={isEditing ? handleSave : handleEditToggle}
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
                {isEditing ? '保存' : '编辑信息'}
            </button>
        </div>
    );
};

export default UserInfo;