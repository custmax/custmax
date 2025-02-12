import styles from './page.module.scss';
import Banner2 from './component/Banner2'
import DemoForm from './component/DemoForm'
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import type {Metadata} from "next";

const {
  bookContainer
} = styles;

export const metadata: Metadata = {
  title: "BookDemo | Cusob",
  description: "CusOb",
};

const BookDemo = () => {
  return <div className={bookContainer}>
    <Header showBar showSign />
    <Banner2 />
    <DemoForm />
    <Footer />
  </div>
};

export default BookDemo;