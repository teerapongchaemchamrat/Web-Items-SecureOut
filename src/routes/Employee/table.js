import React, { useState } from 'react';
import { Table, Button, Space, DatePicker } from 'antd';
import axios from 'axios';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function TableEmp () {

    const [loading, setloading] = useState(false);
    const [input_date, setInput_date] = useState('');
    const [originalData, setOriginalData] = useState('');
    //const [data, setData] = useState([]);

    const getDataEmp = async () => {
        if (!input_date) {
            alert("โปรดกรอกวันที่");
            setOriginalData([]);
            return;
        }
        try{
            setloading(true);
            const getuser = await axios.get(`http://192.168.10.27:5000/scan/total/${input_date}`);
            const Data = getuser.data.map(item => ({
              ...item,
              No: item.No || '',
              SSN: item.SSN || '',
              Name: item.Name || '',
              Surname: item.Surname || '',
              Child_code: item.Child_code || '',
              Stamp_1: item.Stamp_1 || '',
              Stamp_2: item.Stamp_2 || '',
              Location: item.Location || '',
              Time_scan: item.Time_scan || '',
              
            }));
            setOriginalData(Data);
            setloading(false);
            if (Data.length === 0) {
                alert("ไม่พบข้อมูล");
                setOriginalData([]); // Ensure originalData is an empty array
              } else {
                console.log('DataUser: ', JSON.stringify(Data, null, 2));
              }
            //console.log('DataUser: ', JSON.stringify(originalData, null, 2));
        }catch(error){
            console.error("Error getData:", error);
            setloading(false);
        }finally{
            setloading(false);
        }
      };

    const columns = [
        {
            title: 'No',
            dataIndex: 'No', 
            key: 'NO',
        },
        {
            title: 'SSN',
            dataIndex: 'SSN',
            key: 'SSN',
        },
        {
            title: 'Name',
            dataIndex: 'Name',
            key: 'Name',
        },
        {
            title: 'Surname',
            dataIndex: 'Surname',
            key: 'Surname',
        },
        {
            title: 'Department',
            dataIndex: 'Child_code',
            key: 'Child_code',
        },
        {
            title: 'Stamp_1',
            dataIndex: 'Stamp_1',
            key: 'Stamp_1',
        },
        {
            title: 'Stamp_2',
            dataIndex: 'Stamp_2',
            key: 'Stamp_2',
        },
        {
            title: 'Location',
            dataIndex: 'Location',
            key: 'Location',
        },
        {
            title: 'Time_scan',
            dataIndex: 'Time_scan',
            key: 'Time_scan',
        },
    ]

    const onChange = (date, dateString) => {
        setInput_date(dateString);
        console.log(date, dateString);
    };

    const exportToExcel = () => {
        if (originalData.length === 0){
            alert('ไม่มีข้อมูลในตาราง');
            return;
        }
        const ws = XLSX.utils.json_to_sheet(originalData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
        // Generate buffer
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    
        // Save file
        saveAs(data, `Employee-${input_date}.xlsx`);
      };
      
    return (
        <div>
            <div style={{display: 'flex', marginBottom: '1%'}}>
                <div style={{marginTop: '0.3%', marginRight: '1%'}}>
                    <label>วันที่ :</label>
                </div>
                <Space direction="vertical">
                    <DatePicker onChange={onChange}/>
                </Space>
                <div style={{marginLeft: '1%'}}>
                    <Button type="primary" onClick={getDataEmp}>Search</Button>
                </div>

                <div style={{marginLeft: '1%'}}>
                    <Button type="primary" onClick={exportToExcel}>Export Excel</Button>
                </div>
                
            </div>
            
            <Table columns={columns} dataSource={originalData} rowKey="id"  pagination={{pageSize: 2000}} scroll={{y: 580}}/>

            <Backdrop 
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    )
}