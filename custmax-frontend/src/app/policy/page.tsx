import EnteredHeader from '@/component/EnteredHeader';
import styles from './page.module.scss';
import policyContent from './policy.json';

const {
    aboutCookiesContainer,
    main,
    title,
    contact,
    content,
    extraH3
} = styles;

const Policy = () => {
    return (
        <div className={aboutCookiesContainer}>
            <EnteredHeader />
            <div className={main}>
                <div className={title}>Privacy</div>
                <div className={contact}>
                    <span> Contact Us：</span>
                    <span style={{ color: '#1E1E69' }}>hello@Cusob.com</span>
                </div>
                <div className={content}>
                    {policyContent.sections.map((section, index) => (
                        <section key={index}>
                            <div style={{ textIndent: '1em', fontFamily: 'Arial, Arial', fontWeight: 'bold', fontSize: '20px', color: '#333333', lineHeight: '30px' }}>{section.title}</div>
                            {Array.isArray(section.content) ? (
                                <ul>
                                    {section.content.map((item, itemIndex) => (
                                        <li key={itemIndex}>{item}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>{section.content}</p>
                            )}
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Policy;
