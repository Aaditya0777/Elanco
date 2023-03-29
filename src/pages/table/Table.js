import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";

export const ElancoTable = ({tableloading, tableData}) => {

    const [filterData, setFilterData] = useState({});
    const [resourcefilterData, setResourceFilterData] = useState({});
    const [totalCost, setTotalCost] = useState(0);

    useEffect(() => {
        findTotalCost(tableData);
        getFilterData(tableData);
    }, [tableData.length])

    const findTotalCost = (tableData) => {
        let cost = 0;
        for (const iterator of tableData) {
            cost = cost + Number(iterator.Cost)
        }
        setTotalCost(cost);
    }

    const getFilterData = (tableData) => {
        const data = {};
        const resourceData = {};
        for (const iterator of tableData) {
            if(!data[iterator?.ServiceName]){
                data[iterator?.ServiceName] = {
                text: iterator?.ServiceName,
                value :iterator?.ServiceName
                }
            }

            if(!resourceData[iterator?.ResourceGroup]){
                resourceData[iterator?.ResourceGroup] = {
                text: iterator?.ResourceGroup,
                value :iterator?.ResourceGroup
                }
            }
        }
        setFilterData(data);
        setResourceFilterData(resourceData);
    }
    
    const columns = [
        {
            title: 'Quantity',
            dataIndex: 'ConsumedQuantity',
            width: 100,
            sorter: {
            compare: (a, b) => a.ConsumedQuantity - b.ConsumedQuantity,
            multiple: 4,
            },
        },
        {
            title: 'Cost',
            dataIndex: 'Cost',
            width: 100,
            sorter: {
            compare: (a, b) => a.Cost - b.Cost,
            multiple: 3,
            },
        },
        {
            title: 'Date',
            dataIndex: 'Date',
            width: 100,
            sorter: {
                compare: (a,b) => {
                    const date1 = new Date(a.Date).getTime();
                    const date2 = new Date(b.Date).getTime();
                    return date1 - date2;
                },
            }

        },
        {
            title: 'Instance ID',
            dataIndex: 'InstanceId',
            ellipsis: true,
        },
        {
            title: 'Resource Group',
            dataIndex: 'ResourceGroup',
            filters: Object.values(resourcefilterData),
            filterSearch: true,
            onFilter: (value, record) => record.ResourceGroup.startsWith(value),
        },
        {
            title: 'Resource Location',
            dataIndex: 'ResourceLocation',
            width: 100
        },
        {
            title: 'Unit of Measure',
            dataIndex: 'UnitOfMeasure',
            sorter: {
            compare: (a, b) => a.UnitOfMeasure?.split(" ")[0] - b.UnitOfMeasure?.split(" ")[0],
            multiple: 1,
            },
        },
        {
            title: 'Location',
            dataIndex: 'Location',
        },
        {
            title: 'Service Name',
            dataIndex: 'ServiceName',
            filters: Object.values(filterData),
            filterSearch: true,
            onFilter: (value, record) => record.ServiceName.startsWith(value),
        },
    ];

    const handleChange = (pagination, filters, sorter, extra) => {
        console.log( extra);
        const { currentDataSource } = extra;
        findTotalCost(currentDataSource);

    }

    return (
        <Table 
            style={{
                fontSize: '12px',
                lineHeight: 1,
            }}
            columns={columns} 
            dataSource={tableData} 
            loading={tableloading}
            onChange={handleChange}
            size='small' 
            scroll={{x: 'max-xontent', y: '65vh'}}
            footer = {() => 
                <h4 style={{margin : 0}}>
                    <Tag color={'blue'}>
                        Total Cost: {totalCost.toFixed(2)}
                    </Tag>
                </h4>}
        />
    )
}
  