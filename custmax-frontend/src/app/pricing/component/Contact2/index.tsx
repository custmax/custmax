'use client';
import ImgWrapper from '@/component/ImgWrapper';
import styles from './index.module.scss';
import classNames from 'classnames';
import Link from 'next/link';
import { Tooltip } from 'antd';
import { useState } from 'react';

const {
  feature2Container,
  title,
  subTitle,
  tooltip,
  link,
  label,
  value,
  signUp,
  signUpArrow,
  bookDemo,
  bookDemoArrow,
  bookDemoText,
  signText,
  imgBg0,
  imgBg1,
  dropdownContainer, // 新增的样式类
  dropdown,
  dropdownHeader,
  dropdownContent,
  arrow,
  down,
} = styles;

const Contact2 = () => {
  // 创建五个状态，用于跟踪每个下拉框的展开和收起状态
  const [isOpen, setIsOpen] = useState([false, false, false, false, false]);

  // 切换指定索引的下拉框状态
  const toggleDropdown = (index:any) => {
    setIsOpen((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
      <div className={classNames(feature2Container)}>
        <div className={title}>FAQs</div>
        <Tooltip
            placement="bottomLeft"
            className={tooltip}
            getPopupContainer={() => document.querySelector('#feature2') || document.body}
        >

            <div className={signUp} id='feature2'>
              <span className={signText}>Get started for free</span>
            </div>
            <div className={bookDemo} id='feature2'>
              <span className={bookDemoText}>Watch demos</span>
            </div>
        </Tooltip>

        {/* 右侧的下拉框容器 */}
        <div className={dropdownContainer}>
          {/* 下拉框1 */}
          <div className={dropdown}>
            <div className={dropdownHeader} onClick={() => toggleDropdown(0)}>
              <span className={arrow}>{isOpen[0] ? '▲' : '▼'}</span>
              <span className="question">How can I ensure my emails are delivered and not marked as spam? </span>

            </div>
            {isOpen[0] && (
                <div className={dropdownContent}>
                  <p>- To ensure your emails reach recipients&apos; inboxes, our platform utilizes advanced deliverability features such as authentication protocols like SPF, DKIM, and DMARC. Additionally, we provide guidance on email best practices to minimize the chances of your emails being marked as spam.</p>
                </div>
            )}
          </div>

          {/* 下拉框2 */}
          <div className={dropdown}>
            <div className={dropdownHeader} onClick={() => toggleDropdown(1)}>
              <span className={arrow}>{isOpen[1] ? '▲' : '▼'}</span>
              <span className="question">Can I create custom email templates without coding?</span>

            </div>
            {isOpen[1] && (
                <div className={dropdownContent}>
                  <p>- Yes, absolutely! Our platform offers a user-friendly drag-and-drop email editor that allows you to create and customize stunning email templates without any coding knowledge required. Simply choose from our pre-designed templates and customize them to suit your brand and message.</p>
                </div>
            )}
          </div>

          {/* 下拉框3 */}
          <div className={dropdown}>
            <div className={dropdownHeader} onClick={() => toggleDropdown(2)}>
              <span className={arrow}>{isOpen[2] ? '▲' : '▼'}</span>
              <span className="question">What support options are available if I need help?</span>

            </div>
            {isOpen[2] && (
                <div className={dropdownContent}>
                  <p>- We provide comprehensive support to assist you with any issues or questions you may have while using our platform. Our support team is available via email, live chat, and phone during business hours to address your concerns promptly and efficiently. Additionally, we offer extensive documentation and tutorials to help you make the most of our platform&apos;s features.</p>
                </div>
            )}
          </div>

          {/* 下拉框4 */}
          <div className={dropdown}>
            <div className={dropdownHeader} onClick={() => toggleDropdown(3)}>
              <span className={arrow}>{isOpen[3] ? '▲' : '▼'}</span>
              <span className="question">Can I segment my email list for targeted campaigns?</span>

            </div>
            {isOpen[3] && (
                <div className={dropdownContent}>
                  <p>- Absolutely! Our platform allows you to segment your email list based on various criteria such as user behavior, demographics, past purchase history, and more. By creating targeted segments, you can personalize your email campaigns to better resonate with your audience and improve engagement and conversion rates.</p>
                </div>
            )}
          </div>

          {/* 下拉框5 */}
          <div className={dropdown}>
            <div className={dropdownHeader} onClick={() => toggleDropdown(4)}>
              <span className={arrow}>{isOpen[4] ? '▲' : '▼'}</span>
              <span className="question">How secure is the platform for protecting subscriber data?</span>

            </div>
            {isOpen[4] && (
                <div className={dropdownContent}>
                  <p>- We take the security and privacy of your subscribers&apos; data very seriously. Our platform employs industry-standard encryption protocols to safeguard sensitive information, and we adhere to strict privacy regulations such as GDPR and CCPA. Additionally, we regularly update our security measures and conduct audits to ensure compliance and protect your data from unauthorized access or breaches.</p>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}

export default Contact2;
