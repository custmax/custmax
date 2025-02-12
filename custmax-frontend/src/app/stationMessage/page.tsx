import EnteredHeader from '@/component/EnteredHeader';
import styles from './page.module.scss';
import SideBar from '@/component/SideBar';
import { Table, TableProps } from 'antd';

type DataType = {
  key: string;
  time: string;
  message: string;
  type: string;
}

const {
  stationMessageContainer,
  main,
  title,
  content,
} = styles;


const data: DataType[] = [
  {
    key: '1',
    time: '03/07/2024',
    message: '',
    type: '',
  },
  {
    key: '2',
    time: '03/07/2024',
    message: '',
    type: '',
  },
  {
    key: '3',
    time: '03/07/2024',
    message: '',
    type: '',
  },
  {
    key: '4',
    time: '03/07/2024',
    message: '',
    type: '',
  },
  {
    key: '5',
    time: '03/07/2024',
    message: '',
    type: '',
  },
  {
    key: '6',
    time: '03/07/2024',
    message: '',
    type: '',
  },
  {
    key: '7',
    time: '03/07/2024',
    message: '',
    type: '',
  },
  {
    key: '8',
    time: '03/07/2024',
    message: '',
    type: '',
  },
  {
    key: '9',
    time: '03/07/2024',
    message: '',
    type: '',
  },
];

const StationMessage = () => {
  const columns: TableProps<DataType>['columns'] = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
  ];

  return <div className={stationMessageContainer}>
    <EnteredHeader />
    <SideBar />
    <div className={main}>
      <div className={title}>
        <span>Free plan</span>
        <span>|</span>
        <span style={{ fontWeight: '600' }}>Upgrade</span>
      </div>
      <div className={content}>
        <Table columns={columns} dataSource={data} pagination={{ pageSize: 8 }} />
      </div>
    </div>
  </div>
};

export default StationMessage;
