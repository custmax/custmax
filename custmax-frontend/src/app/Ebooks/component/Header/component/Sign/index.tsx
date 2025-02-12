import styles from './index.module.scss';
import classNames from 'classnames';
import Link from 'next/link'

const {
  signContainer,
  division,
    login,
    start,
} = styles;

const Sign = () => {
  return <div className={classNames(signContainer)}>
    <span className={classNames(login)}>
      <Link href='/login'>Log in</Link>
    </span>
    <span className={classNames(division)} />
    <span className={classNames(start)}>
      <Link href='/signup'>Get started for free</Link>
    </span>
  </div>
};

export default Sign;