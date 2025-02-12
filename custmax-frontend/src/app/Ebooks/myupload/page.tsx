"use client";
import React, { useState } from 'react';

const MyUpload: React.FC = () => {
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [author, setAuthor] = useState('');
    const [cover, setCover] = useState<string | ArrayBuffer | null>(null);
    const [fileInput, setFileInput] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCover(reader.result);
            };
            reader.readAsDataURL(file);
            setFileInput(file);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Here you can add logic to send data to the backend
        console.log('上传的书籍信息:', { title, details, price, author, cover });
        // Reset the form after submission
        setTitle('');
        setDetails('');
        setPrice('');
        setAuthor('');
        setCover(null);
        setFileInput(null);
    };

    return (
        <div className="p-8 bg-white rounded shadow-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">我的上传</h2>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col mb-4">
                    <label className="font-semibold">书名:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border border-gray-300 rounded p-2"
                        required
                    />
                </div>
                <div className="flex flex-col mb-4">
                    <label className="font-semibold">详情:</label>
                    <textarea
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="border border-gray-300 rounded p-2"
                        required
                    />
                </div>
                <div className="flex flex-col mb-4">
                    <label className="font-semibold">价格 (元):</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value ? parseFloat(e.target.value) : '')}
                        className="border border-gray-300 rounded p-2"
                        required
                    />
                </div>
                <div className="flex flex-col mb-4">
                    <label className="font-semibold">作者:</label>
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="border border-gray-300 rounded p-2"
                        required
                    />
                </div>
                <div className="flex flex-col mb-4">
                    <label className="font-semibold">封面:</label>
                    <div className="flex items-center">
                        {cover ? (
                            <img src={cover as string} alt="Cover" className="w-20 h-20 rounded-full mr-4" />
                        ) : (
                            <div className="w-20 h-20 bg-gray-300 rounded-full mr-4" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="border border-gray-300 rounded p-2"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    上传书籍
                </button>
            </form>
        </div>
    );
};

export default MyUpload;