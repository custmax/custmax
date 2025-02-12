'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // 确保使用正确的 useRouter
import { addGroup } from '@/server/group';
import { message } from 'antd';
import { SUCCESS_CODE } from "@/constant/common";

const GroupAdder = () => {
    const router = useRouter();
    const [showModal, setShowModal] = useState(true);
    const [groupName, setGroupName] = useState<string>('');

    const handleGroupOk = async () => {
        if (groupName) {
            const res = await addGroup(groupName);
            if (res.code === SUCCESS_CODE) {
                message.success(res.message);
                router.back();
            } else {
                message.error(res.message);
            }
            setShowModal(false);
            setGroupName('');
        } else {
            alert("请输入组名");
        }
    };

    const handleGroupCancel = () => {
        setShowModal(false);
        setGroupName('');
        router.back();
    };

    return (
        <>
            {/* 触发 Modal 的按钮 */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded shadow-lg p-6 w-96">
                        <label htmlFor="groupName" className="mb-2 block">组名:</label>
                        <input
                            type="text"
                            id="groupName"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="border rounded p-2 w-full mb-4"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={handleGroupCancel}
                                className="bg-gray-300 text-gray-700 rounded px-4 py-2 mr-2"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleGroupOk}
                                className="bg-blue-500 text-white rounded px-4 py-2"
                            >
                                确定
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GroupAdder;