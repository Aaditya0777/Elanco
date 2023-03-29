import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import {ElancoTable} from './table/Table'

const Application = () => {
    const [loading, setLoading] = useState(false);
    const [tableloading, setTableLoading] = useState(false);
    const [applicationData, setapplicationData] = useState([]);
    const [applicationTableData, setapplicationTableData] = useState([]);
    const [selectedapplication, setSelectedapplication] = useState('');
    useEffect(() => {
        async function getapplications() {
          try {
            setLoading(true);
            const response = await fetch('https://engineering-task.elancoapps.com/api/applications');
            const data = await response.json();
            if (data) {
                const options = []
                let i = 0;
                for (const iterator of data) {
                    options.push({value: (i++).toString(), label: iterator})
                }
              setapplicationData(options);
            }
            setLoading(false);
    
          } catch (error) {
            setLoading(false);
          }
        }
        getapplications();
      }, []);

    useEffect(() => {
        if(selectedapplication){
            async function getapplicationsByName(){
                setTableLoading(true);
                const response = await fetch(`https://engineering-task.elancoapps.com/api/applications/${selectedapplication}`);
                const data = await response.json();
                if(data){
                  setapplicationTableData(data);
                }
                setTableLoading(false)
            }

            getapplicationsByName();
        }
    }, [selectedapplication])

    const handleChange = (value, option) => {
        setSelectedapplication(option?.label);
    }

    return (
        <>
        <Select
            showSearch
            style={{ width: 300 }}
            placeholder="Search to Select application"
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').includes(input?.toLowerCase())}
            filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            loading={loading}
            onChange={(value, option) => handleChange(value, option)}
            options={applicationData}
        />
        {selectedapplication !== '' &&
          <ElancoTable tableData={applicationTableData} tableloading={tableloading}/>
        }
        </>
    )
};

export default Application;