"use client";
import React, { useState } from 'react';
import { message } from "antd";

interface Book {
    id: number;
    title: string;
    price: number;
    cover: string; // 新增封面字段
}

const MyBooks: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([
        { id: 1, title: 'JavaScript 高级程序设计', price: 79.99, cover: '/img/emailMarketing/1.jpg' },
        { id: 2, title: '深入浅出 Node.js', price: 59.99, cover: 'https://example.com/cover2.jpg' },
        { id: 3, title: 'React 进阶', price: 89.99, cover: 'https://example.com/cover3.jpg' },
    ]);

    const [cart, setCart] = useState<Book[]>([]);
    const [showCart, setShowCart] = useState(false);

    const handleAddToCart = (book: Book) => {
        const existingBook = cart.find((item) => item.id === book.id);
        if (existingBook) {
            message.error("该书籍已在购物车中");
        } else {
            setCart([...cart, { ...book }]);
        }
    };

    const handleRemoveFromCart = (book: Book) => {
        setCart(cart.filter((item) => item.id !== book.id));
    };

    const totalPrice = cart.reduce((sum, book) => sum + book.price, 0);

    return (
        <div className="p-8 bg-white rounded-lg shadow-lg w-3/4 mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">我的图书</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {books.map((book) => (
                    <div key={book.id} className="flex flex-col border rounded-lg overflow-hidden shadow-sm">
                        <img src={book.cover} alt={book.title} className="w-full h-48 object-contain " />
                        <div className="p-4 flex flex-col">
                            <span className="font-semibold text-lg">{book.title}</span>
                            <span className="text-gray-600 mt-1">价格: ${book.price.toFixed(2)}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => setShowCart(!showCart)}
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                    {showCart ? '隐藏购物车' : '查看购物车'}
                </button>
            </div>
            {showCart && (
                <div className="mt-4 p-4 bg-gray-100 rounded">
                    <h3 className="text-lg font-bold">购物车内容</h3>
                    {cart.length === 0 ? (
                        <p>购物车为空</p>
                    ) : (
                        <div>
                            {cart.map((book) => (
                                <div key={book.id} className="flex justify-between items-center border-b py-2">
                                    <span>{book.title}</span>
                                    <span>价格: ${book.price.toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="flex justify-between font-bold mt-2">
                                <span>总价:</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyBooks;