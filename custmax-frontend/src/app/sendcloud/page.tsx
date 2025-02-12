'use client';

import EnteredHeader from "@/component/EnteredHeader";
import SideBar from "@/component/SideBar";
import styles from './page.module.scss';
import {Button} from "antd";
import {SUCCESS_CODE} from "@/constant/common";
import {getDomainList, addDomain, updateDomain, checkDomain, deleteDomain} from "@/server/sendcloud/domain";
import {getApiUserList, addApiUser, updateApiUser} from "@/server/sendcloud/apiUser";
import {getTemplateList, getTemplateDetail, addTemplate, removeTemplate, updateTemplate} from "@/server/sendcloud/template";
import {getSenderList, getSenderDetail, saveSender, updateSender, removeSender} from "@/server/sendcloud/senders";
import {getTagList, saveTag, updateTag, deleteTag, getTagMember} from "@/server/sendcloud/tags";
import {getContactList, getContactDetail, updateContact, removeContact, saveContact} from "@/server/sendcloud/contact";
import {getCampaignList, getCampaignDetail, saveCampaign, removeCampaign, updateCampaign} from "@/server/sendcloud/campaigins";
import {sendEmailBySendCloud} from "@/server/sendcloud/mail";
import {getAddressList, addAddressList, updateAddressList, removeAddressList} from "@/server/sendcloud/addressList";
import {getMemberList, getMember, addMember, updateMember, removeMember} from "@/server/sendcloud/addressMember";


const {
    sendCloudContainer,
    main,
    btnSend,
} = styles

const SendCloud = () => {

    // const getDomain = async () => {
    //     const domain = 'chtrak.com'
    //     const res = await getDomainList(domain)
    //     console.log(res)
    // }

    const saveDomain = async () => {
        const res = await addDomain('dlgems.com')
        console.log(res)
    }

    const editDomain = async () => {
        const res = await updateDomain('dlgems.com', 'email-marketing-hub.com')
        console.log(res)
    }

    const verifyDomain = async () => {
        const res = await checkDomain('mail.email-marketing-hub.com')
    }

    const removeDomain = async () => {
        const res = await deleteDomain('daybreakhust.top')
    }

    const findApiUserList = async () => {
        const res = await getApiUserList('')
    }

    const saveApiUser = async () => {
        const res = await addApiUser('cusob_batch02', 'mail.dlgems.com')
    }

    const editApiUser = async () => {
        const res = await updateApiUser('cusob_batch02', 'dlgems', 'mail.dlgems.com')
    }

    const findTemplateList = async () => {
        const res = await getTemplateList()
    }

    const getTemplate = async () => {
        const res = await getTemplateDetail('template01')
    }

    const saveTemplate = async () => {
        const html = "<table class=\"inner_table\" align=\"center\" width=\"600\">\n" +
            "    <tbody>\n" +
            "        <tr class=\"firstRow\">\n" +
            "            <td align=\"center\" style=\"font-family: Geist, sans-serif; font-size: 38px; -webkit-font-smoothing: subpixel-antialiased; text-size-adjust: 100%; line-height: 46px; text-align: center; font-weight: 600; letter-spacing: -0.04em;\">\n" +
            "                <p style=\"line-height: 64.6px; text-size-adjust: 100%;\">\n" +
            "                    <strong>Vercel Product Update</strong>\n" +
            "                </p>\n" +
            "            </td>\n" +
            "        </tr>\n" +
            "        <tr>\n" +
            "            <td style=\"font-size: 1px; -webkit-font-smoothing: subpixel-antialiased; text-size-adjust: 100%; line-height: 1px;\"></td>\n" +
            "        </tr>\n" +
            "        <tr>\n" +
            "            <td align=\"center\" style=\"font-family: Geist, sans-serif; font-size: 16px; -webkit-font-smoothing: subpixel-antialiased; text-size-adjust: 100%; color: rgb(68, 68, 68); line-height: 24px; text-align: center;\">\n" +
            "                <p>\n" +
            "                    Improved infrastructure pricing | HIPAA compliance | ModelFusion acquisition | Vercel Ship 2024\n" +
            "                </p>\n" +
            "            </td>\n" +
            "        </tr>\n" +
            "    </tbody>\n" +
            "</table>\n" +
            "<p>\n" +
            "    <br/>\n" +
            "</p>"
        const res = await addTemplate('template02', 'template02', html, "Product Update")
    }

    const deleteTemplate = async () => {
        const res = await removeTemplate('template02')
    }

    const editTemplate = async () => {
        const html = "<table class=\"inner_table\" align=\"center\" width=\"600\">\n" +
            "    <tbody>\n" +
            "        <tr class=\"firstRow\">\n" +
            "            <td align=\"center\" style=\"font-family: Geist, sans-serif; font-size: 38px; -webkit-font-smoothing: subpixel-antialiased; text-size-adjust: 100%; line-height: 46px; text-align: center; font-weight: 600; letter-spacing: -0.04em;\">\n" +
            "                <p style=\"line-height: 64.6px; text-size-adjust: 100%;\">\n" +
            "                    <strong>Vercel Product Update</strong>\n" +
            "                </p>\n" +
            "            </td>\n" +
            "        </tr>\n" +
            "        <tr>\n" +
            "            <td style=\"font-size: 1px; -webkit-font-smoothing: subpixel-antialiased; text-size-adjust: 100%; line-height: 1px;\"></td>\n" +
            "        </tr>\n" +
            "        <tr>\n" +
            "            <td align=\"center\" style=\"font-family: Geist, sans-serif; font-size: 16px; -webkit-font-smoothing: subpixel-antialiased; text-size-adjust: 100%; color: rgb(68, 68, 68); line-height: 24px; text-align: center;\">\n" +
            "                <p>\n" +
            "                    Improved infrastructure pricing | HIPAA compliance | ModelFusion acquisition | Vercel Ship 2024\n" +
            "                </p>\n" +
            "            </td>\n" +
            "        </tr>\n" +
            "    </tbody>\n" +
            "</table>\n" +
            "<p>\n" +
            "    <br/>\n" +
            "</p>"
        const res = await updateTemplate('template01', 'template01', html)
    }

    const findSenderList = async () => {
        const res = await getSenderList(0, 10)
    }

    const getSenderById = async (senderId: number) => {
        const res = await getSenderDetail(senderId)
    }

    const addSender = async () => {
        const sender = {
            fromName: 'cusob',
            email: 'cusob@mail.dlgems.com',
            domainName: 'mail.dlgems.com',
            apiUserName: 'dlgems'
        }
        const res = await saveSender(sender)
    }

    const editSender = async (senderId: number) => {
        const sender = {
            fromName: 'CusOb Team',
            email: 'cusob@mail.dlgems.com',
            domainName: 'mail.dlgems.com',
            apiUserName: 'dlgems'
        }
        const res = await updateSender(senderId, sender)
    }

    const deleteSender = async (senderId: number) => {
        const res = await removeSender(senderId)
    }

    const findTagList = async () => {
        const res = await getTagList(0, 10)
    }

    const addTag = async () => {
        const res = saveTag("USA")
    }

    const editTag = async () => {
        const res = await updateTag("663eda95c421831717c8dbb2", "ENG")
    }

    const removeTag = async () => {
        const res = await deleteTag("663eda95c421831717c8dbb2")
    }

    const findTagMember = async () => {
        const res = await getTagMember("663b787b3babae67b1118c0d", 0, 10)
    }

    const findContactList = async () => {
        const res = await getContactList(0, 10)
    }

    const getContactById = async () => {
        const res = await getContactDetail("663b77aa0ff9434a55c997d8")
    }

    const editContact = async () => {
        const contact = {
            email: '2218098884@qq.com',
            phone: '18270567095',
            name: 'ming',
            fields: {
                Age: 23
            },
            tags: ['hust']
        }
        const res = await updateContact('663b77aa0ff9434a55c997d8', contact)
    }

    const deleteContact = async () => {
        const res = await removeContact('663b77aa0ff9434a55c997d8')
    }

    const addContact = async () => {
        const contact = {
            members: [
                {
                    email: '2218098884@qq.com',
                    phone: '18270567095',
                    name: 'ming',
                    fields: {},
                    tags: ['hust']
                }
            ],
            tagFlag: 1,
            updateExisting: true
        }
        const res = await saveContact(contact)
    }

    const findCampaignList = async () => {
        const res = await getCampaignList(0, 10)
    }

    const getCampaignById = async () => {
        const res = await getCampaignDetail('57953')
    }

    const createCampaign = async () => {
        let formData = new FormData()
        const campaign = {
            taskType: 2,
            name: 'test04',
            to: "663f0a4b3babae67b1118c78",
            sendListType: "2",
            senderId: "829",
            replyTo: "2218098884@qq.com",
            templateInvokeName: "template01",
            runTime: "2024-05-12 16:30:00",
            timeZone: 8
        }
        formData.append('campaignJson', JSON.stringify(campaign))
        const res = await saveCampaign(formData)
    }

    const deleteCampaign = async () => {
        const res = await removeCampaign('58094')
    }

    const editCampaign = async () => {
        let formData = new FormData()
        const campaign = {
            taskType: 2,
            name: 'test04',
            to: "663f0a4b3babae67b1118c78",
            sendListType: "2",
            senderId: "829",
            replyTo: "2218098884@qq.com",
            templateInvokeName: "template01",
            runTime: "2024-05-12 15:30:00",
            timeZone: 8
        }
        formData.append('campaignJson', JSON.stringify(campaign))
        const res = await updateCampaign('58095', formData)
    }

    const emailSend = async () => {
        const send = {
            apiUser: 'cusob_batch01',
            apiKey: '306994509423de368b8a338ecc14e750',
            from: 'cusob@mail.email-marketing-hub.com',
            to: 'daybreak@chtrak.com',
            subject: 'Thanks',
            html: 'Nice to meet you',
            contentSummary: 'Nice to meet you',
            fromName: 'cusob',
        }
        const res = await sendEmailBySendCloud(send)
    }

    const findAddressList = async () => {
        const res = await getAddressList()
    }

    const saveAddressList = async () => {
        const address = 'friend@maillist.sendcloud.org'
        const name = 'friend'
        const res = await addAddressList(address, name)
    }

    const editAddressList = async () => {
        const address = 'friend@maillist.sendcloud.org'
        const newAddress = 'friend1@maillist.sendcloud.org'
        const name = 'friend'
        const res = await updateAddressList(address, newAddress, name)
    }

    const deleteAddressList = async () => {
        const res = await removeAddressList('friend1@maillist.sendcloud.org')
    }

    const findMemberList = async () => {
        const res = await getMemberList('hust@maillist.sendcloud.org', 0, 10)
    }

    const findMember = async () => {
        const res = await getMember('hust@maillist.sendcloud.org', '2218098884@qq.com')
    }

    const saveMember = async () => {
        const res = await addMember('hust@maillist.sendcloud.org', 'daybreak@chtrak.com', 'daybreak')
    }

    const editMember = async () => {
        const res = await updateMember('hust@maillist.sendcloud.org',
            'daybreak@chtrak.com', 'daybreak@chtrak.com', '黎明')
    }

    const deleteMember = async () => {
        const res = await removeMember('hust@maillist.sendcloud.org', 'daybreak@chtrak.com')
    }


    return <div className={sendCloudContainer}>
        <EnteredHeader />
        <SideBar />
        <div className={main}>
            <Button className={btnSend}>Send</Button>
        </div>
    </div>
}

export default SendCloud;