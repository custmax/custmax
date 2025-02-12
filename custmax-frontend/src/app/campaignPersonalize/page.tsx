'use client'
import EnteredHeader from '@/component/EnteredHeader';
import styles from './page.module.scss';
import SideBar from '@/component/SideBar';
import ImgWrapper from '@/component/ImgWrapper';
import {
    Button,
    DatePicker,
    DatePickerProps,
    Input,
    message,
    Modal,
    Radio,
    RadioChangeEvent,
    Select,
    TimePicker,
    TimePickerProps
} from 'antd';
import React, {FC, forwardRef, useCallback, useEffect, useRef, useState} from 'react';
import dayjs from 'dayjs';
import ContentModal from './component/ContentModal';
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation'
import {getGroupList} from '@/server/group';
import {SUCCESS_CODE} from '@/constant/common';
import {
    getCampaign,
    getContactByGroup,
    getLastCampaignId,
    saveDraft,
    sendEmail,
    updateCampaign,
    generateContent
} from '@/server/campaign';
import {getSenderList} from '@/server/sender';
import {sendEmailBySendCloud} from "@/server/sendcloud/mail";
import {getEmailsByGroupId} from "@/server/contact";
import {API_KEY, API_USER, SENDER_EMAIL, SENDER_NAME} from "@/constant/sendCloud";
import {getAddr} from "@/server/accountInfo";
import {getTemplate} from "@/server/template";
import {DataType} from "csstype";
import {ScrollArea} from "@/components/ui/scroll-area";
import dynamic from "next/dynamic";
import contact from "@/app/pricing/component/Contact";
import * as AlertDialog from '@radix-ui/react-alert-dialog';

const RichEditor =  dynamic(() => import('@/component/RichEditor/index'), { ssr: false });
type RichEditorProps = {
    onChange: (val: string) => void,
    value: string,
}
const NewRichEditor = forwardRef((props: RichEditorProps, ref) =>
    <RichEditor parentRef={ref} {...props} />)
NewRichEditor.displayName = 'NewRichEditor'

const {
    campaignEditorContainer,
    main,
    title,
    titleLeft,
    arrowLeft,
    back,
    contentModal,
    draftBtn,
    exitBtn,
    content,
    contentTitle,
    subTitle,
    mainProcess,
    processItem,
    addGroup,
    processLeft,
    radio,
    processDesc,
    desc,
    processRight,
    trackWrapper,
    trackTitle,
    trackList,
    trackItem,
    trackText,
    sendWrapper,
    sendBtn,
    toModal,
    toContent,
    label,
    value,
    campaignNameModal,
    subjectModal,
    subjectContent,
    inputItem,
    fromModal,
    fromContent,
    addSender,
    sendModal,
    sendContent,
    header,
    headerLeft,
    headerRight,
    headerTitle,
    headerContent,
    radioWrapper,
    radioLabel,
    timeWrapper,
    timeLabel,
    timeInput,
    campaignTitle,
    sendBtn2,
} = styles;

type ContactType = {
    id: number,
    firstName: string,
    lastName: string,
}
type ContactNodeType = {
    contact: ContactType,
    content: string,
    index: number
}
type ScrollAreaDemoProps = {
    className?: string;
    title: string;
    items: ContactNodeType[];
    setContact: (newItems: ContactNodeType) => void;
};


const CampaignEditor = () => {
    const senderListRef = useRef<{ value: number, label: string }[]>([])
    const [showTo, setShowTo] = useState<boolean>(false)
    const [showCampaignName, setShowCampaignName] = useState<boolean>(false)
    const [campaignName, setCampaignName] = useState<string>('')
    const [showSubject, setShowSubject] = useState<boolean>(false)
    const [showSend, setShowSend] = useState<boolean>(false)
    const [showContent, setShowContent] = useState<boolean>(false)
    const [showFrom, setShowFrom] = useState<boolean>(false)
    const [submit, setSubmit] = useState<boolean>(false)
    const router = useRouter()
    const [groupList, setGroupList] = useState<{ value: number, label: string }[]>([]);
    const [toGroup, setToGroup] = useState<number | undefined>()
    const [senderEmail, setSenderEmail] = useState('')
    const richEditorRef = useRef<{ getEditor: any }>()
    let [innerContent, setInnerContent] = useState('')
    const [showAlert, setShowAlert] = useState(false);
    // const [senderName, setSenderName] = useState('')
    const [subject, setSubject] = useState('')
    const [preText, setPreText] = useState('')
    let [richContent, setRichContent] = useState('')
    const [sendDate, setSendDate] = useState('')
    const [sendMinute, setSendMinute] = useState('')
    const [allow, setAllow] = useState(true)
    const [zone, setZone] = useState('beiJing')
    const [timeType, setTimeType] = useState()
    const [senderId, setSenderId] = useState<number>()
    const [contactList, setContactList] = useState<ContactType[]>([])
    const [contentList, setContentList] = useState<ContactNodeType[]>([])
    let [contactSelected, setContactSelected] = useState<ContactNodeType>();
    let [contactsSelected, setContactsSelected] = useState<number[]>([]);
    let [checks, setCheckedItems] = useState<boolean[]>(new Array(contactList.length).fill(false));


    const [trackClicks, setTrackClicks] = useState<boolean>(false)
    const [trackLink, setTrackLink] = useState<boolean>(false)
    const [trackOpens, setTrackOpens] = useState<boolean>(true)
    const [trackTextClicks, setTrackTextClicks] = useState<boolean>(false)
    const [timeZone, setTimeZone] = useState('UTC+08:00');
    const searchParams = useSearchParams();

    let campaignId = searchParams.get('id');
    let templateId = Number(searchParams.get('templateId'))

    //const [campaignIdOnSend,setCampaignIdOnSend]=useState<number>();
    const [process, setProcess] = useState([
        {title: 'To', subTitle: '', checked: false},
        {title: 'From', subTitle: '', checked: false},
        {title: 'Subject', subTitle: '', checked: false},
        {title: 'Content', checked: false},
        {title: 'Send time', subTitle: '', checked: false},
    ])
    const timeZones = [
        {value: 'UTC+00:00', label: 'UTC+00:00'},
        {value: 'UTC+01:00', label: 'UTC+01:00'},
        {value: 'UTC+02:00', label: 'UTC+02:00'},
        {value: 'UTC+03:00', label: 'UTC+03:00'},
        {value: 'UTC+04:00', label: 'UTC+04:00'},
        {value: 'UTC+05:00', label: 'UTC+05:00'},
        {value: 'UTC+06:00', label: 'UTC+06:00'},
        {value: 'UTC+07:00', label: 'UTC+07:00'},
        {value: 'UTC+08:00', label: 'UTC+08:00'},
        {value: 'UTC+09:00', label: 'UTC+09:00'},
        {value: 'UTC+10:00', label: 'UTC+10:00'},
        {value: 'UTC+11:00', label: 'UTC+11:00'},
        {value: 'UTC+12:00', label: 'UTC+12:00'},
        {value: 'UTC-12:00', label: 'UTC-12:00'},
        {value: 'UTC-11:00', label: 'UTC-11:00'},
        {value: 'UTC-10:00', label: 'UTC-10:00'},
        {value: 'UTC-09:00', label: 'UTC-09:00'},
        {value: 'UTC-08:00', label: 'UTC-08:00'},
        {value: 'UTC-07:00', label: 'UTC-07:00'},
        {value: 'UTC-06:00', label: 'UTC-06:00'},
        {value: 'UTC-05:00', label: 'UTC-05:00'},
        {value: 'UTC-04:00', label: 'UTC-04:00'},
        {value: 'UTC-03:00', label: 'UTC-03:00'},
        {value: 'UTC-02:00', label: 'UTC-02:00'},
        {value: 'UTC-01:00', label: 'UTC-01:00'},

    ];

    const getContactList = async (groupId: number | undefined) => {
        const res = await getContactByGroup(groupId);
        if (res.code === SUCCESS_CODE) {
            setContactList(res.data)
        }
    };

    useEffect(() => {
        const oneList: ContactNodeType[] = contactList.map((one, index) => ({
            contact: one,
            content: '',
            index: index,
        }))
        setContentList(oneList)
    }, [contactList]);

    useEffect(() => {
        console.log(toGroup)
        getContactList(toGroup);
    }, [toGroup]);

    const initGroupList = useCallback(async () => {
        const res = await getGroupList()
        if (res.code === SUCCESS_CODE) {
            await initSender()
            const newGroupList = res.data.map((item: { groupName: string, id: number }) => ({
                value: item.id,
                label: item.groupName
            }))
            setGroupList(newGroupList)
            initCampaign(newGroupList)
        }
    }, [])

    useEffect(() => {
        if (allow) {
            initGroupList()
        } else {
            // message.warning('Please provide your address information')
            // router.push('/contactInfo?form=true')
            showWarningModal();
        }
    }, [allow])

    function replaceUrls(input: string, replacer: (match: string) => string) {
        const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
        return input.replace(urlRegex, replacer);
    }

    function ScrollAreaDemo({className, }: ScrollAreaDemoProps) {
        const [selectedIndex, setSelectedIndex] = useState<number>(0); // 维护被点击的条目索引
        let [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(contactList.length).fill(false));

        const handleItemClick = (index: number) => {
            setSelectedIndex(index); // 设置选中条目的索引
        };

        useEffect(() => {
            const contactSelected = contentList[selectedIndex]; // 设置选中条目的索引

            if (!contactSelected) { // 检查 contactSelected 是否有效
                setShowAlert(true); // 显示警告弹窗
                return; // 退出 useEffect
            }

            innerContent = contactSelected.content; // 现在可以安全访问 content

            if (richEditorRef.current) {
                const editor = richEditorRef.current.getEditor();
                editor.setText(''); // 清空编辑器内容
                editor.insertText(0, innerContent); // 从光标开始插入新内容
            }

            console.log(innerContent); // 可以安全地打印 innerContent
        }, [selectedIndex, contentList]);

        useEffect(() => {
            console.log(contactsSelected)
        }, [checkedItems]);

        const handleItemChange = (index: number, flag: boolean) => {
            const newCheckedItems = [...checkedItems];
            newCheckedItems[index] = flag;
            setCheckedItems(newCheckedItems)
            checks = newCheckedItems;
        };

        return (
            <ScrollArea className={`h-full w-[13rem] border-r ${className}`}>
                <div className="p-4 w-100 h-[26rem]">
                    <h4 className="mb-2 text-sm font-medium leading-none">Contact List</h4>
                    <div className="max-h-80 min-h-80 overflow-y-auto">
                        {contentList.map((contact, index) => (
                            <button type="button" key={index} className={`flex w-full items-center justify-between 
                                        ${selectedIndex === index ? 'bg-selected text-lg' : ''}`}
                                    onClick={() => handleItemClick(index)}
                            >
                                <div className={`${styles.contactCard} flex cursor-pointer m-2`} // 添加 cursor-pointer 以指示可点击
                                >
                                    {contact.contact.firstName} {contact.contact.lastName}
                                </div>
                                <input
                                    type="checkbox"
                                    className="form-checkbox text-right m-2"
                                    checked={checkedItems[index]}
                                    onChange={(event) => handleItemChange(index, event.target.checked)}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </ScrollArea>

        );
    }

    type Props = {
        visible: boolean,
        value: string,
        onChange: (val: string) => void,
        onOk: () => void,
        onCancel: () => void,
    };
    const ContentModal: FC<Props> = (props) => {
        const {visible, onOk, onCancel, value, onChange} = props;

        const handleGenerateAI = async () => {
            if (toGroup === null || toGroup === undefined) {
                message.error('Please select a group firstly to generate AI content.');
                return;
            }
            if (contactsSelected.length === 0) {
                message.error('Please select a contact firstly or click the generate button to generate AI content.');
                return;
            }
            // Call your AI generation logic here
            message.loading({ content: 'loading', duration: 10, key: 'loading' })
            const res = await generateContent(contactsSelected);
            message.destroy("Loading")
            contentList.map(one => {
                if(res.data[one.contact.id] !== null && res.data[one.contact.id] !== undefined)
                    one.content = res.data[one.contact.id]
            })
            message.success(`AI content generated for contacts selected`);
        };

        // useEffect(() => {
        //     if(contactSelected !== undefined) {
        //         innerContent = contactSelected.content
        //         if (richEditorRef.current) {
        //             const editor = richEditorRef.current.getEditor();
        //             editor.setText(''); // 清空编辑器内容
        //             editor.insertText(0, contactSelected.content); // 从光标开始插入新内容
        //         }
        //         console.log(richContent)
        //     }
        // }, [contentList]);

        const _onChange = (value: string) => {
            innerContent = value
            onChange(value)
        }

        return (
            <Modal
                open={visible}
                wrapClassName={contentModal}
                width={'80vw'}
                onCancel={onCancel}
                footer={[
                    <Button key="back" onClick={onCancel}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        className="bg-custom-purple text-white" // 使用自定义类
                        style={{
                            backgroundColor: '#7241FF',
                            borderColor: '#7241FF',
                            color: 'white',
                        }}
                        onClick={onOk}
                    >
                        Confirm
                    </Button>,
                ]}
            >
                <div className="flex mb-2 h-[31rem] items-start">
                    <ScrollAreaDemo
                        className="custom-class"
                        title=""
                        items={contentList}
                        setContact={setContactSelected}/>
                    <div className="h-full">
                        <div className="text-center font-bold font-serif">
                            Content
                        </div>
                        <div className="m-3 flex justify-between">
                            <h3 className="flex mb-2 items-start">AI Generated Content:</h3>
                            <Button type="primary"
                                    style={{
                                        backgroundColor: '#7241FF',
                                        borderColor: '#7241FF',
                                        color: 'white',
                                    }}
                                    onClick={()=> {
                                        const temp: number[] = [];
                                        contentList.map((one, index) => {
                                                temp.push(one.contact.id)
                                        })
                                        contactsSelected = temp
                                        handleGenerateAI()
                                    }}>Generate</Button>
                        </div>
                        <div className="m-3 w-[55rem] min-h-[21rem]">
                            <NewRichEditor ref={richEditorRef} value={innerContent} onChange={_onChange}/>
                        </div>
                        <div className="m-3 text-right">
                            <Button type="primary"
                                    style={{
                                        backgroundColor: '#7241FF',
                                        borderColor: '#7241FF',
                                        color: 'white',
                                    }}
                                    onClick={() => {
                                        const temp: number[] = [];
                                        contentList.map((one, index) => {
                                            if(checks[index])
                                                temp.push(one.contact.id)
                                        })
                                        contactsSelected = temp
                                        console.log(contactsSelected)
                                        handleGenerateAI()
                                    }}>Rebuild</Button>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    };
    //Prohibit modification
    const replaceLinkContentByLink = (links: string) => {
        let val = links;
        const prefix = "www.cusob.com/api/report" + "/" + campaignId + "/";
        const myReplacer = (match: string) => {
            let domain = match.replace(/https?:\/\//, '');
            return prefix + domain;
        };
        const result = replaceUrls(val, myReplacer);
        setRichContent(result);
        return result;
    }

    const initCampaign = useCallback(async (groupList: { value: number, label: string }[]) => {
        if (campaignId) {
            message.loading({content: 'loading', duration: 10, key: 'loading'})
            const res = await getCampaign(campaignId)
            message.destroy('loading')
            if (res.code === SUCCESS_CODE && res.data) {
                setCampaignName(res.data.campaignName)
                setRichContent(res.data.content)
                setPreText(res.data.preText)
                setSendDate(dayjs(res.data.sendTime).format('YYYY-MM-DD'))
                setSendMinute(dayjs(res.data.sendTime).format('HH:mm:ss'))
                setSenderId(res.data.senderId)
                // setSenderEmail(res.data.senderEmail)
                // setSenderName(res.data.senderName)
                setSubject(res.data.subject)
                if (res.data.toGroup && res.data.toGroup > -1) setToGroup(res.data.toGroup);
                setTrackClicks(res.data.trackClicks)
                setTrackLink(res.data.trackLink)
                setTrackOpens(res.data.trackOpens)
                setTrackTextClicks(res.data.trackTextClicks)

                const newProcess = process.map((item) => {
                    if (item.title === 'To') return ({
                        ...item,
                        subTitle: groupList.find(item => item.value === res.data.toGroup)?.label,
                        checked: Boolean(res.data.toGroup && res.data.toGroup > -1),
                    })
                    if (item.title === 'From') return ({
                        ...item,
                        subTitle: senderListRef.current.find(item => item.value === res.data.senderId)?.label,
                        checked: Boolean(res.data.senderId),
                    })
                    if (item.title === 'Subject') return ({
                        ...item,
                        subTitle: res.data.subject,
                        checked: Boolean(res.data.subject),
                    })
                    if (item.title === 'Content') return ({
                        ...item,
                        checked: Boolean(res.data.content),
                    })
                    if (item.title === 'Send time') return ({
                        ...item,
                        checked: Boolean(res.data.sendTime),
                    })
                    return item
                })
                setProcess(newProcess)
            }
        }
        if (templateId) {
            message.loading({content: 'loading', duration: 10, key: 'loading'})
            const res = await getTemplate(templateId);
            message.destroy('loading')
            setShowContent(true)
            if (res.code === SUCCESS_CODE) {
                setRichContent(res.data.content)
            } else {
                message.error("An error occurred during the initialization of the template")
            }
        }
    }, [campaignId])

    const initSender = useCallback(async () => {
        const res = await getSenderList()
        if (res.code === SUCCESS_CODE && res.data) {
            const newSenderList = res.data.map((item: { id: number, email: string }) => ({
                value: item.id,
                label: item.email
            }))
            senderListRef.current = newSenderList
        }
    }, [])

    const getAddress = async () => {
        const res = await getAddr()
        setAllow(res.data)
    }
    useEffect(() => {
        getAddress()
        console.log(allow)
    }, []);
    const showWarningModal = () => {
        Modal.confirm({
            title: 'Warning',
            content: 'Please provide your address information',
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => {
                router.push('/contactInfo?form=true');
            },
            onCancel: () => {
                router.push('/campaign?form=true');
            }
        });
    };

    const onCampaignNameOk = () => {
        setShowCampaignName(false)
    }

    const onCampaignNameCancel = () => {
        setShowCampaignName(false)
    }

    const onToOk = () => {
        const newProcess = process.map((item, index) => {
            if (item.title === 'To') {
                return {
                    ...item,
                    subTitle: groupList.find(i => i.value === toGroup)?.label || '',
                    checked: true
                }
            }
            return item
        })

        setProcess(newProcess)
        setShowTo(false)
    }

    const onToCancel = () => {
        const newProcess = process.map((item, index) => {
            if (item.title === 'To') {
                return {
                    ...item,
                    subTitle: '',
                    checked: false
                }
            }
            return item
        })
        setProcess(newProcess)
        setShowTo(false)
    }

    const onFromOk = () => {
        const newProcess = process.map((item, index) => {
            if (item.title === 'From') {
                return {
                    ...item,
                    subTitle: senderListRef.current.find(item => item.value === senderId)?.label,
                    checked: true
                }
            }
            return item
        })
        setProcess(newProcess)
        setShowFrom(false)
    }

    const onFromCancel = () => {
        const newProcess = process.map((item, index) => {
            if (item.title === 'From') {
                return {
                    ...item,
                    subTitle: '',
                    checked: false,
                }
            }
            return item
        })
        setProcess(newProcess)
        setShowFrom(false)
    }

    const onSubjectOk = () => {
        const newProcess = process.map((item, index) => {
            if (item.title === 'Subject') {
                return {
                    ...item,
                    subTitle: subject,
                    checked: true
                }
            }
            return item
        })
        setProcess(newProcess)
        setShowSubject(false)
    }

    const onSubjectCancel = () => {
        const newProcess = process.map((item, index) => {
            if (item.title === 'Subject') {
                return {
                    ...item,
                    subTitle: '',
                    checked: false
                }
            }
            return item
        })
        setProcess(newProcess)
        setShowSubject(false)
    }

    const onContentOk = () => {

        const newProcess = process.map((item, index) => {
            if (item.title === 'Content') {
                return {
                    ...item,
                    checked: true
                }
            }
            return item
        })
        setProcess(newProcess)
        setShowContent(false)

    }

    const onContentCancel = () => {
        const newProcess = process.map((item, index) => {
            if (item.title === 'Content') {
                return {
                    ...item,
                    checked: false
                }
            }
            return item
        })
        setProcess(newProcess)
        setShowContent(false)
    }

    const onSendTimeOk = () => {
        const newProcess = process.map((item, index) => {
            if (item.title === 'Send time') {

                return {
                    ...item,
                    subTitle: '',
                    checked: true,
                }
            }
            return item
        })
        setProcess(newProcess)
        setShowSend(false)
    }

    const onSendTimeCancel = () => {
        const newProcess = process.map((item, index) => {
            if (item.title === 'Send time') {
                return {
                    ...item,
                    subTitle: '',
                    checked: false,
                }
            }
            return item
        })
        setProcess(newProcess)
        setShowSend(false)
    }

    const onDateChange: DatePickerProps['onChange'] = (val) => {
        setSendDate(dayjs(val).format('YYYY-MM-DD'))
    };

    const onTimeChange: TimePickerProps['onChange'] = (val) => {
        setSendMinute(dayjs(val).format('HH:mm:ss'))
    };
    const onTimeZoneChange = (value: string) => {
        setTimeZone(value);
    };

    const onRadioChange = (e: RadioChangeEvent) => {
        if (e.target.value === 1) {
            const dateStr = Date.now()
            setSendDate(dayjs(dateStr).format('YYYY-MM-DD'))
            setSendMinute(dayjs(dateStr).format('HH:mm:ss'))
        }
        setTimeType(e.target.value)
    };


    const handleShow = (title: string) => {
        if (title === 'To') {
            setShowTo(true)
        }
        if (title === 'From') {
            setShowFrom(true)
        }
        if (title === 'Subject') {
            setShowSubject(true)
        }
        if (title === 'Content') {
            if(toGroup === null || toGroup === undefined){
                message.error("please selecct a group!")
                return
            }
            setShowContent(true)

        }
        if (title === 'Send time') {
            setShowSend(true)
        }
    };

    const onSend = async () => {
        if (!submit) {
            setSubmit(true)
            const senderName = senderListRef.current.find(item => item.value === senderId)?.label
            const chosenTo = process.find(item => item.title === 'To')?.checked
            const chosenFrom = process.find(item => item.title === 'From')?.checked
            const chosenSubject = process.find(item => item.title === 'Subject')?.checked
            const chosenContent = process.find(item => item.title === 'Content')?.checked
            const chosenSendTime = process.find(item => item.title === 'Send time')?.checked

            if (!campaignName) {
                message.error('please set campaignName');
                setSubmit(false); // 触发错误消息时设置 submit 状态为 false
                return;
            }
            if (!toGroup || !chosenTo) {
                message.error('please set toGroup');
                setSubmit(false); // 触发错误消息时设置 submit 状态为 false
                return;
            }
            if (!senderId || !chosenFrom) {
                message.error('please set senderEmail');
                setSubmit(false); // 触发错误消息时设置 submit 状态为 false
                return;
            }
            if (!senderName || !chosenFrom) {
                message.error('please set senderName');
                setSubmit(false); // 触发错误消息时设置 submit 状态为 false
                return;
            }
            if (!subject || !chosenSubject) {
                message.error('please set subject');
                setSubmit(false); // 触发错误消息时设置 submit 状态为 false
                return;
            }
            if (!preText || !chosenSubject) {
                message.error('please set preText');
                setSubmit(false); // 触发错误消息时设置 submit 状态为 false
                return;
            }
            if (!content || !chosenContent) {
                message.error('please set content');
                setSubmit(false); // 触发错误消息时设置 submit 状态为 false
                return;
            }

            if (!sendDate || !chosenSendTime) {
                message.error('please set sendDate');
                setSubmit(false); // 触发错误消息时设置 submit 状态为 false
                return;
            }
            if (!sendMinute || !chosenSendTime) {
                message.error('please set sendMinute');
                setSubmit(false); // 触发错误消息时设置 submit 状态为 false
                return;
            }


            const data = {
                campaignName,
                content: richContent,
                preText,
                sendTime: `${sendDate} ${sendMinute}`,
                timeZone,
                senderName,
                senderId,
                subject,
                toGroup,
                trackClicks,
                trackLink,
                trackOpens,
                trackTextClicks
            }


            const resMaxCampaignId = await getLastCampaignId();
            if (resMaxCampaignId.code === SUCCESS_CODE) {
                campaignId = resMaxCampaignId.data;
            } else {
                campaignId = resMaxCampaignId.data;
            }
            data.content = replaceLinkContentByLink(data.content)
            const res = await sendEmail(data, campaignId)
            if (res.code === SUCCESS_CODE) {
                message.success(res.message, () => {
                    router.back()
                })
            } else {
                setSubmit(false)
                message.error(res.message)
            }
        }

    }

    const onGroupChange = (value: number) => {
        setToGroup(value)
    }

    const sendBySendCloud = async () => {
        if (toGroup !== undefined) {
            const emailRes = await getEmailsByGroupId(toGroup)
            console.log(emailRes.data)
            if (emailRes.code == SUCCESS_CODE) {
                const sendCloudData = {
                    apiUser: API_USER,
                    apiKey: API_KEY,
                    from: SENDER_EMAIL,
                    to: emailRes.data.join(";"),
                    subject: subject,
                    html: richContent,
                    contentSummary: preText,
                    fromName: SENDER_NAME,
                }
                const res = await sendEmailBySendCloud(sendCloudData)
            }
        }
    }


    const onDraft = async () => {
        const senderName = senderListRef.current.find(item => item.value === senderId)?.label
        const chosenTo = process.find(item => item.title === 'To')?.checked
        const chosenFrom = process.find(item => item.title === 'From')?.checked
        const chosenSubject = process.find(item => item.title === 'Subject')?.checked
        const chosenContent = process.find(item => item.title === 'Content')?.checked
        const chosenSendTime = process.find(item => item.title === 'Send time')?.checked
        //const chosenTimeZone = process.find(item => item.title === 'Send time')?.checked
        if (!campaignName) return message.error('please set campaignName');
        const data = {
            campaignName,
            content: chosenContent ? richContent : '',
            preText: chosenSubject ? preText : '',
            sendTime: chosenSendTime ? `${sendDate} ${sendMinute}` : '',
            // senderEmail: chosenFrom ? senderEmail : '',
            senderId,
            timeZone,
            senderName: chosenFrom ? senderName : '',
            subject: chosenSubject ? subject : '',
            toGroup: chosenTo ? toGroup : -1,
            trackClicks,
            trackLink,
            trackOpens,
            trackTextClicks
        }
        if (campaignId) {
            const res = await updateCampaign({...data, id: +campaignId})
            if (res.code === SUCCESS_CODE) {
                message.success(res.message)
            } else {
                message.error(res.message)
            }
        } else {
            const res = await saveDraft(data)
            if (res.code === SUCCESS_CODE) {
                message.success(res.message)
            } else {
                message.error(res.message)
            }
        }
    }


    function handleChangeContent(val: string) {
        richContent = val;
    }

    return <div className={campaignEditorContainer}>
        <EnteredHeader/>
        <SideBar/>
        <div className={main}>
            <div className={title}>
                <div className={titleLeft}>
                    <div className={back} onClick={() => router.back()}>
                        <ImgWrapper className={arrowLeft} src='/img/arrow_left.png' alt='arrow left'/>
                        {/*<span>Continue like this</span>*/}
                        <span>Campaigns</span>
                    </div>
                    {/*<div onClick={onDraft} className={draftBtn}>Draft</div>*/}
                </div>
                <div className={sendWrapper}>

                    <div onClick={onDraft} className={sendBtn2}>Save as Draft</div>
                    <div onClick={onSend} className={sendBtn}>Send</div>
                </div>
                {/*<div onClick={onSend} className={exitBtn}>Send</div>*/}
            </div>
            <div className={content}>
                <div className={contentTitle}>
                    <span>{campaignName || 'Untitled'}</span>
                    <span onClick={() => setShowCampaignName(true)} className={subTitle}>Edit name</span>
                </div>
                {/*<div className={contentTitle}>*/}
                {/*  <div className={campaignTitle}>Campaign Name:</div>*/}
                {/*  <Input*/}
                {/*      value={campaignName}*/}
                {/*      onChange={e => setCampaignName(e.target.value)}*/}
                {/*      placeholder="Name your campaign"*/}
                {/*      className={subTitle} // 使用原来的样式类名*/}
                {/*  />*/}
                {/*</div>*/}

                <div className={mainProcess}>
                    {
                        process.map((item, index) => <div key={index} className={processItem}>
                            <div className={processLeft}>
                                <Radio className={radio} checked={item.checked}/>
                                <div className={processDesc}>
                                    <span>{item.title}</span>
                                    {item.subTitle && <span className={desc}>{item.subTitle}</span>}
                                </div>
                            </div>
                            <div className={processRight} onClick={() => handleShow(item.title)}>Edit</div>
                        </div>)
                    }
                </div>
            </div>
        </div>
        <Modal
            title="Campaign Name"
            open={showCampaignName}
            onOk={onCampaignNameOk}
            onCancel={onCampaignNameCancel}
            wrapClassName={subjectModal}
        >
            <div className={subjectContent}>
                <div className={inputItem}>
                    <div className={label}>name</div>
                    <Input value={campaignName} onChange={e => setCampaignName(e.target.value)} className={value}/>
                </div>
            </div>
        </Modal>
        <Modal
            title="TO"
            open={showTo}
            onOk={onToOk}
            onCancel={onToCancel}
            wrapClassName={toModal}
        >
            <div className={toContent}>
                <div className={label}>Send to</div>
                <div className={value}>
                    <Select
                        value={toGroup}
                        onChange={onGroupChange}
                        options={groupList}
                    />
                    <span>All subscribers in audience</span>
                </div>

            </div>
            <Link href='/contactList' className={addGroup}>Navigate to Add New Group</Link>
        </Modal>
        <Modal
            title="From"
            open={showFrom}
            onOk={onFromOk}
            onCancel={onFromCancel}
            wrapClassName={fromModal}
        >
            <div className={fromContent}>
                {/* <div className={inputItem}>
          <div className={label}>Name</div>
          <Input value={senderName} onChange={e => setSenderName(e.target.value)} className={value} />
        </div> */}
                <div className={inputItem}>
                    <div className={label}>Email Address</div>
                    <Select
                        className={value}
                        value={senderId}
                        onChange={(val) => setSenderId(val)}
                        options={senderListRef.current}
                    />
                    {/* <Input value={senderEmail} onChange={e => setSenderEmail(e.target.value)} className={value} /> */}
                </div>
                <Link href='/addSender' className={addSender}>Add Sender</Link>
            </div>
        </Modal>
        <Modal
            title="Subject"
            open={showSubject}
            onOk={onSubjectOk}
            onCancel={onSubjectCancel}
            wrapClassName={subjectModal}
        >
            <div className={subjectContent}>
                <div className={inputItem}>
                    <div className={label}>Subject</div>
                    <Input value={subject} onChange={e => setSubject(e.target.value)} className={value}/>
                </div>
                <div className={inputItem}>
                    <div className={label}>Preview Text</div>
                    <Input value={preText} onChange={e => setPreText(e.target.value)} className={value}/>
                </div>
            </div>
        </Modal>
        <Modal
            title=""
            open={showSend}
            onOk={onSendTimeOk}
            onCancel={onSendTimeCancel}
            wrapClassName={sendModal}
        >
            <div className={sendContent}>
                <div className={header}>
                    <ImgWrapper className={headerLeft} src='/img/list_item_icon.png' alt='item icon'/>
                    <div className={headerRight}>
                        <div className={headerTitle}>Send mail</div>
                        <div className={headerContent}>After email marketing review, send according to the selection
                            below
                        </div>
                    </div>
                </div>
                <div className={radioWrapper}>
                    <div className={radioLabel}>Send setting</div>
                    <Radio.Group onChange={onRadioChange} value={timeType}>
                        <Radio value={1}>Send Now</Radio>
                        <Radio value={2}>Schedule a time</Radio>
                    </Radio.Group>
                </div>
                <div className={timeWrapper}>
                    <div className={timeLabel}>Sending time</div>
                    <DatePicker value={sendDate ? dayjs(sendDate) : undefined} className={timeInput}
                                onChange={onDateChange}/>
                    <TimePicker value={sendMinute ? dayjs(sendMinute, 'HH:mm:ss') : undefined} className={timeInput}
                                onChange={onTimeChange} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')}/>
                    <Select
                        className={timeInput}
                        placeholder='Time Zone'
                        value={timeZone}
                        onChange={(val) => setTimeZone(val)}
                        options={timeZones}
                    />
                </div>
            </div>
        </Modal>
        <ContentModal
            visible={showContent}
            onOk={onContentOk}
            onCancel={onContentCancel}
            value={richContent}
            onChange={val => handleChangeContent(val)}
        />
    </div>
};

export default CampaignEditor;
