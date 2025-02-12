import EnteredHeader from '@/component/EnteredHeader';
import styles from './page.module.scss';
import staticContent from './aboutCookies.json';
const {
  aboutCookiesContainer,
  main,
  title,
  contact,
  content,
  extraH3
} = styles;

const AboutCookies = () => {
    const { sections } = staticContent;
  return <div className={aboutCookiesContainer}>
    <EnteredHeader />
    <div className={main}>
      <div className={title}>Cookie Preferences</div>
      <div className={contact}>
        <span> Contact Us：</span>
        <span style={{ color: '#1E1E69' }}>hello@Cusob.com</span>
      </div>

      <div className={content}>

        {sections.map((section, index) => (
            <div key={index}>
              {section.heading && (
                  <section>
                    <div style={{ textIndent: '1em', fontFamily: 'Arial, Arial', fontWeight: 'bold', fontSize: '20px', color: '#333333', lineHeight: '30px' }}>{section.heading}</div>
                    <div style={{textIndent: '1em'}}>
                      {section.content}
                    </div>
                    {section.subsections && (
                        <div>
                          {section.subsections.map((subsection, subIndex) => (
                              <div key={subIndex}>
                                <div style={{ textIndent: '1em', fontFamily: 'Arial, Arial', fontWeight: 'normal', fontSize: '18px', color: '#333333', lineHeight: '30px' }}>{subsection.heading}</div>
                                <section>{subsection.content}</section>
                              </div>
                          ))}
                        </div>
                    )}
                  </section>
              )}
            </div>
        ))}
      </div>
    </div>
  </div>
};

export default AboutCookies;
