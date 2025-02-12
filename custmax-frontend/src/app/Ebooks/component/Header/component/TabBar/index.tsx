'use client'
import styles from './index.module.scss';
import classNames from 'classnames';
import Link from 'next/link'
import { usePathname } from 'next/navigation';

const {
  tabBarContainer,
  tabItem,
  active,
} = styles;

const TabBar = () => {
  const pathname = usePathname()

  return <div className={classNames(tabBarContainer)}>
    
      <span className={classNames(tabItem, {[active]: pathname === '/'})}>
        <Link href="/">
          Home
        </Link>
      </span>
      <span className={classNames(tabItem, {[active]: pathname === '/pricing'})}>
        <Link href="/pricing?reload=true">
          Pricing
        </Link>
      </span>
      <span className={classNames(tabItem, {[active]: pathname === '/bookDemo'})}>
        <Link href="/bookDemo?reload=true">
          Book a Demo
        </Link>
      </span>
      {/*<span className={classNames(tabItem, {[active]: pathname === '/resource'})}>*/}
      {/*  <Link href="/resource?reload=true">*/}
      {/*    Resource*/}
      {/*  </Link>*/}
      {/*</span>*/}
  </div>
};

export default TabBar;
