'use client'
import {Form, Input, Modal, Select, message, Button} from 'antd';
import styles from './index.module.scss';
import { FC, forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic'
import {generateByGroup, getContact, getList} from '@/server/contact';
import { SUCCESS_CODE } from '@/constant/common';
import { getTemplate, getTemplateList } from '@/server/template';
import {getGroupList} from "@/server/group";

const RichEditor =  dynamic(() => import('@/component/RichEditor/index'), { ssr: false });

type RichEditorProps = {
  onChange: (val: string) => void,
  value: string,
}

const NewRichEditor = forwardRef((props: RichEditorProps, ref) =>
    <RichEditor parentRef={ref} {...props} />)
NewRichEditor.displayName = 'NewRichEditor'


type Props = {
  visible: boolean,
  value: string,
  onChange: (val: string) => void,
  onOk: () =>void,
  onCancel: () => void,
}


const {
  contentModal,
  main,
  basicFormWrapper,
  basicForm,
  richTextTitle,
  richText,
  richTextWrapper,
  presetWrapper,
  presetTitle,
  presetItem,
  aiWrapper,
  aiContent,
  buildBtn,
  generate,
  uploadWrapper,
    label,
    addressValue,
  AIModal,

} = styles;

const pageSize = 20;

const ContentModal: FC<Props> = (props) => {
  const { visible, onOk, onCancel, value, onChange } = props;
  const richEditorRef = useRef<{ getEditor: any }>()
  const quillRef = useRef<{ getSelection: any, insertText: any }>()
  const [currentPage, setCurrentPage] = useState(1);
  const [contactList, setContactList] = useState([])
  const [templateList, setTemplateList] = useState<{ value: number, label: string }[]>([])
  const [total, setTotal] = useState(0)
  const [innerContent, setInnerContent] = useState('')
  const [originContact, setOriginContact] = useState<Contact.NewContact | null>(null)
  const [groupName, setGroupName] = useState('');
  const [groupList, setGroupList] = useState<{ groupName: string, id: number }[]>([]);
  const initGroupList = async () => {
    const res = await getGroupList(); // 假设 getGroupList 是一个异步函数
    if (res.code === SUCCESS_CODE) {
      setGroupList(res.data);
    } else {
      message.error('Failed to load group list');
    }
  };

  useEffect(() => {
    initGroupList();
  }, []);
  const initContactList = useCallback(async () => {
    message.loading({ content: 'loading', duration: 10, key: 'loading' })
    const res = await getList(currentPage, pageSize)
    message.destroy('loading')
    if (res.code === SUCCESS_CODE && res.data) {
      setContactList(res.data?.records.map((item: { id: number, firstName: string, lastName: string }) => ({ value: item.id, label: `${item.firstName} ${item.lastName}` })) || [])
      setTotal(res.data?.total || 0)
    }
  }, [currentPage, pageSize])

  const initTemplateList = async () => {
    const query = {}
    const res = await getTemplateList(query)
    if (res.code === SUCCESS_CODE && res.data) {
      const data = res.data
      const newTemplateList: { value: number, label: string }[] = []
      for (const key in data) {
        const items = data[key]
        items.forEach((i: { id: number, name: string }) => {
          newTemplateList.push({
            value: i.id,
            label: `${key}/${i.name}`,
          })
        })
      }
      setTemplateList(newTemplateList)
    }
  }

  const initInnerContent = (value: string) => {
    setInnerContent(value)
  }

  useEffect(() => {
    if (visible) {
      initContactList()
      initTemplateList()

    }
  }, [visible])

  useEffect(() => {
    if (value) {
      initInnerContent(value)
    }
  }, [value])

  const _onChange = (value: string) => {
    setInnerContent(value)
    onChange(value)
  }



  const onTamplateChange = async (value: number) => {
    if (typeof value === 'number' && !isNaN(value)) {
      message.loading({ content: 'loading', duration: 10, key: 'templateLoading' })
      const res = await getTemplate(value)
      message.destroy('templateLoading')
      if (res.code === SUCCESS_CODE && res.data) {
        const { content } = res.data || {}
        if (content) {
          const newInnerContent = content + innerContent
          setInnerContent(newInnerContent)
        }
      }
    }
  }

  const onContactChange = async (value: number) => {
    if (typeof value === 'number' && !isNaN(value)) {
      message.loading({ content: 'loading', duration: 10, key: 'contactLoading' })
      const res = await getContact(value)
      message.destroy('contactLoading')
      if (res.code === SUCCESS_CODE) {
        setOriginContact(res.data)
      }
    }
  }

  const insertTextAtCursor = (text: string) => {
    if (richEditorRef.current) {
      const editor = richEditorRef.current.getEditor();

      // 强制编辑器获取焦点，这样可以确保光标位置被正确识别
      editor.focus();

      // 获取光标位置。如果光标未选择位置，则插入到内容末尾
      const position = editor.getSelection()?.index ?? editor.getLength();

      // 在光标位置插入文本
      editor.insertText(position, text);
    }
  };

  const insertFirstName = () => {
    const { firstName = '#{FIRSTNAME}' } = originContact || {};
    insertTextAtCursor(firstName);
  };

  const insertLastName = () => {
    const { lastName = '#{LASTNAME}' } = originContact || {};
    insertTextAtCursor(lastName);
  };

  const insertCompany = () => {
    const { company = '#{COMPANY}' } = originContact || {};
    insertTextAtCursor(company);
  };

  const insertEmail = () => {
    const { email = '#{EMAIL}' } = originContact || {};
    insertTextAtCursor(email);
  };

  const insertTitle = () => {
    const { title = '#{TITLE}' } = originContact || {};
    insertTextAtCursor(title);
  };

  const insertBirthDate = () => {
    const { birthDate = '#{BIRTHDATE}' } = originContact || {};
    insertTextAtCursor(birthDate);
  };

  const insertPhone = () => {
    const { phone = '#{PHONE}' } = originContact || {};
    insertTextAtCursor(phone);
  };

  const insertDept = () => {
    const { dept = '#{DEPT}' } = originContact || {};
    insertTextAtCursor(dept);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    console.log('Input value:', inputValue); // 在这里处理输入框的值

    const content = inputValue;
    const groupId = groupList.find(group => group.groupName === groupName)?.id;
    const loadingKey = 'loading';
    message.loading({ content: 'Generating...', key: loadingKey, duration: 0 });
    // 如果没有选中 groupId 则提示用户
    if (!groupId) {
      message.error('Please select a group.');
      return;
    }

    // 构造请求体
    const payload = {
      groupId: groupId.toString(), // 将 groupId 转为字符串
      content: content
    };

    try {
      const res = await generateByGroup(payload)
      message.destroy('contactLoading')
      if(res.code === SUCCESS_CODE) {
        message.success('Request successful');
        console.log('Response content:', res.data);
        if (richEditorRef.current) {
          const editor = richEditorRef.current.getEditor();
          editor.setText(''); // 清空编辑器内容
          editor.insertText(0, res.data); // 从光标开始插入新内容
        }
      }

    } catch (error) {
      message.error('An error occurred');
    }finally {
      message.destroy(loadingKey);
    }

    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };
  const onAIChange = () => {};
  return <Modal
    title="Content"
    open={visible}
    onOk={onOk}
    onCancel={onCancel}
    wrapClassName={contentModal}
    width={'80vw'}
  >
    <div className={main}>
      <div className={basicFormWrapper}>
        <Form
            name="content"
            className={basicForm}
            labelCol={{span: 4}}
            wrapperCol={{span: 20}}
            labelAlign='left'
            colon={false}
        >
          <Form.Item
              label="Template"
              name='template'
          >
            <Select
                onChange={onTamplateChange}
                options={templateList}
            />
          </Form.Item>
        </Form>
          <div className={generate} onClick={showModal}>
            Generate
          </div>
          <Modal
              title="Use AI to empower your content"
              open={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
              className={AIModal}
              footer={[
                <Button key="cancel" onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                  Confirm
                </Button>,
              ]}
          >
            <p>Describe your products, services, or unique selling points.</p>
            <p>Tell us what makes your business special and why customers should choose you.</p>
            <Input.TextArea
                placeholder="Enter your content here"
                value={inputValue}
                onChange={handleInputChange}
                rows={4} // 设置文本框为多行
            />
            <div className={uploadWrapper}>
              <div className={label}>Group</div>
              {groupList.length > 0 ? (
                  <Select
                      className={addressValue}
                      onChange={value => setGroupName(value)}
                      options={groupList.map((item, index) => ({
                        value: item.groupName,
                        label: item.groupName,
                      }))}
                      style={{ width: '100px' }}
                  />
              ) : (
                  <Input
                      className={addressValue}
                      value={groupName}
                      onChange={e => setGroupName(e.target.value)}
                  />
              )}
            </div>
          </Modal>

      </div>


      <div className={richTextTitle}>Content</div>
      <div className={richText}>
        <div className={richTextWrapper}>
          <NewRichEditor ref={richEditorRef} value={innerContent} onChange={_onChange}/>
        </div>
        <div className={presetWrapper}>
          <div className={presetTitle}>Contact Fields</div>
          <div className={presetItem} onClick={insertFirstName}>*FIRSTNAME</div>
          <div className={presetItem} onClick={insertLastName}>*LASTNAME</div>
          <div className={presetItem} onClick={insertCompany}>*COMPANY</div>
          <div className={presetItem} onClick={insertEmail}>*EMAIL</div>
          <div className={presetItem} onClick={insertTitle}>*TITLE</div>
          <div className={presetItem} onClick={insertDept}>*DEPT</div>
          <div className={presetItem} onClick={insertPhone}>*PHONE</div>
          <div className={presetItem} onClick={insertBirthDate}>*BIRTHDAY</div>
        </div>
      </div>

    </div>
  </Modal>
};

export default ContentModal;