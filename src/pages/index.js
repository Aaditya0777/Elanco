import { Layout, Menu, theme } from 'antd';
import React, { useState, useEffect } from 'react';
import { FileOutlined, PieChartOutlined, DesktopOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import Resource from './Resource';
import { ElancoTable } from './table/Table'
import Application from './Application';

const { Header, Sider, Content } = Layout;

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [cloudCostData, setCloudCostData] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenukey, setSelectedMenuKey] = useState('1');
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    async function getCloudCostData() {
      try {
        setLoading(true);
        const response = await fetch('https://engineering-task.elancoapps.com/api/raw');
        const data = await response.json();
        if (data) {
          setCloudCostData(data);
        }
        setLoading(false);

      } catch (error) {
        setLoading(false);
      }
    }
    getCloudCostData();
  }, [])

  const handlemenuSelect = (item) => {
    setSelectedMenuKey(item?.key);
  }

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '32px',
          margin: '16px',
          background: 'rgba(255, 255, 255, 0.3)'
        }}>
          <p style={{
            fontSize: '22px',
            fontWeight: 'bold',
            color: 'white'
          }}>ELANCO</p>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[selectedMenukey]}
          onSelect={handlemenuSelect}
          items={[
            {
              key: '1',
              icon: <PieChartOutlined />,
              label: 'Cloud Costing',
            },
            {
              key: '2',
              icon: <DesktopOutlined />,
              label: 'Applications',
            },
            {
              key: '3',
              icon: <FileOutlined />,
              label: 'Resources',
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            height: 45,
            paddingInline: 0,
            background: colorBgContainer,
          }}
        >
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            style: { padding: 16, paddingInline: 16, display: 'flex' },
            onClick: () => setCollapsed(!collapsed),
          })}
        </Header>
        <Content
          style={{
            padding: 10,
            minHeight: 280,
            background: 'lightskyblue',
          }}
        >
          {selectedMenukey === '1' &&
              <ElancoTable tableData={cloudCostData} tableloading={loading} />
          }
          {
            selectedMenukey === '2' && <Application />
          }
          {
            selectedMenukey === '3' && <Resource />
          }
        </Content>
      </Layout>
    </Layout>
  )
}
