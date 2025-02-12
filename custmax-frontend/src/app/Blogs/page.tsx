// pages/Blogs.tsx

'use client'
import React from 'react';
import EnteredHeader from "@/component/EnteredHeader";

const posts = [
    {
        id: 1,
        title: 'Digital Marketing for Beginners: 4 Practical and Free Ways to Try',
        date: '2024-09-01',
        excerpt: 'For startups or growing businesses, it\'s crucial to understand how to get started with free digital marketing. Digital marketing doesn\'t necessarily require paid advertising, and there are a number of free ways to attract customers.',
    },
    // {
    //     id: 2,
    //     title: '第二篇博客',
    //     date: '2024-09-10',
    //     excerpt: '这是第二篇博客的摘要，探讨了一些重要的概念。',
    // },
    // {
    //     id: 3,
    //     title: '第三篇博客',
    //     date: '2024-09-15',
    //     excerpt: '这是第三篇博客的摘要，分享了一些实用的技巧。',
    // },
];

const BlogPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <EnteredHeader />
            <h1 className="text-4xl font-bold text-center mb-8">我的博客</h1>
            <div className="space-y-6">
                {posts.map((post) => (
                    <div key={post.id}
                         className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
                        <h2 className="text-2xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">{post.title}</h2>
                        <p className="text-gray-500 text-sm">{post.date}</p>
                        <p className="mt-2 text-gray-700">{post.excerpt}</p>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '20px'}}>
                            <a
                                href={`/BlogsContent/${post.id}`} // 跳转到具体的博文页面
                                className="text-blue-600 hover:underline mt-4 inline-block transition-transform transform hover:scale-105"
                            >
                                Read More
                            </a>
                            <a
                                href={`/contactList`} // 跳转到联系列表
                                className="text-blue-600 hover:underline mt-4 inline-block transition-transform transform hover:scale-105"
                            >
                                Back
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogPage;