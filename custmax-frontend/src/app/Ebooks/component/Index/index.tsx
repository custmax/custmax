
import styles from './index.module.scss';
import classNames from 'classnames';
import Banner2 from './component/Banner2'
import Feature1 from './component/Feature1'
import Feature1_2 from './component/Feature1_2'
import Feature2_2 from './component/Feature2_2'
import Feature3_2 from './component/Feature3_2'
import Feature4 from './component/Feature4'
import Head from "next/head";
import type {Metadata} from "next";
import Banner_new from "@/component/Index/component/Banner_new";

const {
  indexContainer
} = styles;



const Index = () => {
  return <div className={classNames(indexContainer)}>

    {/*<Banner />*/}
    {/*<Banner_new/>*/}
    <Banner2/>
    <Feature1_2 />
    {/*<Feature1 />*/}
    <Feature2_2 />
    <Feature3_2 />
    <Feature4 />
  </div>
};

export default Index;