'use client';
import EnteredHeader from '@/component/EnteredHeader';
import styles from './page.module.scss';
import SideBar from '@/component/SideBar';
import {
    Input,
    Select,
    Space,
    TableProps,
    message,
    Modal,
    PaginationProps,
} from 'antd';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import ImgWrapper from '@/component/ImgWrapper';
import {SetStateAction, useCallback, useEffect, useState} from 'react';
import {TableRowSelection} from 'antd/es/table/interface';
import Link from 'next/link';
import {deleteContact, deleteGroup, getAllContact, getGroup, getList, removeContact} from '@/server/contact';
import {
    getGroupList,
    getGroupsAndContactCount,
    getSubscriptionCount,
} from '@/server/group';
import {SUCCESS_CODE} from '@/constant/common';
import classNames from 'classnames';
import Tracking from "@/server/tracking";

type DataType1 = {
    key: number,
    groupName: string,
    totals: string,
    creationTime: string,
    latestActivity: string,
    latestPerformance: string,
}
type DataType2 = {
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    company: string,
    phone: string,
    groupName: string,
    subscriptionType: string,
}

const {
    contactListContainer,
    titleBox,
    title,
    main,
    menu,
    content,
    content1,
    filterBox,
    filterLeft,
    searchInputBox,
    searchInput,
    searchIconBox,
    searchIcon,
    tag,
    categoryBox,
    groupTitle,
    groupItem,
    active,
    addgroupItem,
    groupModal
} = styles;

const pageSize = 10;

const ContactList = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [showGroup, setShowGroup] = useState<boolean>(false);
    const [showEditGroup, setShowEditGroup] = useState<boolean>(false);
    const [editGroupName, setEditGroupName] = useState('');
    const [groupName, setGroupName] = useState('');
    const [activeGroupId, setActiveGroupId] = useState(-1)
    const [groupList, setGroupList] = useState<{ groupName: string, id: number }[]>([]);
    const [subObj, setSubObj] = useState<Record<string, number> | null>(null);
    const [groupNumObj, setGroupNumObj] = useState<Record<string, number> | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [contactList, setContactList] = useState([])
    const [searchVal, setSearchVal] = useState('');
    const [total, setTotal] = useState(0)
    const [totalCount, setTotalCount] = useState(0);
    const [activeTab, setActiveTab] = useState('1');
    const [selectedOption, setSelectedOption] = useState<string>('group_name');
    const [selectedType, setSelectedType] = useState<string>('Asc');
    let [groups, setGroups] = useState<DataType1[]>([]);
    let [selectGroupList, setSelectGroupList] = useState<{ key: number, value: boolean, name: string }[]>([]);
    let [allGroupButton, setAllGroupButton] = useState<boolean>(false);

    let [contacts, setContacts] = useState<DataType2[]>([]);
    let [selectContactList, setSelectContactList] = useState<{ key: number, value: boolean }[]>([]);
    let [allContactButton, setAllContactButton] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);

    const initGroupList = async () => {
        const res = await getGroupList()
        if (res.code === SUCCESS_CODE) {
            setGroupList(res.data)
        }
    }

    const initGroupNum = async () => {
        //console.log("sadfhsadhfgsdjafgdsajhf");
        const res = await getGroupsAndContactCount()
        if (res.code === SUCCESS_CODE) {
            setGroupNumObj(res.data)
        }
    }
    const initSubNum = async () => {
        //console.log("sadfhsadhfgsdjafgdsajhf");
        const res = await getSubscriptionCount()
        //console.log("HHH");
        console.log(res.data);
        if (res.code === SUCCESS_CODE) {
            setSubObj(res.data)
        }
    }


// 设置活动组 ID 为 -1。
// 显示加载消息。
// 通过 getList 函数获取第一页的联系人数据。
// 加载完成后销毁加载消息。
// 如果请求成功，更新联系人列表和当前页码。
    const initList = useCallback(async () => {
        message.loading({content: 'loading', duration: 10, key: 'listLoading'})
        const d = await Tracking();
        console.log(d)
        const res = await getList(currentPage, pageSize)
        message.destroy('listLoading')
        if (res.code === SUCCESS_CODE && res.data) {
            console.log(res.data)
            setContactList(res.data?.records.map((item: { id: number }) => ({...item, key: item.id})) || [])
            setTotal(res.data?.total || 0)
            setTotalCount(res.data?.total || 0)
        }
    }, [currentPage, pageSize])

    useEffect(() => {
        initList()
        initGroupList()
        initGroupNum()
        initSubNum()
    }, [])


    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };


    const onPageChange: PaginationProps['onChange'] = async (pageNumber: number) => {
        setCurrentPage(pageNumber)
        message.loading({content: 'loading', duration: 10, key: 'listLoading'})
        const res = await getList(pageNumber, pageSize)
        message.destroy('listLoading')
        if (res.code === SUCCESS_CODE) {
            console.log(res.data)
            setContactList(res.data?.records.map((item: { id: number }) => ({...item, key: item.id})) || [])
            setTotal(res.data?.total)
        }
    }
    const getGroups = async () => {
        const res = await getGroup(selectedType, selectedOption)
        console.log("res.data:" + res.data)
        if (res.code !== SUCCESS_CODE) {
            message.warning("5555555555")
            return
        } else {
            setGroups(res.data)
        }
    }

    const getContacts = async () => {
        const res = await getAllContact(searchVal)
        console.log("res.data:" + JSON.stringify(res.data))
        if (res.code !== SUCCESS_CODE) {
            message.warning("5555555555")
            return
        } else {
            setContacts(res.data)
            console.log(JSON.stringify(contacts))
        }
    }

    useEffect(() => {
        getGroups();
    }, [selectedType]);

    useEffect(() => {
        getGroups();
    }, [selectedOption]);


    const pagination = {
        currentPage: currentPage,
        pageSize: pageSize,
        defaultCurrent: 1,
        total: total,
        onChange: onPageChange,
    }

    const columns1: TableProps<DataType1>['columns'] = [//选择要展示的信息
        {
            title: 'Group Name',
            dataIndex: 'Group Name',
            key: 'Group Name',
            width: 240,
            render: (item, record) => (
                <Space size="middle">
                    <span style={{display: 'inline-block', width: '10vw'}}>{item}</span>
                    {/*<Link href={`/contactEditor?id=${record.key}`}>*/}
                    {/*  <div className={editButton}>edit</div>*/}
                    {/*  /!*<ImgWrapper className={editIcon} src='/img/edit_icon.png' alt='edit icon' />*!/*/}
                    {/*</Link>*/}
                </Space>
            ),
        },
        {
            title: 'Totals',
            dataIndex: 'Totals',
            key: 'Totals',
            width: 240,
        },
        {
            title: 'Creation Time',
            dataIndex: 'Creation Tim',
            key: 'Creation Tim',
            width: 240,
        },
        {
            title: 'Latest Activity',
            dataIndex: 'Latest Activity',
            key: 'Latest Activity',
            width: 240,
        },
        {
            title: 'Latest Performance',
            dataIndex: 'Latest Performance',
            key: 'Latest Performance',
            width: 240,
        },
    ];

    const columns2: TableProps<DataType2>['columns'] = [//选择要展示的信息
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (item, record) => (
                <Space size="middle">
                    <span style={{display: 'inline-block', width: '10vw'}}>{item}</span>
                    {/*<Link href={`/contactEditor?id=${record.key}`}>*/}
                    {/*  <div className={editButton}>edit</div>*/}
                    {/*  /!*<ImgWrapper className={editIcon} src='/img/edit_icon.png' alt='edit icon' />*!/*/}
                    {/*</Link>*/}
                </Space>
            ),
        },
        {
            title: 'First name',
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: 'Last name',
            dataIndex: 'lastName',
            key: 'lastName',
        },
        {
            title: 'Company',
            dataIndex: 'company',
            key: 'company',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Group',
            key: 'groupName',
            dataIndex: 'groupName',
            render: (item) => (
                <Space size="middle">
                    <div className={tag}>{item}</div>
                </Space>
            ),
        },
    ];

    const rowSelection1: TableRowSelection<DataType1> = {
        selectedRowKeys,
        onChange: onSelectChange
    };
    const rowSelection2: TableRowSelection<DataType2> = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    const onGroupItemClick = async (groupItem: { groupName: string, id: number }) => {
        if (activeGroupId === groupItem.id) {
            setShowEditGroup(true);
            setEditGroupName(groupItem.groupName)
            return;
        }
        setActiveGroupId(groupItem.id)
        if (groupItem.id) {
            message.loading({content: 'loading', duration: 10, key: 'listLoading'})
            const res = await getList(1, pageSize, searchVal || '', groupItem.id, '')
            message.destroy('listLoading')
            if (res.code === SUCCESS_CODE) {
                setContactList(res.data?.records.map((item: { id: number }) => ({...item, key: item.id})) || [])
                setTotal(res.data?.total)
                setCurrentPage(1)
            }
        }
    }
    const onSubscriptionTypeClick = async (subscriptionType: string) => {
        if (subscriptionType === 'Subscribed') {
            setActiveGroupId(100);
        } else if (subscriptionType === 'Non-subscribed') {
            setActiveGroupId(200);
        } else if (subscriptionType === 'Unsubscribed') {
            setActiveGroupId(300);
        }

        message.loading({content: 'loading', duration: 10, key: 'listLoading'});

        try {
            console.log("sadfhsadhfgsdjafgdsajhf");
            console.log(subscriptionType);

            const res = await getList(1, pageSize, searchVal || undefined, 0, subscriptionType);
            console.log(res.data);

            message.destroy('listLoading');

            if (res.code === SUCCESS_CODE) {
                setContactList(res.data?.records.map((item: any) => ({...item, key: item.id})) || []);
                setTotal(res.data?.total);
                setCurrentPage(1);
            } else {
                message.error('Failed to load contacts');
            }
        } catch (error) {
            message.destroy('listLoading');
            message.error('An error occurred while fetching data');
        }
    };

    const onAllContactClick = async () => {
        setActiveGroupId(-1)
        message.loading({content: 'loading', duration: 10, key: 'listLoading'})
        const res = await getList(1, pageSize, searchVal || '')
        message.destroy('listLoading')
        if (res.code === SUCCESS_CODE) {
            setContactList(res.data?.records.map((item: { id: number }) => ({...item, key: item.id})) || [])
            setCurrentPage(1)
        }
    }
    const MenuSwitcher = () => {
        const handleClick = (tab: SetStateAction<string>) => {
            setActiveTab(tab);
        };

        return (
            <div className="w-full">
                <div className="flex border-b border-custom-purple space-x-10 ">
                    <button
                        className={`py-2 px-4 text-sm ${
                            activeTab === '1' ? 'text-2xl font-bold border-b-4 border-custom-purple' : 'text-xl  border-b-0'
                        }`}
                        onClick={() => {
                            getGroups();
                            handleClick('1');
                        }}
                    >
                        <p className="leading-[normal] text-[#000000]">Contact Groups</p>
                    </button>
                    <button
                        className={`py-2 px-4 text-sm ${
                            activeTab === '2' ? 'text-2xl font-bold border-b-4 border-custom-purple' : 'text-xl  border-b-0'
                        } `}
                        onClick={() => {
                            getContacts();
                            handleClick('2');
                        }
                        }
                    >
                        <p className="leading-[normal] text-[#000000]">All Contacts</p>
                    </button>
                    <button
                        className={`py-2 px-4 text-sm ${
                            activeTab === '3' ? 'text-2xl font-bold border-b-4 border-custom-purple' : 'text-xl  border-b-0'
                        }`}
                        onClick={() => handleClick('3')}
                    >
                        <p className="leading-[normal] text-[#000000]">Segments</p>
                    </button>
                    <div className="flex-grow"></div>
                    {/* 空的 flex-grow 元素，用于推动按钮到最右侧 */}
                    <button className="py-2 px-4 text-white rounded bg-custom-purple">
                        <Link href="/groupAdder">
                            Add Group
                        </Link>
                    </button>
                    <button className="py-2 px-4 text-white rounded bg-custom-purple" onClick={() => {
                    }}>
                        <Link href={"/importWay"}>Add Contact</Link>
                    </button>
                    <Modal
                        title="Add Group"
                        open={visible}
                        wrapClassName={groupModal}
                        width={'80vw'}
                    >

                    </Modal>
                </div>
            </div>
        );
    };

    const selectOrCancelOneByGroup = (key: number, check: boolean, name: string) => {
        if (!check) {
            const index = selectGroupList.findIndex(elem => elem.key === key)
            selectGroupList.splice(index, 1)
        } else {
            selectGroupList.push({key: key, value: check, name: name})
        }
    }
    const selectOrCancelOneByContact = (key: number, check: boolean) => {
        if (!check) {
            const index = selectContactList.findIndex(elem => elem.key === key)
            selectContactList.splice(index, 1)
        } else {
            selectContactList.push({key: key, value: check})
        }
    }
    const selectOrCancelAllByGroup = async () => {
        selectGroupList.splice(0, groups.length)
        groups.map(one => {
            selectGroupList.push({key: one.key, value: true, name: one.groupName})
        })
    }

    const selectOrCancelAllByContact = async () => {
        selectContactList.splice(0, groups.length)
        contacts.map(one => {
            selectContactList.push({key: one.id, value: true})
        })
    }

    const deleteByGroup = async () => {
        const groupIds: number[] = [];
        selectGroupList.map(one => {
            groupIds.push(one.key)
        })
        const res = await deleteGroup(groupIds)
        if (res.code === SUCCESS_CODE) {
            getGroups()
        }
    }

    const deleteByContact = async () => {
        const contactIds: number[] = [];
        selectContactList.map(one => {
            contactIds.push(one.key)
            console.log(one.key)
        })
        const res = await deleteContact(contactIds)
        if (res.code === SUCCESS_CODE) {
            getContacts()
        }
    }

    const HiddenPage1 = () => {
        // @ts-ignore
        // @ts-ignore
        return (
            <div className={content}>
                <div className={filterBox}>
                    <div className={filterLeft}>
                        <span onClick={deleteByGroup}>Delete</span>
                        <span><Link href='/importWay'>Export</Link></span>
                        <span>Merge</span>
                        <span>Send</span>
                    </div>
                    <DropdownSelect/>
                </div>
                <Table>
                    <TableCaption>A list of your groups.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <button className="bg-custom-purple text-white" onClick={selectOrCancelAllByGroup}
                                > deleteAll
                                </button>
                                {/* 表头复选框 */}
                            </TableHead>
                            <TableHead>Group Name</TableHead>
                            <TableHead>Totals</TableHead>
                            <TableHead className="text-right">Creation Time</TableHead>
                            <TableHead className="text-right">Latest Activity</TableHead>
                            <TableHead className="text-center">Latest Performance</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {groups.map((groups) => (
                            // eslint-disable-next-line react/jsx-key
                            <TableRow key={groups.key}>
                                <TableCell>
                                    <input type="checkbox" className="form-checkbox"
                                           onChange={(event) => {
                                               selectOrCancelOneByGroup(groups.key, event.target.checked, groups.groupName);
                                           }}
                                    /> {/* 每行的复选框 */}
                                </TableCell>
                                <TableCell className="text-custom-purple">{groups.groupName}</TableCell>
                                <TableCell>{groups.totals}</TableCell>
                                <TableCell className="text-right">{groups.creationTime}</TableCell>
                                <TableCell className="text-right">{groups.latestActivity}</TableCell>
                                <TableCell className="text-center">{groups.latestPerformance}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    };

    const HiddenPage2 = () => {
        return (
            <div className="hidden-page">
                <div className={categoryBox}>
                    {/*侧边过滤器显示*/}
                    <div className={title}>Filter By</div>
                    <div className={groupTitle}>Group</div>
                    <div
                        className={classNames(groupItem, {[active]: activeGroupId === -1})}
                        onClick={onAllContactClick}
                    >
                        All Contacts（{totalCount}）
                    </div>
                    {
                        groupList.map((item, index) => <div
                            key={index}
                            className={classNames(groupItem, {[active]: item.id === activeGroupId})}
                            onClick={() => onGroupItemClick(item)}
                        >
                            {item.groupName}（{groupNumObj ? groupNumObj[item.groupName] || 0 : 0}）
                        </div>)
                    }
                    <div className={addgroupItem} onClick={() => setShowGroup(true)}>Add New Group</div>
                    {/*订阅类型*/}
                    <div className={groupTitle}>Subscription type</div>
                    <div>
                        <div
                            className={classNames(groupItem, {[active]: activeGroupId === 100})}
                            onClick={() => onSubscriptionTypeClick('Subscribed')}
                        >
                            Subscribed（{subObj ? subObj['Subscribed'] || 0 : 0}）
                        </div>
                        <div
                            className={classNames(groupItem, {[active]: activeGroupId === 200})}
                            onClick={() => onSubscriptionTypeClick('Non-subscribed')}
                        >
                            Non-subscribed（{subObj ? subObj['Non-subscribed'] || 0 : 0}）
                        </div>
                        <div
                            className={classNames(groupItem, {[active]: activeGroupId === 300})}
                            onClick={() => onSubscriptionTypeClick('Unsubscribed')}
                        >
                            Unsubscribed（{subObj ? subObj['Unsubscribed'] || 0 : 0}）
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    const HiddenPage2_1 = () => {
        return (
            <div className={content1}>
                <div className={filterBox}>
                    <div className={filterLeft}>
                        <span onClick={deleteByContact}>Delete</span>
                        <span>Export</span>
                        <span>Send</span>
                    </div>
                    <div className={searchInputBox}>
                        <Input className={searchInput} value={searchVal} onChange={e => setSearchVal(e.target.value)}
                               placeholder='Search'/>
                        <div className={searchIconBox} onClick={getContacts}>
                            <ImgWrapper className={searchIcon} src='/img/search_icon.png' alt='search icon'/>
                        </div>
                    </div>
                </div>
                <Table>
                    <TableCaption>A list of your contacts.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="px-1 text-center w-11">
                                <button className="bg-custom-purple text-white" onClick={selectOrCancelAllByContact}
                                > deleteAll
                                </button>
                                {/* 表头复选框 */}
                            </TableHead>
                            <TableHead className="px-2 text-left max-w-12">
                                Email
                            </TableHead>
                            <TableHead>
                                <div className="flex-grow"></div>
                            </TableHead>
                            <TableHead className="px-1 text-center">First Name</TableHead>
                            <TableHead className="text-center">Last Name</TableHead>
                            <TableHead className="text-center">Company</TableHead>
                            <TableHead className="text-center">Subscription Type</TableHead>
                            <TableHead className="text-center">Phone</TableHead>
                            <TableHead className="text-center">Group</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contacts.map((contact) => (
                            // eslint-disable-next-line react/jsx-key
                            <TableRow key={contact.id}>
                                <TableCell className="px-0 text-center m-1">
                                    <input type="checkbox" className="form-checkbox"
                                           onChange={(event) => {
                                               selectOrCancelOneByContact(contact.id, event.target.checked);
                                           }}
                                    /> {/* 每行的复选框 */}
                                </TableCell>
                                <TableCell className="px-2 text-custom-purple text-left max-w-12">
                                    {contact.email}
                                </TableCell>
                                <TableCell>
                                    <div className="flex-grow"></div>
                                </TableCell>
                                <TableCell className="px-1 text-center">{contact.firstName}</TableCell>
                                <TableCell className="text-center">{contact.lastName}</TableCell>
                                <TableCell className="text-center">{contact.company}</TableCell>
                                <TableCell className="text-center">{contact.subscriptionType}</TableCell>
                                <TableCell className="text-center">{contact.phone}</TableCell>
                                <TableCell className="text-center">{contact.groupName}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    };
    const DropdownSelect = () => {
        const handleChange = (value: string) => {
            setSelectedOption(value);
        };
        const handleType = (value: string) => {
            setSelectedType(value);
        };

        return (
            <div className="flex space-x-4">
                <Select
                    className="w-full border border-gray-300 rounded-md"
                    placeholder="SortedType"
                    value={selectedType}
                    onChange={handleType}
                    style={{width: '120px'}}
                >
                    <option value="Desc">Desc</option>
                    <option value="Asc">Asc</option>
                </Select>
                <Select className="w-full border border-gray-300 rounded-md"
                        placeholder="Sorted by" // 作为提示文字
                        value={selectedOption}
                        onChange={handleChange}
                        style={{width: '160px'}}
                        dropdownStyle={{borderRadius: '25vpx'}} // 自定义下拉框样式
                >
                    <option value="group_name">Group Name</option>
                    <option value="totals">Totals</option>
                    <option value="create_time">Creation Time</option>
                    <option value="update_time">Latest Activity</option>
                </Select>
            </div>
        );
    };


    return <div className={contactListContainer}>
        <EnteredHeader/>
        <SideBar/>
        <div className={titleBox}>
            <p className={title}>Contacts</p>
        </div>
        <div className={main}>
            <div className={menu}>
                <MenuSwitcher/>
            </div>
            {activeTab === '1' && <HiddenPage1/>}
            {activeTab === '2' && <HiddenPage2_1/>}
            {/*{activeTab === '2' && <HiddenPage2/>}*/}
        </div>
    </div>
};

// @ts-ignore
export default ContactList;