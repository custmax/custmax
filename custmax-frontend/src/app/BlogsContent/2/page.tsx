// pages/posts/Post2.tsx

import React from 'react';

const Post2: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 bg-green-50">
            <h1 className="text-4xl font-bold mb-4 text-green-600">第二篇博客</h1>
            <p className="text-gray-700 mb-6">
                这里是第二篇博客的完整内容，进一步探讨了相关概念。
            </p>
            <a href="/Blogs" className="text-blue-500 hover:underline">
                返回博客列表
            </a>
        </div>
    );
};

export default Post2;