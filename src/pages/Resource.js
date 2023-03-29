import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import {ElancoTable} from './table/Table'

const Resource = () => {
    const [loading, setLoading] = useState(false);
    const [tableloading, setTableLoading] = useState(false);
    const [resourceData, setresourceData] = useState([]);
    const [resourceTableData, setresourceTableData] = useState([]);
    const [selectedResource, setSelectedResource] = useState('')
    useEffect(() => {
        async function getResources() {
          try {
            setLoading(true);
            const response = await fetch('https://engineering-task.elancoapps.com/api/resources');
            const data = await response.json();
            if (data) {
                const options = []
                let i = 0;
                for (const iterator of data) {
                    options.push({value: (i++).toString(), label: iterator})
                }
              setresourceData(options);
            }
            setLoading(false);
    
          } catch (error) {
            setLoading(false);
          }
        }
        getResources();
      }, []);

    useEffect(() => {
        if(selectedResource){
            async function getResourcesByName(){
                setTableLoading(true);
                const response = await fetch(`https://engineering-task.elancoapps.com/api/resources/${selectedResource}`);
                const data = await response.json();
                if(data){
                    setresourceTableData(data);
                }
                setTableLoading(false)
            }

            getResourcesByName();
        }
    }, [selectedResource])

    const handleChange = (value, option) => {
        setSelectedResource(option?.label);
    }

    return (
        <>
        <Select
            showSearch
            style={{ width: 300 }}
            placeholder="Search to Select Resource"
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').includes(input?.toLowerCase())}
            filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            loading={loading}
            onChange={(value, option) => handleChange(value, option)}
            options={resourceData}
        />
        {selectedResource !== '' &&
          <ElancoTable tableData={resourceTableData} tableloading={tableloading} />
        }
        </>
    )
};

export default Resource;