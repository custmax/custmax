"use client";
import React from 'react';

interface Transaction {
    id: number;
    buyer: string;
    purchaseDate: string;
    price: number;
}

const transactions: Transaction[] = [
    { id: 1, buyer: '张三', purchaseDate: '2023-09-01', price: 58 },
    { id: 2, buyer: '李四', purchaseDate: '2023-09-05', price: 45 },
    { id: 3, buyer: '王五', purchaseDate: '2023-09-10', price: 65 },
];

const MyTrade: React.FC = () => {
    return (
        <div className="p-8 bg-white rounded shadow-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">我的交易记录</h2>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">购书人</th>
                    <th className="border border-gray-300 p-2 text-left">购买时间</th>
                    <th className="border border-gray-300 p-2 text-left">价格 (元)</th>
                </tr>
                </thead>
                <tbody>
                {transactions.map(transaction => (
                    <tr key={transaction.id} className="border-b border-gray-300">
                        <td className="p-2">{transaction.buyer}</td>
                        <td className="p-2">{transaction.purchaseDate}</td>
                        <td className="p-2">{transaction.price}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyTrade;