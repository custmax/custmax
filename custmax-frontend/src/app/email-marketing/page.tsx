'use client'
import React, {useEffect, useState} from 'react';
import EnteredHeader from "@/component/EnteredHeader";


const images1 = [
    '/img/emailMarketing/3.jpg',
    '/img/emailMarketing/4.jpg',
    '/img/emailMarketing/5.jpg',
];
const images2 = [
    '/img/emailMarketing/6.jpg',
    '/img/emailMarketing/7.jpg',
];
interface ImageSliderProps {
    images: string[]; // 定义 images 属性为字符串数组
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-80 text-center">
            <img src={images[currentImage]} alt="Slider" className="object-contain h-80" />
        </div>
    );
};

const EmailMarketing = () => {

    return (
        <div className="flex flex-col">
            <EnteredHeader />
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-4xl font-bold text-gray-800 mt-20">Welcome to CusOb</h1>
                <div className="flex items-center w-3/4 -mt-20 min-h-screen p-6">
                    <img
                        src="/img/emailMarketing/welcome.jpg"
                        alt="Free Account Registration"
                        className="object-contain h-64 w-1/2 mb-4"
                    />
                    <div className="flex flex-col items-center w-1/2 p-6">
                        <p className="text-gray-800 text-3xl font-bold mb-2">Welcome to CusOb</p>
                        <p className="text-gray-600 text-lg text-center">
                            We are happy to convert any of your good ideas and thoughts into money through email
                            marketing
                            software.
                        </p>
                    </div>
                </div>
                <div className="flex w-3/4 flex-col items-center justify-center min-h-screen">
                    {/* Free Account Registration Section */}
                    <section className="flex flex-col md:flex-row items-center mb-16">
                        <div className="md:w-1/2 p-6">
                            <h2 className="text-2xl font-semibold text-gray-800">Free Account Registration</h2>
                            <p className="mt-4 text-gray-600">
                            All users who subscribe to us can try our basic email marketing services for free, which means
                                you can send a total of 2000 emails to 500 contacts for free every month. Our powerful template
                                library is also available for you to choose from, and you can even automatically generate email
                                content for you through the AL tool.
                                Of course, if you have higher requirements, our Essentials, Standard, and Premium versions can
                                also meet your needs. More contacts, more user-friendly and practical AL tools, and more emails
                                are not a problem for us.
                            </p>
                        </div>
                        <div className="md:w-1/2">
                            <img src="/img/emailMarketing/1.jpg" alt="Free Account Registration"
                                 className="object-contain w-full h-64"/>
                        </div>
                    </section>

                    {/* The Benefits of Subscription Section */}
                    <section className="flex flex-col md:flex-row items-center mb-16">
                        <div className="md:w-1/2">
                            <img src="/img/emailMarketing/2.jpg" alt="Benefits of Subscription"
                                 className="object-contain w-full h-64"/>
                        </div>
                        <div className="md:w-1/2 p-6">
                            <h2 className="text-2xl font-semibold text-gray-800">The Benefits of Subscription</h2>
                            <p className="mt-4 text-gray-600">
                                The full name of CusOb is Customer Obsession, and our goal is to address the real needs of our
                                customers. After you subscribe to us, we will send you emails with exclusive offers, latest
                                product information, or useful tips and tutorials. You can also ask us questions via email, and
                                we will respond promptly and provide the most feasible solution. Although we may not be the best
                                email marketing software, we are definitely the most customer-centric email marketing agency.
                                Our team has many experts in electronic marketing, and if you have any related questions, we can
                                answer them via email. If you are currently troubled by a certain issue, why not click on the
                                Chat bubble in the bottom right corner.
                            </p>
                        </div>
                    </section>

                    {/* Simple Usage Method Section */}
                    <section className="flex flex-col md:flex-row items-center mb-16">
                        <div className="md:w-1/2 p-6">
                            <h3 className="text-xl font-semibold text-gray-800">Simple Usage Method</h3>
                            <p>We use powerful AI tools to automatically complete those tedious steps for you. You only
                                need to:</p>
                            <ul className="mt-4 text-gray-600 list-disc list-inside">
                                <li>Register an account and become a member of our CusOb.</li>
                                <li>Bind your account, of course, you can bind multiple Senders.</li>
                                <li>Import your contact list.</li>
                            </ul>
                        </div>
                        <div className="md:w-1/2">
                            <ImageSlider images={images1}/>
                        </div>
                    </section>

                    {/* Privacy Protection Section */}
                    <section className="flex flex-col md:flex-row items-center mb-16">
                        <div>
                            <ImageSlider images={images2}/>
                        </div>
                        <div className="md:w-1/2 p-6">
                            <h3 className="text-xl font-semibold text-gray-800">Privacy Protection</h3>
                            <p className="mt-4 text-gray-600">
                                Our privacy policy fully complies with GDPR and ePrivacy, and we have an SSL encryption
                                certificate. We can ensure that your email will not be abused or sold to third parties.
                                On our Privacy Policy page, we provide a detailed explanation of how we collect information, how
                                data is used, and how user data will be protected. Of course, we definitely request your
                                knowledge and consent before using our services.
                            </p>
                        </div>
                    </section>
                    <p>Our team hopes to use a simple yet sophisticated style to make it easy for customers to operate Email
                        Marketing, so that the advantages of this job can be known to more people. When you choose to trust us
                        and subscribe to us, we will treat you with 100% sincerity.</p>

                </div>

                <footer className="bg-white shadow-md w-full py-4">
                    <div className="container mx-auto text-center text-gray-600">
                        &copy; {new Date().getFullYear()} CusOb. All rights reserved.
                    </div>
                </footer>
            </div>
        </div>

    );
};

export default EmailMarketing;
