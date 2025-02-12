'use client';

import React from 'react';
import { Typography, Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'; // 导入错误图标
import styles from './page.module.scss';

const ErrorPage: React.FC = () => {
    return (
        <Box className={styles.container}>
            <Box className={styles.card}>
                <img className={styles.logo} src="/img/logo2.png" alt="CusOb logo" />
                <Box className={`${styles.message} ${styles.error}`}>
                    <ErrorOutlineIcon className={styles.errorIcon} /> {/* 添加错误图标 */}
                    <Typography variant="h6" component="div" sx = {{fontWeight: 'bold',width: '100%'}}>
                        Something went wrong.
                    </Typography>
                </Box>
                <Typography variant="body1" component="div" sx={{ marginTop: '1rem',width: '80%' }}>
                    Your email verification failed. Please try again or call us at 001 517 7606 888 for help.
                </Typography>
            </Box>
        </Box>
    );
};

export default ErrorPage;
