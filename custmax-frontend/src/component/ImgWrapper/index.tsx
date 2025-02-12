import styles from './index.module.scss';
import classNames from 'classnames';
import Image from 'next/image';
import { FC, MouseEventHandler } from 'react';

type Props = {
  className?: string,
  imgClassName?: string,
  src: string,
  alt: string,
  priority?: boolean,
  sizes?: string,
}

const {
  imgWrapper,
  defaultImgClassName,
} = styles;

const ImgWrapper: FC<Props> = (props: Props) => {
  const {
    className = '',
    imgClassName = '',
    src = '',
    alt = '',
    priority = true,
    sizes = '100%',
  } = props;


  return <div className={classNames(className, imgWrapper)}>
    <Image
      fill
      className={classNames(imgClassName, defaultImgClassName)}
      alt={alt}
      src={src}
      sizes={sizes}
      priority={priority}
    />
  </div>
};

export default ImgWrapper;