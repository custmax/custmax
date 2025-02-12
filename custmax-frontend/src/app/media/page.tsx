'use client';
import EnteredHeader from '@/component/EnteredHeader';
import styles from './page.module.scss';
import SideBar from '@/component/SideBar';
import { GetProp, Input, Pagination, PaginationProps, Select, Table, TableProps, Upload, UploadProps, message } from 'antd';
import ImgWrapper from '@/component/ImgWrapper';
import {useEffect, useRef, useState} from 'react';
import { TableRowSelection } from 'antd/es/table/interface';
import { getMediaList, removeMedia, uploadMedia } from '@/server/media';
import { SUCCESS_CODE } from '@/constant/common';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];  

type DataType = {
  fileName: string,
  createTime: string,
  firstName: string,
  lastName: string,
  id: number,
}

const {
  mediasContainer,
  main,
  title,
  titleLeft,
  exitBtn,
  content,
  uploadWrapper,
  uploadText,
  or,
  selectWrapper,
  selectFile,
  uploadTip,
  filterWrapper,
  filterLeft,
  selector,
  filterRight,
  searchInputBox,
  searchInput,
  searchIconBox,
  searchIcon,
  listIcon,
  listBlockIcon,
  filterBtn,
  paginationWrapper,
  paginationLeft,
  applyBtn,
  paginationRight,
  mediaWrapper,
  mediaItem,
  mediaCover,
  mediaTitle,
  listTable,
  fileWrapper,
  fileDesc,
  nameBox,
  strongName,
} = styles;

const pageSize = 16;

const Medias = () => {
  const [listType, setListType] = useState<string>('list')
  const [showUpload, setShowUpload] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [mediaList, setMediaList] = useState<Media.BasicMedia[]>([])
  const [searchVal, setSearchVal] = useState('');
  const [showUploadList, setShowUploadList] = useState<boolean>(true);
  const [total, setTotal] = useState(0)
  const [mediaType, setMediaType] = useState('all')
  const [action, setAction] = useState('')
  const fileRef = useRef<Blob>()

  useEffect(() => {
    initList();
  }, [])

  const initList = async () => {
    message.loading({ content: 'loading', duration: 10, key: 'listLoading' })
    const res = await getMediaList(currentPage, pageSize)
    message.destroy('listLoading')
    if (res.code === SUCCESS_CODE) {
      setMediaList(res.data?.records.map((item: { id: number }) => ({ ...item, key: item.id })) || [])
      setTotal(res.data?.total)
    }
  }

  const onSearch = async () => {
    if (searchVal) {
      message.loading({ content: 'loading', duration: 10, key: 'listLoading' })
      const res = await getMediaList(1, pageSize, searchVal)
      message.destroy('listLoading')
      if (res.code === SUCCESS_CODE) {
        setMediaList(res.data?.records.map((item: { id: number }) => ({ ...item, key: item.id })) || [])
        setCurrentPage(1)
      }
    }
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'File',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (item, record) => {
        return <div className={fileWrapper}>
          {/* <ImgWrapper src='' alt='' className={fileDesc} /> */}
          <div className={nameBox}>
            <div className={strongName}>{item}</div>
            <div>{item}</div>
          </div>
        </div>
      },
      sorter: true,
    },
    {
      title: 'Author',
      dataIndex: 'firstName',
      key: 'firstName',
      sorter: true,
      render: (_item, record) => <div>{record.firstName} {record.lastName}</div>
    },
    {
      title: 'Date',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: true,
    },
  ];

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  const onTypeChange = (value: string) => {
    setMediaType(value)
  };

  const onFilter = async () => {
    message.loading({ content: 'loading', duration: 10, key: 'listLoading' })
    const res = await getMediaList(1, pageSize, searchVal, mediaType === 'all' ? '' : mediaType)
    message.destroy('listLoading')
    if (res.code === SUCCESS_CODE) {
      setMediaList(res.data?.records.map((item: { id: number }) => ({ ...item, key: item.id })) || [])
      setCurrentPage(1)
    }
  }

  const onDateChange = () => {};

  const onActionChange = (value: string) => {
    setAction(value)
  };

  const onApply = async () => {
    if (action !== 'bulk' && selectedRowKeys.length) {
      const res = await removeMedia(selectedRowKeys.map(item => Number(item)))
      if (res.code === SUCCESS_CODE) {
        message.success(res.message)
        initList();
      } else {
        message.error(res.message)
      }
    }
  }

  const beforeUpload = (file: Blob) => {
    setShowUploadList(true)
    fileRef.current = file
    return true;
  };

  const handleChange: UploadProps['onChange'] = async (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      const formData = new FormData();
      if (fileRef.current) formData.append('file', fileRef.current as Blob)
      // formData.append('file', info.file.originFileObj as Blob)
      const res = await uploadMedia(formData)
      if (res.code === SUCCESS_CODE) {
        setShowUploadList(false)
        message.success(res.message)
        initList()
      } else {
        message.error(res.message)
      }
    }
  };

  const onPageChange: PaginationProps['onChange'] = async (pageNumber) => {
    setCurrentPage(pageNumber)
    message.loading({ content: 'loading', duration: 10, key: 'listLoading' })
    const res = await getMediaList(pageNumber, pageSize)
    message.destroy('listLoading')
    if (res.code === SUCCESS_CODE) {
      setMediaList(res.data?.records.map((item: { id: number }) => ({ ...item, key: item.id })) || [])
      setTotal(res.data?.total)
    }
  };

  return <div className={mediasContainer}>
    <EnteredHeader />
    <SideBar />
    <div className={main}>
      <div className={title}>
        <div className={titleLeft}>Media Library</div>
        {
          showUpload
            ? <div className={exitBtn} onClick={() => setShowUpload(false)}>Cancel</div>
            : <div className={exitBtn} onClick={() => setShowUpload(true)}>Upload</div>
        }
      </div>
      <div className={content}>
        {showUpload && <div className={uploadWrapper}>
          <div className={uploadText}>Drop files to upload</div>
          <div className={or}>Or</div>
          <Upload
            name="select"
            showUploadList={showUploadList}
            className={selectWrapper}
            maxCount={1}
            action=""
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            <div className={selectFile}>Select Files</div>
          </Upload>
          <div className={uploadTip}>Maximum upload file size: 50 MB.</div>
        </div>}
        <div className={filterWrapper}>
          <div className={filterLeft}>
            <div onClick={() => setListType('list')}>
              <ImgWrapper
                className={listIcon}
                src={`/img/list_${listType === 'list' ? 'active' : 'default'}.png`}
                alt='list icon'
              />
            </div>
            <div onClick={() => setListType('block')}>
              <ImgWrapper
                className={listBlockIcon}
                src={`/img/list_block_${listType === 'list' ? 'default' : 'active'}.png`}
                alt='list block icon'
              />
            </div>
            <Select
              className={selector}
              defaultValue="all"
              style={{ width: 120 }}
              onChange={onTypeChange}
              options={[
                { value: 'all', label: 'All' },
                { value: 'png', label: 'Png' },
                { value: 'jpg', label: 'Jpg' },
                { value: 'mp4', label: 'Mp4' },
                { value: 'mp3', label: 'Mp3' },
              ]}
            />
            <Select
              className={selector}
              defaultValue="all"
              style={{ width: 120 }}
              onChange={onDateChange}
              options={[
                { value: 'all', label: 'All Dates' },
              ]}
            />
            <div className={filterBtn} onClick={onFilter}>Filter</div>
          </div>
          <div className={filterRight}>
            <div className={searchInputBox}>
              <Input className={searchInput} value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder='Search' />
              <div className={searchIconBox} onClick={onSearch}>
                <ImgWrapper className={searchIcon} src='/img/search_icon.png' alt='search icon'  />
              </div>
            </div>
          </div>
        </div>
        <div className={paginationWrapper}>
          <div className={paginationLeft}>
            <Select
              className={selector}
              defaultValue="bulk"
              style={{ width: 120 }}
              onChange={onActionChange}
              options={[
                { value: 'bulk', label: 'Bulk actions' },
                { value: 'delete', label: 'Delete' }
              ]}
            />
            <div className={applyBtn} onClick={onApply}>Apply</div>
          </div>
          <div className={paginationRight}>
            <Pagination
              total={total}
              showSizeChanger={false}
              showQuickJumper
              defaultPageSize={pageSize}
              showTotal={(total) => `${total} items`}
              onChange={onPageChange}
            />
          </div>
        </div>
        <div className={mediaWrapper}>
          {
            listType === 'list'
              ?  <Table<DataType>
                className={listTable}
                columns={columns}
                dataSource={mediaList}
                pagination={false}
                rowSelection={rowSelection}
              />
              : mediaList.map((item, index) => <div key={index} className={mediaItem}>
              <div className={mediaCover}></div>
              <div className={mediaTitle}>{item.fileName}</div>
            </div>)
          }
        </div>
      </div>
    </div>
  </div>
};

export default Medias;
