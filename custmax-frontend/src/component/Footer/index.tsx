import Link from 'next/link';
import ImgWrapper from '../ImgWrapper';
import styles from './index.module.scss';
import { PHONE } from '@/constant/cusob';

const {
	footerContainer,
	section1,
	footerLogo,
	links,
	linkIcon,
	phone,
	allWay,
	worldwide,
	world,
	arrowDown,
	section2,
	section2Title,
	section2SubTitle,
	section3,
	section3Title,
	section3SubTitle,
	section4,
	section4Title,
	section4SubTitle,
	section5,
	sitemap,
	copyright,
	siteText,
	line,
	section6,
	customerIcon,
	customerText,
} = styles;

const Footer = () => {
	return <div className={footerContainer}>
		<section className={section1}>
			<ImgWrapper className={footerLogo} alt='footer_logo' src='/img/footer_logo.png'/>
			<div className={links}>
				<ImgWrapper className={linkIcon} alt='link_icon_1' src='/img/link_icon_1.png'/>
				<ImgWrapper className={linkIcon} alt='link_icon_2' src='/img/link_icon_2.png'/>
				<ImgWrapper className={linkIcon} alt='link_icon_3' src='/img/link_icon_3.png'/>
				<ImgWrapper className={linkIcon} alt='link_icon_4' src='/img/link_icon_4.png'/>
				<ImgWrapper className={linkIcon} alt='link_icon_5' src='/img/link_icon_5.png'/>
			</div>
			<div className={phone}>Call us at {PHONE}</div>
			<div className={allWay}>See all ways to contact us</div>
			<div className={worldwide}>
				<ImgWrapper className={world} alt='world' src='/img/world.png'/>
				<span>Worldwide</span>
				<ImgWrapper className={arrowDown} alt='arrow_down' src='/img/arrow_down.png'/>
			</div>
		</section>
		<section className={section2}>
			<div className={section2Title}>Products</div>
			<div className={section2SubTitle}>
				<Link href='/pricing'>Pricing</Link>
			</div>
		</section>
		<section className={section3}>
			<div className={section3Title}>Resources</div>
			<div className={section3SubTitle}>
				<Link href="/pricing" >Help</Link>
			</div>
			<div className={section3SubTitle}>
				<Link href={"/email-marketing"} className={siteText}>Email Marketing</Link>
			</div>
			<div className={section3SubTitle}>
				<Link href='/blogs' className={siteText}>Blogs</Link>
			</div>
		</section>
		<section className={section4}>
			<div className={section4Title}>Company</div>
			<div className={section4SubTitle}>
				<Link href='/about'>About</Link>
			</div>
			<div className={section4SubTitle}>
				<Link href='/careers' className={siteText}>Careers</Link>
			</div>

			{/*<div className={section4SubTitle}>Blog</div>*/}
			<div className={section4SubTitle}>
				<Link href="/bookDemo" className={siteText}>Contact</Link>
			</div>
		</section>
		<section className={section5}>
			<div className={sitemap}>
				{/*<div className={siteText}>Contact</div>*/}
				{/*<div className={line}></div>*/}
				<Link href='/terms'><div className={siteText}>Terms</div></Link>
				<div className={line}></div>
				<Link href='/aboutCookies' className={siteText}>Cookie Preferences</Link>
				<div className={line}></div>
				<Link href='/sitemap' className={siteText}>Sitemap</Link>
			</div>
			<div className={copyright}>Copyright @ 2024 Customer Obsession Inc.</div>
		</section>
		{/*<section className={section6}>*/}
		{/*	<ImgWrapper className={customerIcon} alt='customer' src='/img/customer.png'/>*/}
		{/*	<div className={customerText}>Let&#39;s Chat</div>*/}
		{/*</section>*/}
	</div>
};

export default Footer;