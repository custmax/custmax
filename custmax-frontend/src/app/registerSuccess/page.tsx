'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import Head from 'next/head'; // Import the Head component from next/head
import styles from './page.module.scss';
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getRegisterStatus } from "@/server/user";
import { SUCCESS_CODE } from "@/constant/common";

const Verified = () => {
    const [status, setStatus] = useState(false);
    const searchParams = useSearchParams();
    const uuId = searchParams.get('uuid');
    const router = useRouter(); // Use useRouter from next/navigation

    const initStatus = async () => {
        const res = await getRegisterStatus(uuId);
        if (res.code === SUCCESS_CODE) {
            return (
                <div className={styles.container}>
                    <div className={styles.innerContainer}>
                        <img
                            src="/img/logo.png"
                            alt="CusOb Logo"
                            className={styles.logo}
                        />
                        <div className={styles.message}>Your email address has been verified!</div>
                        <div className={styles.description}>
                            Welcome to CusOb! CusOb is a marketing automation and email marketing platform.
                        </div>
                        <Link href="/login" className={styles.ctaBtn}>Get started now</Link>
                    </div>
                </div>
            );
        } else {
            router.push('/verificationFailed')
        }
    };

    useEffect(() => {
        initStatus();

    }, []); // Empty dependency array means this effect runs once on mount

    return (
        <div className={styles.container}>
            <div className={styles.innerContainer}>
                <img
                    src="/img/logo.png"
                    alt="CusOb Logo"
                    className={styles.logo}
                />
                <div className={styles.message}>Your email address has been verified!</div>
                <div className={styles.description}>
                    Welcome to CusOb! CusOb is a marketing automation and email marketing platform.
                </div>
                <Link href="/login" className={styles.ctaBtn}>Get started now</Link>
            </div>
        </div>
    );
};

export default Verified;
