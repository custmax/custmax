import ImgWrapper from '@/component/ImgWrapper';
import styles from './index.module.scss';
import classNames from 'classnames';


const {
  feature1Container,
  item,
  imgBox0,
  imgBox1,
  imgBox2,
  featureImg,
  text
} = styles;

const Feature1 = () => {
  return <div className={classNames(feature1Container)}>
    <div className={classNames(item)}>
      <ImgWrapper
          className={imgBox0}
          imgClassName={featureImg}
          alt='featureImg'
          src='/img/feature0.png'
          sizes='100%'
          priority
      />
      <div className={classNames(text)}>Convert with email automations</div>
    </div>
    <div className={classNames(item)}>
      <ImgWrapper
          className={imgBox1}
          imgClassName={featureImg}
          alt='featureImg'
          src='/img/feature1.png'
          sizes='100%'
          priority
      />
      <div className={classNames(text)}>Create faster with gererative AI</div>
    </div>
    <div className={classNames(item)}>
      <ImgWrapper
          className={imgBox2}
          imgClassName={featureImg}
          alt='featureImg'
          src='/img/feature2.png'
          sizes='100%'
          priority
      />
      <div className={classNames(text)}>Optimize with analytics & reporting</div>
    </div>
  </div>
}

export default Feature1;