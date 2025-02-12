import EnteredHeader from '@/component/EnteredHeader';
import styles from './page.module.scss';


import Header from "@/component/Header";
import Link from "next/link";

const {
    header,
    container,
    column,
    item
} = styles;
const Sitemap = () => {

    return <div>
        <Header></Header>
    <br/>
    <br/>
    <br/>
        <div className={container}>
            <div className="column">About CusOb
            <div className={item}>
                <a href="/about" > About Us</a>
            </div>
            <div className={item}>
                <a href="/careers" > Career Opportunities</a>
            </div>
            <div className={item}>
                <a href="/" > Contact CusOb</a>
            </div>
            <div className={item}>
                <a href="/policy" > Legal</a>
            </div>
            <div className={item}>
                <a href="/bookDemo" > Product Feedback</a>
            </div>
            </div>
            <div className="column">
                Account
                <div className={item}>
                    <a href="/login" > Log In</a>
                </div>
                <div className={item}>
                    <a href="/signup" > Sign up</a>
                </div>
                <div className={item}>
                    <a href="/login" > Forgot your password</a>
                </div>
                <div className={item}>
                    <a href="/"> Delete Account</a>

                </div>

            </div>
            <div className="column">
                Contacts
                <div className={item}>
                    <a href="/login" > Add New</a>
                </div>
                <div className={item}>
                    <a href="/signup" > Import</a>
                </div>
                <div className={item}>
                    <a href="/login" > Update</a>
                </div>
                <div className={item}>
                    <a href="/">Delete </a>

                </div>
            </div>
            <div className="column">
                Campaigns
                <div className={item}>
                    <a href="/login" > Create One</a>
                </div>
                <div className={item}>
                    <a href="/signup" > Update</a>
                </div>

            </div>
        </div>
        <div className={container}>
            <div className="column">Reports
                <div className={item}>
                    <a href="/login" > Opens</a>
                </div>
                <div className={item}>
                    <a href="/login" > Clicks</a>
                </div>
            </div>
            <div className="column">
                Media
                <div className={item}>
                    PDF
                </div>
                <div className={item}>
                    DOCX
                </div>
                <div className={item}>
                    PICTURE
                </div>
                <div className={item}>
                    IMAGES
                </div>
                <div className={item}>
                    EXCEL
                </div>
            </div>
            <div className="column">Templates
                <div className={item}>
                    <a href="/login" > Add</a>
                </div>
                <div className={item}>
                    <a href="/login" > Update</a>
                </div>
                <div className={item}>
                    <a href="/login" > Delete</a>
                </div>
                <div className={item}>
                    <a href="/login" > Common Template</a>
                </div>
            </div>
            <div className="column"></div>
        </div>




    </div>

}

export default Sitemap