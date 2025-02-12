import React, { FC, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type Props = {
    parentRef?: any,
    onChange: (val: string) => void,
    value: string,
}

const RichEditor: FC<Props> = ({ parentRef, onChange, value }) => {
    const quillRef = useRef<ReactQuill>(null);

    useEffect(() => {
        if (parentRef) {
            parentRef.current = quillRef.current;
        }
    }, [parentRef]);

    useEffect(() => {
        if (quillRef.current) {
            const editor = quillRef.current.getEditor(); // 获取 Quill 编辑器实例
            const editorContainer = editor.root; // 获取 .ql-editor
            editorContainer.style.height = '280px'; // 设置最大高度
            editorContainer.style.overflowY = 'auto'; // 超出时显示滚动条
            editorContainer.style.overflowX = 'hidden'; // 隐藏水平滚动条
        }
    }, []);

    const modules = {
        toolbar: {
            container: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                ['link', 'image'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ script: 'sub' }, { script: 'super' }],
                [{ align: [] }],
                [{ color: [] }, { background: [] }],
                [{ direction: 'rtl' }],
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ['clean'],
            ],
        },
    };

    const _onChange = (val: string) => {
        onChange(val);
    };

    return (
        <div style={{ width: '100%' }}>
            <ReactQuill
                ref={quillRef}
                placeholder="please input context"
                modules={modules}
                theme="snow"
                value={value}
                onChange={_onChange}
                formats={[
                    'header', 'font', 'size',
                    'bold', 'italic', 'underline', 'strike', 'blockquote',
                    'list', 'bullet', 'indent',
                    'link',
                    'image', 'video',
                    "clean"
                ]}
            />
        </div>
    );
};

export default RichEditor;