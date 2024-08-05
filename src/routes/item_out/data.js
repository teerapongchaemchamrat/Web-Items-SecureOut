import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Input, ConfigProvider, DatePicker, Space, Select, Radio, message } from 'antd';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import './style.css';

const { TextArea } = Input;

export default function AddData () {

    const [doc_num, setDoc_num] = useState('');
    const [cyf_dpt, setCyf_dpt] = useState('');
    const [name_out, setName_out] = useState('');
    const [company, setCompany] = useState('');
    const [datetime_out, setDatetime_out] = useState('');
    const [job_qty, setJob_qty] = useState('');
    const [container_qty, setContainer_qty] = useState('');
    const [container_um, setContainer_um] = useState('');
    const [tool_qty, setTool_qty] = useState('');
    const [computer_qty, setComputer_qty] = useState('');
    const [measuringtools_qty, setMeasuringtools_qty] = useState('');
    const [etc, setEtc] = useState('');
    const [purpose, setPurpose]= useState('');
    const [car_type, setCar_type] = useState('');
    const [car_reg, setCar_reg] = useState('');
    const [cyf_approve, setCyf_approve] = useState('');

    const [loading, setloading] = useState(false);
    
    const getDocPreview = async() => {
        try{
            const response  = await axios.get('http://XX.XX.XX.X:XX/secure/doc/preview');
            if (response.data && response.data.length > 0) {
                setDoc_num(response.data[0].PreviewDocNum);
            } else {
                console.error("No preview data found");
            }
        } catch(error) {

          console.error(error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
          await getDocPreview();
        };
        fetchData();
        
    }, []);

    const onChangeDatepicker = (_, dateStr) => {
        setDatetime_out(dateStr);
        console.log('onChange:', dateStr);
    };

    const handleChangeCyf_dpt = (value) => {
        setCyf_dpt(value);
    };

    const savedata = async() => {

        const inputData = {
            doc_num: doc_num || null ,
            cyf_dpt: cyf_dpt || null,
            name_out: name_out || null,
            company: company || null,
            datetime_out: datetime_out || null,
            job_qty: job_qty || null,
            container_qty: container_qty || null,
            container_um: container_um || null,
            tool_qty: tool_qty || null,
            computer_qty: computer_qty || null,
            measuringtools_qty: measuringtools_qty || null,
            etc: etc || null,
            purpose: purpose || null,
            car_type: car_type || null,
            car_reg: car_reg || null,
            cyf_approve: cyf_approve || null
        };

        console.log('inputData: ', JSON.stringify(inputData, null, 2));
        
        try{
            if(!doc_num || !cyf_dpt || !name_out || !company || !datetime_out || !purpose || !car_type || !car_reg || !cyf_approve ){
                return message.error('กรุณากรอกข้อมูลให้ครบถ้วน');
            }else {
                    setloading(true);
                    await axios.post('http://XX.XX.XX.X:XX/secure/doc/add', inputData);
                    
                    await getDocPreview();
                    //await setCyf_dpt('');
                    await setName_out('');
                    await setCompany('');
                    //await setDatetime_out('');
                    await setJob_qty('');
                    await setContainer_qty('');
                    await setContainer_um('');
                    await setTool_qty('');
                    await setComputer_qty('');
                    await setMeasuringtools_qty('');
                    await setEtc('');
                    await setPurpose('');
                    await setCar_type('');
                    await setCar_reg('');
                    await setCyf_approve('');

                    message.success('บันทึกข้อมูลสำเร็จ');
                    //window.location.reload();
                    setloading(false);
            }
        }catch(error){
            setloading(false);
            console.log('Error add data : ', error);
            message.error('Error Add Data');
        }
    };

    return (
        <div>
            <div className='document'>
                <h2>Document : {doc_num}</h2>  
            </div>

            <div className='cyf_dpt'>
                <Select
                    showSearch
                    placeholder="Select"
                    onChange={handleChangeCyf_dpt}
                    // filterOption={(input, option) =>
                    // (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    // }
                    options={[
                    {
                        value: 'PUR',
                        label: 'PUR',
                    },
                    {
                        value: 'Delivery',
                        label: 'Delivery',
                    },
                    {
                        value: 'etc',
                        label: 'etc',
                    },
                    ]}
                />

            </div>

            <div className='name_out'>  
                <Input value={name_out} onChange={(e) => setName_out(e.target.value)}></Input>
            </div> 

            <div className='date_time'>
                <ConfigProvider >
                    <Space direction="vertical">
                        <DatePicker showTime onChange={onChangeDatepicker} />
                    </Space>
                </ConfigProvider>
            </div>

            <div className='company'>  
                <Input value={company} onChange={(e) => setCompany(e.target.value)}></Input>
            </div>

            <div className='job'>
                <label className='text_input'>1) ชิ้นงาน</label>
                <Input type="number" value={job_qty} onChange={(e) => setJob_qty(e.target.value)}
                        className='input' />
                <label>ชิ้น</label>
            </div>

            <div className='container'>
                <label className='text_input'>2) ภาชนะบรรจุชิ้นงาน จำนวน</label>
                <Input type="number" value={container_qty} onChange={(e) => setContainer_qty(e.target.value)}
                        className='input' />
                <Radio.Group 
                    onChange={(e)=> setContainer_um(e.target.value)} 
                    value={container_um}>
                    <Radio value="กล่อง">กล่อง</Radio>
                    <Radio value="RACK">RACK</Radio>
                    <Radio value="ตะกร้า/ถัง">ตะกร้า/ถัง</Radio>  
                </Radio.Group>
            </div>

            <div className='jig'>
                <label className='text_input'>3) อุปกรณ์ JIG/GAUGE จำนวน</label>
                <Input type="number" value={tool_qty} onChange={(e) => setTool_qty(e.target.value)}
                        className='input' />
                <label>ชิ้น</label>
            </div>

            <div className='computer'>
                <label className='text_input'>4) คอมพิวเตอร์</label>
                <Input type="number" value={computer_qty} onChange={(e) => setComputer_qty(e.target.value)} 
                        className='input' />
                <label>เครื่อง</label>
            </div>

            <div className='mea'>
                <label className='text_input'>5) เครื่องมือวัด</label>
                <Input type="number" value={measuringtools_qty} onChange={(e) => setMeasuringtools_qty(e.target.value)}
                        className='input' />
                <label>เครื่อง</label>
            </div>

            <div className='etc'>
                <TextArea rows={4} value={etc} onChange={(e) => setEtc(e.target.value)}
                            placeholder="......." 
                            />
            </div>

            <div className='purpose'>
                <Input value={purpose} onChange={(e) => setPurpose(e.target.value)} className='input_purpose'></Input>
            </div>

            <div className='car_type'>
                <Radio.Group 
                    onChange={(e)=> setCar_type(e.target.value)} 
                    value={car_type}>
                        <Radio value="รถบรรทุก4ล้อ">รถบรรทุก 4 ล้อ</Radio>
                        <Radio value="รถบรรทุก6ล้อ">รถบรรทุก 6 ล้อ</Radio>
                        <Radio value="รถบรรทุกอื่นๆ">รถบรรทุกอื่นๆ</Radio> 
                        <Radio value="รถส่วนบุคคล">รถส่วนบุคคล</Radio>
                        <Radio value="ตัวบุคคล">ตัวบุคคล</Radio> 
                   
                </Radio.Group>
            </div>

            <div className='car_reg'>
                <Input value={car_reg} onChange={(e) => setCar_reg(e.target.value)}></Input>
            </div>

            <div className='approve'>
                <Input value={cyf_approve} onChange={(e) => setCyf_approve(e.target.value)}></Input>
            </div>
            
            <div className='bg'>
                <img alt="bg" src="/image/Doc2.jpg" /> 
            </div>

            <div className='btn'>
                <Button type="primary" onClick={savedata}>Save</Button> 
            </div>

            <Backdrop 
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            
        </div>
    )
}
