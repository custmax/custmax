'use client'
import { Form, Input, Modal, Select, Space } from 'antd';
import styles from './index.module.scss';
import { FC, useCallback, useEffect } from 'react';
import { countryOptions } from '@/constant/phone';
import PrefixSelector from "@/component/PrefixSelector";
import {countryOptionss} from "@/constant/country";




type Props = {
  visible: boolean,
  onOk: (values: Info.AccountInfo) => void,
  onCancel: () => void,
  values: Info.AccountInfo | null
}
const CountryOptions = countryOptionss;
const {
  accountModal,
  main,
  basicFormWrapper,
  paymentForm1,
  nameBox,
  paymentFormExtra1,
  countryBox,
} = styles;

const AccountModal: FC<Props> = (props) => {
  const { visible, onOk, onCancel, values } = props;
  const[accountForm] = Form.useForm()
  const[accountExtraForm] = Form.useForm()

  const initForm = useCallback((values: Info.AccountInfo | null) => {
    if (values) {
      const {
        addressLine1,
        addressLine2,
        city,
        company,
        country,
        email: accountEmail,
        firstName: accountFirstName,
        lastName: accountLastName,
        phone,
        state: accountState,
        taxId: accountTaxId,
        zipCode: accountZipCode,
      } = values;
      console.log(values)
      accountForm.setFieldsValue({
        accountAddressLine1: addressLine1,
        accountAddressLine2: addressLine2,
        accountCity: city,
        accountCompany: company,
        accountEmail,
        accountTaxId,
        accountFirstName,
        accountLastName,
        accountPhone: phone===undefined ? '' : phone.split('-').length > 1 ? phone.split('-')[1] : '',
        prefix: phone===undefined ? '':phone.split('-').length > 1 ? '+' + phone.split('-')[0] : 'US +1',
      })

      accountExtraForm.setFieldsValue({ 
        accountCountry: country,
        accountState,
        accountZipCode,
      })
    } else {
      accountForm.setFieldsValue({ prefix: 'US +1' })
    }
  }, [values])

  useEffect(() => {
    if (visible) {
      initForm(values)  
    }
  }, [values, visible])

  const _onOk = () => {
    const {
      accountAddressLine1,
      accountAddressLine2,
      accountCity,
      accountCompany,
      accountEmail,
      accountTaxId,
      accountFirstName,
      accountLastName,
      accountPhone,
      prefix,
    } = accountForm.getFieldsValue();
    console.log(prefix)
    const { 
      accountCountry,
      accountState,
      accountZipCode,
    } = accountExtraForm.getFieldsValue();
    const values = {
      addressLine1: accountAddressLine1,
      addressLine2: accountAddressLine2,
      city: accountCity,
      company: accountCompany,
      country: accountCountry,
      email: accountEmail,
      firstName: accountFirstName,
      lastName: accountLastName,
      phone: accountPhone==='' ? '' :prefix.substring(prefix.indexOf("+") + 1) + '-' + accountPhone,
      state: accountState,
      taxId: accountTaxId,
      zipCode: accountZipCode,
    }
    console.log('values', values)
    onOk(values)
  }

  return <Modal
    title="Contact Info"
    open={visible}
    onOk={_onOk}
    onCancel={onCancel}
    wrapClassName={accountModal}
    width={'80vw'}
  >
    <div className={main}>
      <div className={basicFormWrapper}>
        <Form
          form={accountForm}
          name="paymentForm1"
          className={paymentForm1}
          labelAlign='left'
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          colon={false}
        >
          <Space.Compact block size='large' className={nameBox}>
            <Form.Item
              label="First name"
              name='accountFirstName'
              labelCol={{ span: 9 }}
              wrapperCol={{ span: 15 }}
              rules={[{ required: true, message: 'Please input your first name!' }]}
            >
              <Input placeholder="Please input your first name" />
            </Form.Item>
            <Form.Item
              label="last name"
              name='accountLastName'
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
            >
              <Input placeholder="Please input your last name" />
            </Form.Item>
          </Space.Compact>
          <Form.Item label="Address">
            <Space.Compact block size='large' direction='vertical'>
              <Form.Item
                name='accountAddressLine1'
                rules={[{ required: true, message: 'first address is required' }]}
              >
                <Input placeholder="Enter the street address" />
              </Form.Item>
              <Form.Item
                name='accountAddressLine2'
                rules={[{ required: true, message: 'second address is required' }]}
              >
                <Input placeholder="Apt, unit, suite (optional)" />
              </Form.Item>
            </Space.Compact>
          </Form.Item>
          <Form.Item label="City" name='accountCity'>
            <Input placeholder="City" />
          </Form.Item>
          <Form.Item label="Company" name='accountCompany'>
            <Input placeholder="Company" />
          </Form.Item>
          <Form.Item label="Email" name='accountEmail'>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Tax ID" name='accountTaxId'>
            <Input placeholder="Tax ID" />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name='accountPhone'
            labelCol={{ span: '1px' }}
          >
            <Input style={{marginLeft: '5px' }} addonBefore={<PrefixSelector/>} />
          </Form.Item>
        </Form>
        <Form
          form={accountExtraForm}
          name='paymentFormExtra1'
          className={paymentFormExtra1}
          layout='vertical'
        >
          <Space.Compact block size='large' className={countryBox}>
            <Form.Item
              name="accountCountry"
              label="Country"
            >
              <Select
                placeholder="Select a country"
                options={CountryOptions}
              />
            </Form.Item>
            {/*<Form.Item*/}
            {/*  name="accountState"*/}
            {/*  label="State"*/}
            {/*  */}
            {/*>*/}
            {/*  <Select*/}
            {/*    placeholder="Please select a state"*/}
            {/*    options={[*/}
            {/*      { value: 'Hubei', label: 'Hubei' },*/}
            {/*    ]}*/}
            {/*  />*/}
            {/*</Form.Item>*/}
            <Form.Item
              label="Zip code"
              name='accountZipCode'
            >
              <Input placeholder="Please input your zip code" />
            </Form.Item>
          </Space.Compact>
        </Form>
      </div>
    </div>
  </Modal>
};

export default AccountModal;
