'use client';
import EnteredHeader from '@/component/EnteredHeader';
import styles from './page.module.scss';
import SideBar from '@/component/SideBar';
import {Input, message, Modal, Select} from 'antd';
import ImgWrapper from '@/component/ImgWrapper';
import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {
    deleteTemplateList,
    delTemplate,
    getFolderList, getLastTwoWeeksTemplate, getPrivateFolderList, getPublicFolderList,
    getTemplateList, ifRename,
    MoveTemplateToFolder,
    renameTemplateFolder
} from '@/server/template';
import {SUCCESS_CODE, TEMPLATE_REMOVE_ERROR_CODE} from '@/constant/common';
import {useRouter} from 'next/navigation';
import Image from "next/image";


const {
    emailTemplatesContainer,
    main,
    title,
    titleLeft,
    operateBox,
    searchInputBox,
    searchInput,
    searchIconBox,
    searchIcon,
    newBtn,
    content,
    filterBox,
    filterBoxSelct,
    editLastWeek,
    editLastButton,
    delDiv,
    delDivImg,
    delDivSelect,
    delDivButton,
    templateWrapper,
    templateTitle,
    templateReNameImg,
    itemWrapper,
    itemBox,
    itemBoxText,
    checkBoxDiv,
    checkboxInput,
    cover,
    text,
    itemBoxController,
    itemBoxControllerEdit,
    itemBoxControllerRedirect,
    itemBoxControllerDelete,
} = styles;


const EmailTemplates = () => {
    const router = useRouter()
    const [templateList, setTemplateList] = useState<{ folder: string, list: Template.TemplateNew[] }[]>([])
    const [searchVal, setSearchVal] = useState('');
    const [selectFirstOptions, setSelectFirstOptions] = useState([{value: 'all', label: 'All'}, {
        value: 'PRIVATE',
        label: 'PRIVATE'
    }, {value: 'PUBLIC', label: 'PUBLIC'}])
    const [selectOptions, setSelectOptions] = useState([{value: 'all', label: 'All'}])
    const [selectPrivateOptions, setSelectPrivateOptions] = useState([{value: 'all', label: 'All'}])
    const [contentModalShowRename, setContentModalShowRename] = useState(false)
    const [renameContent, setRenameContent] = useState('')
    const [folder, setFolder] = useState('')
    const [finalCheckBox, setFinalCheckBox] = useState<{ id: number, check: boolean }[]>([])


    useEffect(() => {
        initList();
        initFolderList();
        initPrivateFolderList();
    }, [])

    const getLastTwoWeeks = async () => {
        const res = await getLastTwoWeeksTemplate();
        message.loading({content: "loading", duration: 10, key: "loadingEdit"})
        if (res.code === SUCCESS_CODE) {
            message.success("Sucesss")
            const data = res.data
            const newTemplateList = []
            if (data) {
                for (const key in data) {
                    newTemplateList.push({
                        folder: key,
                        list: data[key]
                    })
                }
                setTemplateList(newTemplateList)
            }
        } else {
            message.error("error")
        }
        message.destroy('loadingEdit')
    }
    const moveToFolder = async (itemName: string) => {
        let listSelect: number[] = [];
        if (finalCheckBox.length < 1) {
            message.error("Unselected")
            return;
        }
        finalCheckBox.map(checkId => {
            listSelect.push(checkId.id)

        })
        const moveToFolderDto = {
            folderName: itemName,
            templateIds: listSelect
        }
        const res = await MoveTemplateToFolder(moveToFolderDto)
        if (res.code === SUCCESS_CODE) {
            message.success("Sucesss")
            window.location.reload();
        } else {
            message.error("error")
        }


    }


    const deleteSelectTemplate = async () => {
        let listSelect: number[] = [];
        if (finalCheckBox.length < 0) {
            message.error("UnSelected")
            return;
        }
        finalCheckBox.map(checkId => {
            listSelect.push(checkId.id)
        })
        if (listSelect.length > 0) {
            message.loading({content: 'Deleting', duration: 10, key: 'DeletingLoading1'})
            const res = await deleteTemplateList(listSelect);
            if (res.code === SUCCESS_CODE) {
                message.destroy('DeletingLoading1')
                message.info("Successfully deleted ")
                window.location.reload();
            } else if (res.code === TEMPLATE_REMOVE_ERROR_CODE) {
                message.destroy('DeletingLoading1')
                message.error("It is forbidden to delete a system template")
            }
        }

    }

    const ifOpenFolder = async (folder: string) => {
        const res = await ifRename(folder)
        if (res.code !== SUCCESS_CODE) {
            message.warning("Public templates cannot be modified\n")
            return
        } else {
            setContentModalShowRename(true)
            setFolder(folder)
        }
    }

    const renameTemplateFolders = async (oldName: string, newName: string) => {
        message.loading({content: 'Rename', duration: 10, key: 'listLoading'})
        const templateFolderRenameEntity = {
            templateName: oldName,
            newTemplateName: newName
        }
        const res = await renameTemplateFolder(templateFolderRenameEntity);
        if (res.code == SUCCESS_CODE) {
            message.info("Successfully renamed template")
            window.location.reload()
            //待定
            // await initList();
            // await initFolderList();
            // await initPrivateFolderList();
        }
        message.destroy('listLoading')
    }
    const onSelectFirstChange = async (value: string) => {
        message.loading({content: 'Loading', duration: 10, key: 'listLoading'})
        let name = '';
        if (value) {
            if (value === 'all') {
                name = 'all';
            }
            if (value === 'PRIVATE') {
                name = 'AdminPrivate';
            }
            if (value === 'PUBLIC') {
                name = 'AdminPublic';
            }
        }
        const query = {folder: value === 'all' ? '' : name, keyword: searchVal || ''}
        const res = await getTemplateList(query)
        message.destroy('listLoading')
        if (res.code === SUCCESS_CODE) {
            const data = res.data
            const newTemplateList = []
            if (data) {
                for (const key in data) {
                    newTemplateList.push({
                        folder: key,
                        list: data[key]
                    })
                }
                setTemplateList(newTemplateList)
            }
        }
        await initSelectFolderList(name);
    };
    const selectCheckBoxDouble = (realId: any, check: boolean) => {
        if (!check) {
            const delId = finalCheckBox.findIndex(element => element.id === realId);
            finalCheckBox.splice(delId, 1);
        } else {
            finalCheckBox.push({id: realId, check: check})
        }
    }
    const deleteTemplate = async (id: number) => {
        if (id) {
            const res: any = await delTemplate(id)
            if (res.code == SUCCESS_CODE) {
                message.success("Successfully deleted template")
            } else {
                message.error("An error occurred during the deletion process.")
            }
        }
    }
    const parseHtmlReact = (htmlString: string) => {
        return <div dangerouslySetInnerHTML={{__html: htmlString}}/>;
    }
    const initList = async () => {
        message.loading({content: 'loading', duration: 10, key: 'listLoading'})
        const folder = "AdminPublic";
        const query = {folder: folder}
        const res = await getTemplateList(query)
        message.destroy('listLoading')
        if (res.code === SUCCESS_CODE) {
            const data = res.data
            const newTemplateList = []
            if (data) {
                for (const key in data) {
                    newTemplateList.push({
                        folder: key,
                        list: data[key]
                    })
                }
                setTemplateList(newTemplateList)
            }
        }

    }

    const initFolderList = async () => {
        const folder = "AdminPublic";
        await initSelectFolderList(folder);
    }

    const initPrivateFolderList = async () => {
        const res = await getPrivateFolderList()
        if (res.code === SUCCESS_CODE) {
            const newSelectOptions = res.data.map((item: string) => ({value: item, label: item}))
            newSelectOptions.unshift({value: 'all', label: 'All'})
            setSelectPrivateOptions(newSelectOptions)
        }

    }

    const initSelectFolderList = async (folder: string) => {
        let res = await getFolderList()
        if (folder === "AdminPrivate") {
            res = await getPrivateFolderList()
        }
        if (folder === "AdminPublic") {
            res = await getPublicFolderList()
        }

        if (res.code === SUCCESS_CODE) {
            const newSelectOptions = res.data.map((item: string) => ({value: item, label: item}))
            newSelectOptions.unshift({value: 'all', label: 'All'})
            setSelectOptions(newSelectOptions)
        }
    }

    const onContentModalShowRenameOK = async () => {
        await renameTemplateFolders(folder, renameContent)
        setContentModalShowRename(false)

    }

    const onContentModalShowRenameCancel = async () => {
        setContentModalShowRename(false)
    }

    const onSelectChange = async (value: string) => {
        message.loading({content: 'loading', duration: 10, key: 'listLoading'})
        const query = {folder: value === 'all' ? '' : value, keyword: searchVal || ''}
        const res = await getTemplateList(query)
        message.destroy('listLoading')
        if (res.code === SUCCESS_CODE) {
            const data = res.data
            const newTemplateList = []
            if (data) {
                for (const key in data) {
                    newTemplateList.push({
                        folder: key,
                        list: data[key]
                    })
                }
                setTemplateList(newTemplateList)
            }
        }
    };

    const onSearch = async () => {
        if (searchVal) {
            message.loading({content: 'loading', duration: 10, key: 'listLoading'})
            const query = {keyword: searchVal}
            const res = await getTemplateList(query)
            message.destroy('listLoading')
            if (res.code === SUCCESS_CODE) {
                const data = res.data
                const newTemplateList = []
                if (data) {
                    for (const key in data) {
                        newTemplateList.push({
                            folder: key,
                            list: data[key]
                        })
                    }
                    setTemplateList(newTemplateList)
                }
                setSearchVal('')
            }
        }
    }

    return <div className={emailTemplatesContainer}>
        <EnteredHeader/>
        <SideBar/>
        <div className={main}>
            <div className={title}>
                <div className={titleLeft}>
                    <span>Email template</span>
                </div>
                <div className={operateBox}>
                    <div className={searchInputBox}>
                        <Input className={searchInput} value={searchVal} onChange={e => setSearchVal(e.target.value)}
                               placeholder='Search'/>
                        <div className={searchIconBox} onClick={onSearch}>
                            <ImgWrapper className={searchIcon} src='/img/search_icon.png' alt='search icon'/>
                        </div>
                    </div>
                    <Link href='/editTemplate' className={newBtn}>New template</Link>
                </div>
            </div>
            <div className={content}>
                <div className={filterBox}>
                    <Select className={filterBoxSelct}
                            defaultValue="PUBLIC"
                            onChange={onSelectFirstChange}
                            options={selectFirstOptions}
                    />
                    <Select className={filterBoxSelct}
                            defaultValue="all"
                            onChange={onSelectChange}
                            options={selectOptions}
                    />
                </div>
                <div className={editLastWeek}>
                    <button className="relative group overflow-hidden px-6 h-12 border border-purple-200 rounded-full"
                            onClick={() => {
                                getLastTwoWeeks()
                            }}>
                        <div aria-hidden="true" className="transition duration-300 group-hover:-translate-y-12">
                            <div className="h-12 flex items-center justify-center">
                                <span className="text-purple-700">Edit Over Last Week</span>
                            </div>
                            <div className="h-12 flex items-center justify-center">
                                <span className="text-purple-700">Click</span>
                            </div>
                        </div>
                    </button>
                </div>
                <div className={delDiv}>
                    <button className={delDivImg}><img className={delDivButton} title={"Delete selected"}
                                                       src={"/emailTemplates/img/delAll.png"} alt={""}
                                                       onClick={() => {
                                                           deleteSelectTemplate()
                                                       }}/></button>

                    <Select className={delDivSelect}
                            placeholder={"Move to Folder"} value={selectPrivateOptions}
                            onChange={(e) => {
                                moveToFolder(e.toString())
                            }}
                            options={selectPrivateOptions}>
                    </Select>
                    <label className={delDivButton}>Move to Folder</label>
                </div>
                {
                    templateList.map((item, index) => <div key={index} className={templateWrapper}>
                        <div className={templateTitle} style={{textDecoration: 'underline'}} onClick={() => {
                            ifOpenFolder(item.folder)
                        }}>{item.folder}
                            <Image width={"1"} height={"1"} className={templateReNameImg} title={"Rename"}
                                   onClick={() => {
                                       ifOpenFolder(item.folder)
                                   }}
                                   src='/emailTemplates/img/edit.png' alt={""}/>
                        </div>
                        <div className={itemWrapper}>
                            {item.list.map((i, idx) => <div key={idx}
                                                            className={itemBox}>
                                    <div className={itemBoxText}>
                                        <div className={checkBoxDiv}>
                                            <input type={"checkbox"} className={checkboxInput} defaultChecked={false}
                                                   onChange={(event) => {
                                                       selectCheckBoxDouble(i.id, event.target.checked);
                                                   }}/>
                                        </div>
                                        <div className={text}>{i.name}</div>
                                        <div className={cover} id={i.name}>{parseHtmlReact(i.content)}</div>
                                        <div className={itemBoxController}>
                                            <Image width={1} height={1} className={itemBoxControllerEdit}
                                                   title="Edit Template"
                                                   onClick={() => router.push(`/editTemplate?id=${i.id}`)} alt='Edit'
                                                   src='/emailTemplates/img/edit.png'/>
                                            <Image width={1} height={1} className={itemBoxControllerRedirect}
                                                   title="Redirect" onClick={() => {
                                                router.push(`/campaignEditor?templateId=${i.id}`)
                                            }} alt='Redirect' src='/emailTemplates/img/redirect.png'/>
                                            <Image width={1} height={1} className={itemBoxControllerDelete}
                                                   title="Delete Template" onClick={() => {
                                                if (i.id != null) {
                                                    deleteTemplate(i.id)
                                                }
                                            }} alt='Delete' src='/emailTemplates/img/delete.png'/>
                                        </div>
                                    </div>
                                </div>
                            )
                            }
                        </div>
                    </div>)
                }
            </div>


        </div>
        <Modal
            title="Rename"
            open={contentModalShowRename}
            onOk={onContentModalShowRenameOK}
            onCancel={onContentModalShowRenameCancel}
        >
            <div>
                <div>New Folder Name</div>
                <Input value={renameContent} onChange={e => setRenameContent(e.target.value)}></Input>
            </div>
        </Modal>
    </div>

};

export default EmailTemplates;
