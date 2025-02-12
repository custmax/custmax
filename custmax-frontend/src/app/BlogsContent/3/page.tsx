// pages/posts/Post3.tsx

import React from 'react';

const Post3: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 bg-yellow-50">
            <h1 className="text-4xl font-bold mb-4 text-yellow-600">第三篇博客</h1>
            <p className="text-gray-700 mb-6">
                这里是第三篇博客的完整内容，提供了实用的技巧和建议。
            </p>
            <a href="/Blogs" className="text-blue-500 hover:underline">
                返回博客列表
            </a>
        </div>
    );
};

export default Post3;