import EnteredHeader from '@/component/EnteredHeader';
import styles from './page.module.scss';

const {
    aboutCookiesContainer,
    main,
    title,
    contact,
    content,
    extraH3
} = styles;

const Careers = () => {
    return <div className={aboutCookiesContainer}>
        <EnteredHeader />
        <div className={main}>
            <div className={title}>Careers</div>
            <div className={contact}>
                <span> Contact Us：</span>
                <span style={{ color: '#1E1E69' }}>hello@Cusob.com</span>
            </div>
            <div className={content}>
                <h3>
                    Join Our Team
                </h3>
                <section>
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    At CusOb, we're on a mission to Customer Obsession. As we continue to grow and expand our reach, we're looking for talented individuals to join us in making a difference. If you're passionate about [mention the industry or field your company operates in] and thrive in a dynamic, collaborative environment, we want to hear from you!
                </section>
                <section>
                    Current Openings:
                </section>
                <h3>
                    Senior Product Manager
                </h3>
                <section>
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    As a Senior Product Manager at CusOb, you'll play a key role in shaping the future of our products. We're seeking an experienced and strategic-minded individual who can drive product vision, roadmap, and execution. If you have a passion for innovation, a track record of delivering successful products, and excellent communication skills, we want to hear from you.
                </section>

                <h3>
                    Marketing Specialist
                </h3>
                <section>
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    Are you a creative and results-driven marketer with a passion for driving growth? Join our marketing team as a Marketing Specialist and help us build and execute impactful marketing campaigns. From digital marketing to content creation, you'll have the opportunity to make a meaningful impact on our brand and business. If you have a proven track record in marketing, a creative mindset, and a desire to drive results, we'd love to hear from you.
                  </section>
                <h3>
                    Why Join Us?
                </h3>
                <section>
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    • Impact: Be part of a team that's making a difference and shaping the future of [industry/field].
                </section>
                <section>
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    • Collaborative Environment: Work with talented and passionate individuals who are dedicated to success.
                </section>
                <section>
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    • Growth Opportunities: Grow both personally and professionally in a dynamic and supportive environment.
                </section>
                <section>
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    • Innovative Culture: Join a company that embraces innovation and encourages creativity.
                </section>
                <section>
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    • Competitive Benefits: Enjoy competitive salaries, benefits, and perks designed to support your well-being and success.
                </section>
                <section>
                    Ready to take the next step in your career? Apply now to join our team and help us build something amazing!
                </section>
                <section>
                    Contact Us!
                </section>
            </div>
        </div>
    </div>
};

export default Careers;
