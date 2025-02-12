import EnteredHeader from '@/component/EnteredHeader';
import styles from './page.module.scss';
import SideBar from '@/component/SideBar';
import classNames from 'classnames';

const {
  importAutoContainer,
  main,
  title,
  titleLeft,
  exitBtn,
  content,
  contentTitle,
  resourceWrapper,
  resourceItem,
  active,
  doneBox,
  doneBtn,
} = styles;

const ImportAuto = () => {

  return <div className={importAutoContainer}>
    <EnteredHeader />
    <SideBar />
    <div className={main}>
      <div className={title}>
        <div className={titleLeft}>
          <span>Contacts</span>
          <span style={{ margin: '0 0.5em', color: '#666' }}>/</span>
          <span style={{ color: '#999999' }}>Add a contact</span>
        </div>
        <div className={exitBtn}>Exit</div>
      </div>
      <div className={content}>
        <div className={contentTitle}>How would you like to add contacts? </div>
        <div className={resourceWrapper}>
          <div className={classNames(resourceItem, active)}>Zapier</div>
          <div className={resourceItem}>Salesforce</div>
          <div className={resourceItem}>WooCommerce</div>
          <div className={resourceItem}>SquarespaceCommerce</div>
          <div className={resourceItem}>Shopify</div>
          <div className={doneBox}>
            <div className={doneBtn}>Done</div>
          </div>
        </div>
      </div>
    </div>
  </div>
};

export default ImportAuto;
