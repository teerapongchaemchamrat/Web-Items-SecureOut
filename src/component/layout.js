import React, { useState } from 'react';
import {
    HomeOutlined ,
    FileAddOutlined,
    DownloadOutlined
  } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import ItemOut from '../routes/item_out/data';
import Report from '../routes/item_out/report';
import Picture from '../routes/item_out/picture';
import TableEmp from '../routes/Employee/table';


const { Header, Content, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
};

const items = [
    getItem('ของออกนอกบริษัท', 'sub1', <HomeOutlined />,[
        getItem('เพิ่มข้อมูล', '1', <FileAddOutlined />),
        getItem('ดูรูปภาพ', '3', <DownloadOutlined />),
        getItem('ดึงรายงาน', '2', <DownloadOutlined />),
    ]),
    getItem('พนักงาน', 'sub2', <HomeOutlined />,[
        getItem('ข้อมูลแสกน', '4', <FileAddOutlined />),
        getItem('ผลลัพธ์', '5', <DownloadOutlined />),
    ])
];

export default function LayoutPage () {

    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState('1');
    const { token: { colorBgContainer, borderRadiusLG },} = theme.useToken();

    const renderContent = () => {
        switch (selectedKey) {
        case '1':
            return <ItemOut />;
        case '2':
            return <Report />;
        case '3':
            return <Picture />;
        case '4':
            return <TableEmp />;
        default:
            return <div>ยังไม่ได้ทำจ้าาาาา</div>;
        }
    };
    return(
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}
              style={{
                padding: 0,
                background: colorBgContainer,
              }}>
              <div className="demo-logo-vertical" />
              <Menu  defaultSelectedKeys={['1']} 
                    mode="inline" items={items} 
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                      }} 
                    onSelect={({ key }) => setSelectedKey(key)}
                    />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: '0 16px',
                        background: colorBgContainer,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                <div style={{ flex: 1 }}></div>
                <div style={{ flex: 2, textAlign: 'center', fontSize: '30px' }}>
                    <img src="image/logo_cyf.jpg" alt="logo" style={{width : '30px', height: '30px', marginRight: '2%'}}/>
                    CHAIYOOT
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    {/* <span style={{ marginRight: '20px' }}>Admin:&nbsp;&nbsp;getUsername </span>
                    <Button type="primary" danger >Logout</Button> */}
                </div>
                </Header>
                <Content
                    style={{
                        margin: '20px 16px',
                        padding: 24,
                        minHeight: 700,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}>
                {renderContent()}
                </Content>
                
          </Layout>
        </Layout>
    );
}