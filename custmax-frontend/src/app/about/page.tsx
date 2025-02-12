import EnteredHeader from '@/component/EnteredHeader';
import styles from './page.module.scss';
import staticTexts from './about.json'
const {
    aboutCookiesContainer,
    main,
    title,
    contact,
    content,
    extraH3
} = styles;

const Terms = () => {
    const {  sections } = staticTexts.about;
    return <div className={aboutCookiesContainer}>
        <EnteredHeader />
        <div className={main}>
            <div className={title}>About</div>
            <div className={contact}>
                <span> Contact Us：</span>
                <span style={{ color: '#1E1E69' }}>hello@Cusob.com</span>
            </div>
            <div className={content}>
                {sections.map((section:string, index:number) => (
                    <section key={index}>{section}</section>
                ))}
            </div>
        </div>
    </div>
};

export default Terms;
