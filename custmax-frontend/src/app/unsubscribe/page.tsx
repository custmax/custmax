'use client';
import styles from "./page.module.scss"
import {Button, message} from "antd";
import {unsubscribeCampaign} from "@/server/unsubscribe";
import {useSearchParams} from "next/navigation";
import {useEffect} from "react";
import Image from "next/image";
import {SUCCESS_CODE} from "@/constant/common";


const {
    unsubscribeContainer,
    main,
    cusob,
    logo,
    content,
    txtUnsubscribe,
    btns,
    btnOk,
    btnCancel,
} = styles

const Unsubscribe = () => {
    const searchParams = useSearchParams()
    const emailUnsubscribe = searchParams.get('email')

    const unsubscribe = async () => {
        if (emailUnsubscribe) {
            const res = await unsubscribeCampaign(emailUnsubscribe)
            if (res.code === SUCCESS_CODE) {
                message.success("The unsubscription is successful")
            }
        }
    }

    return <div className={unsubscribeContainer}>
        <div className={main}>
            <div className={cusob}>
                <Image
                    fill
                    className={logo}
                    alt='logo'
                    src='/img/logo.png'
                    sizes='100%'
                    priority
                />
            </div>
            <div className={content}>
                <div className={txtUnsubscribe}>Are you sure to unsubscribe?</div>
                <div className={btns}>
                    <Button type="primary" className={btnOk} onClick={unsubscribe}>Yes</Button>
                    <Button className={btnCancel}>No</Button>
                </div>
            </div>

        </div>
    </div>
}

export default Unsubscribe;