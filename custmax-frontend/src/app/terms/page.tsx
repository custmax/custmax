import EnteredHeader from '@/component/EnteredHeader';
import styles from './page.module.scss';
import termsContent from './terms.json';

const {
    aboutCookiesContainer,
    main,
    title,
    contact,
    content,
    extraH3
} = styles;

const Terms = () => {
    return (
        <div className={aboutCookiesContainer}>
            <EnteredHeader />
            <div className={main}>
                <div className={title}>Terms of Use</div>
                <div className={contact}>
                    <span> Contact Us：</span>
                    <span style={{ color: '#1E1E69' }}>hello@Cusob.com</span>
                </div>
                <div className={content}>
                    {termsContent.sections.map((section, index) => (
                        <section key={index}>
                            <div style={{ textIndent: '1em', fontFamily: 'Arial, Arial', fontWeight: 'bold', fontSize: '20px', color: '#333333', lineHeight: '30px' }}>{section.title}</div>
                            <p>{section.content}</p>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Terms;
