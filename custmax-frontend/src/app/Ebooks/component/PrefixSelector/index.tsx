import React, { useState } from 'react';
import { Form, Select, Input, Space } from 'antd';
import { countryOptions } from '@/constant/phone';
import './global.css';
const PrefixSelector = () => {
    const selectOptions = countryOptions;
    const [searchValue, setSearchValue] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(selectOptions);

    const handleSearch = (value:any) => {
        setSearchValue(value);
        const filtered = selectOptions.filter((option) =>
            option.value.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredOptions(filtered);
    };

    return (
        <Form.Item name="prefix" noStyle>
            <Select
                style={{ width: 120, backgroundColor: 'transparent',borderRadius: '40px' }}
                dropdownStyle={{ minWidth: 300, minHeight: 250, borderRadius: '20px' }}
                dropdownRender={(menu) => (
                    <div>
                        <Input
                            style={{ margin: '8px', width: 'calc(100% - 16px)' }}
                            placeholder="Search"
                            value={searchValue}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        {menu}
                    </div>
                )}
                filterOption={false}
                placeholder="US +1"
                options={filteredOptions}
                optionRender={(option) => (
                    <Space>
                        {option.data.customLabel}
                    </Space>
                )}
            >
            </Select>
        </Form.Item>
    );
};

export default PrefixSelector;
