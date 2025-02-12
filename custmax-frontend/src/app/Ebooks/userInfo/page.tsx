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
        console.log('保存用户信息:', { name, nickname, dob, avatar });
        setIsEditing(false);
    };

    return (
        <div className="p-8 bg-white rounded-lg shadow-lg w-3/4 mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">我的信息</h2>
            <div className="flex flex-col mb-6">
                <label className="font-semibold">头像:</label>
                <div className="flex items-center">
                    {avatar ? (
                        <img src={avatar as string} alt="Avatar" className="w-24 h-24 rounded-full border-2 border-gray-300 mr-4 shadow-md" />
                    ) : (
                        <div className="w-24 h-24 bg-gray-300 rounded-full mr-4" />
                    )}
                    {isEditing && (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="border border-gray-300 rounded p-2 hover:border-gray-400 transition"
                        />
                    )}
                </div>
            </div>
            <div className="flex flex-col mb-6">
                <label className="font-semibold">姓名:</label>
                {isEditing ? (
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500 transition"
                    />
                ) : (
                    <p className="text-lg text-gray-700">{name}</p>
                )}
            </div>
            <div className="flex flex-col mb-6">
                <label className="font-semibold">昵称:</label>
                {isEditing ? (
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500 transition"
                    />
                ) : (
                    <p className="text-lg text-gray-700">{nickname}</p>
                )}
            </div>
            <div className="flex flex-col mb-6">
                <label className="font-semibold">出生年月:</label>
                {isEditing ? (
                    <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500 transition"
                    />
                ) : (
                    <p className="text-lg text-gray-700">{dob}</p>
                )}
            </div>
            <button
                onClick={isEditing ? handleSave : handleEditToggle}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
                {isEditing ? '保存' : '编辑信息'}
            </button>
        </div>
    );
};

export default UserInfo;