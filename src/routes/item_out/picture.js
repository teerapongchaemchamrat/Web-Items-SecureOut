import React, { useState, useEffect } from 'react';
import { Table, Button, Space, DatePicker, Image } from 'antd';
import { Document, Page, Text, View, StyleSheet, pdf, Image as PDFImage, Font } from '@react-pdf/renderer';
import axios from 'axios';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import QRCode from "qrcode";

Font.register(
  {
    family: 'THSarabunNew',
    src: '/image/THSarabunNew-Bold.ttf' 
  },
);

export default function Picture () {

    const [loading, setloading] = useState(false);
    const [input_date, setInput_date] = useState('');
    const [originalData, setOriginalData] = useState('');
    const [data, setData] = useState([]);
    const [generatePDF, setGeneratePDF] = useState(false);

    useEffect(() => {
      if (generatePDF && data.length > 0) {
          generatePDFDocument();
          setGeneratePDF(false); // Reset back to false after generating PDF
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [generatePDF, data]);

    const getDataImage = async () => {
        try{
            setloading(true);
            const getuser = await axios.get(`http://49.0.65.4:3002/secure/doc/${input_date}`);
            const Data = getuser.data.map(item => ({
              ...item,
              doc_num: item.doc_num || '',
              cyf_dpt: item.cyf_dpt || '',
              name_out: item.name_out || '',
              company: item.company || '',
              datetime_out: item.datetime_out || '',
              job_qty: item.job_qty || '',
              container_qty: item.container_qty || '',
              container_um: item.container_um || '',
              tool_qty: item.tool_qty || '',
              computer_qty: item.computer_qty || '',
              measuringtools_qty: item.measuringtools_qty || '',
              etc: item.etc || '',
              purpose: item.purpose || '',
              car_type: item.car_type || '',
              car_reg: item.car_reg || '',
              cyf_approve: item.cyf_approve || '',
              image1: item.image1 ? item.image1.split('\\public\\')[1].replace(/\\/g, '/') : 'image/not-found.jpg',
              image2: item.image2 ? item.image2.split('\\public\\')[1].replace(/\\/g, '/') : 'image/not-found.jpg',
              image3: item.image3 ? item.image3.split('\\public\\')[1].replace(/\\/g, '/') : 'image/not-found.jpg',
              image4: item.image4 ? item.image4.split('\\public\\')[1].replace(/\\/g, '/') : 'image/not-found.jpg',
              image5: item.image5 ? item.image5.split('\\public\\')[1].replace(/\\/g, '/') : 'image/not-found.jpg'
            }));
            setOriginalData(Data);
            setloading(false);
        }catch(error){
            console.error("Error getData:", error);
            setloading(false);
        }finally{
            setloading(false);
        }
      };

    const columns = [
        {
            title: 'Document',
            dataIndex: 'doc_num', // เพิ่มถ้ายังไม่ถ่ายรูปจะไม่ขึ้นยังไม่สำเร็จ
            key: 'doc_num',
        },
        {
            title: 'PDF',
            key: 'action',
            render: (text, record) => 
              <div>
                <Button type="primary"  
                        // icon={<EditOutlined />} 
                        onClick={() => callreport(record)}
                        style={{ backgroundColor: 'green', borderColor: 'green', marginRight: 8 }}
                        >
                  Preview
                </Button>
              </div>
              
          },
        {
            title: 'Image 1',
            // dataIndex: 'image1',
            key: 'image1',
            render: (text, record) => 
                <div>
                  <Image src={record.image1} style={{width: '50px', height: '50px'}} />
                </div>
        },
        {
            title: 'Image 2',
            //dataIndex: 'image2',
            key: 'image2',
            render: (text, record) => 
                <div>
                  <Image src={record.image2} style={{width: '50px', height: '50px'}} />
                </div>
        },
        {
            title: 'Image 3',
            //dataIndex: 'image3',
            key: 'image3',
            render: (text, record) => 
                <div>
                  <Image src={record.image3} style={{width: '50px', height: '50px'}} />
                </div>
        },
        {
            title: 'Image 4',
            //dataIndex: 'image4',
            key: 'image4',
            render: (text, record) => 
                <div>
                  <Image src={record.image4} style={{width: '50px', height: '50px'}} />
                </div>
        },
        {
            title: 'Image 5',
            //dataIndex: 'image5',
            key: 'image5',
            render: (text, record) => 
                <div>
                  <Image src={record.image5} style={{width: '50px', height: '50px'}} />
                </div>
        },
    ];

    const onChange = (date, dateString) => {
        setInput_date(dateString);
        console.log(date, dateString);
    };

    const callreport = async (record) => {
      try {
          
          const response = await axios.get(`http://49.0.65.4:3002/secure/doc/id/${record.doc_num}`);
          const fetchedData = response.data;
          setData(fetchedData);
          setGeneratePDF(true);
          
      } catch (error) {
          console.log('Error getting data:', error);
      }
    };

    const generateQRCodeDataURL = async (value) => {
      try {
        return await QRCode.toDataURL(value);
      } catch (error) {
        console.error('Error generating QR code:', error);
        return null;
      }
    };

    const generatePDFDocument = async () => {
   
      const content = (
          <Document>
            {await Promise.all(
              data.map(async (item, index) => {
  
                // const dateObj = new Date(item.datetime_out);
                // const date = dateObj.toISOString().split('T')[0]; // Extract date
                // const time = dateObj.toTimeString().split(' ')[0]; // Extract time
                const datetime = item.datetime_out;
                const [date, time] = datetime.split('T');
                const formattedTime = time.split('.')[0];
                const qrCodeDataURL = await generateQRCodeDataURL(item.doc_num);
                const draw1 = item.draw1 ? item.draw1.split('\\public\\')[1].replace(/\\/g, '/') : 'not found';
                const draw2 = item.draw2 ? item.draw2.split('\\public\\')[1].replace(/\\/g, '/') : 'not found';
                const draw3 = item.draw3 ? item.draw3.split('\\public\\')[1].replace(/\\/g, '/') : 'not found';
  
                return(
                  <Page key={index} size="A5" orientation="landscape" style={styles.page}>
                      <View style={styles.section}>
                          <div style={{position: 'absolute',fontSize: '12px', marginTop: '-0.1%', marginLeft: '89%'}}>
                            <Text>{item.doc_num}</Text>
                          </div>
                          <div style={{position: 'absolute',fontSize: '10px', marginTop: '3.6%', marginLeft: '95%', width: '500px'}}>
                            <Text >{item.cyf_dpt}</Text>
                          </div>
                          <div style={{position: 'absolute', marginTop: '11.6%', marginLeft: '23%'}}>
                            <Text style={styles.text}>{item.name_out}</Text>
                          </div>
                          <div style={{position: 'absolute', marginTop: '16.4%', marginLeft: '23%'}}>
                            <Text style={styles.text}>{item.company}</Text>
                          </div>
                          <div style={{position: 'absolute', marginTop: '10.3%', marginLeft: '88%'}}>
                            <Text style={styles.text}>{date}</Text>
                          </div>
                          <div style={{position: 'absolute', marginTop: '13.5%', marginLeft: '88%'}}>
                            <Text style={styles.text}>{formattedTime}</Text>
                          </div>
                          <div style={{position: 'absolute', marginTop: '23%', marginLeft: '10%'}}>
                            <Text style={styles.text}>{item.job_qty}</Text>
                          </div>
                          <div style={{position: 'absolute', marginTop: '26%', marginLeft: '21.5%'}}>
                            <Text style={styles.text}>{item.container_qty}</Text>
                          </div>
                          {(item.container_um === "กล่อง" && 
                            <div style={{position: 'absolute', top: '38%', left: '27%', width: '15px', height: '15px'}}>
                                <PDFImage src="/image/check.png"/>
                            </div>
                          )}
                          {(item.container_um === "RACK" && 
                            <div style={{position: 'absolute', top: '38%', left: '33.5%', width: '15px', height: '15px'}}>
                              <PDFImage src="/image/check.png"/>
                            </div>
                          )}
                          {(item.container_um === "ตะกร้า/ถัง" && 
                            <div style={{position: 'absolute', top: '38%', left: '41%', width: '15px', height: '15px'}}>
                              <PDFImage src="/image/check.png"/>
                            </div>
                          )}
                          <div style={{position: 'absolute', marginTop: '28.7%', marginLeft: '21.5%'}}>
                            <Text style={styles.text}>{item.tool_qty}</Text>
                          </div>
                          <div style={{position: 'absolute', marginTop: '31.5%', marginLeft: '16%'}}>
                            <Text style={styles.text}>{item.computer_qty}</Text>
                          </div>
                          <div style={{position: 'absolute', marginTop: '34.7%', marginLeft: '16%'}}>
                            <Text style={styles.text}>{item.measuringtools_qty}</Text>
                          </div>
                          <div style={{position: 'absolute', marginTop: '25.5%', marginLeft: '61%'}}>
                            <Text style={styles.text_etc}>{item.etc}</Text>
                          </div>
                          <div style={{position: 'absolute', marginTop: '39.3%', marginLeft: '23%'}}>
                            <Text style={styles.text}>{item.purpose}</Text>
                          </div>
                          {(item.car_type === "รถบรรทุก4ล้อ" && 
                            <div style={{position: 'absolute', top: '65%', left: '20%', width: '15px', height: '15px'}}>
                                <PDFImage src="/image/check.png"/>
                            </div>
                          )}
                          {(item.car_type === "รถบรรทุก6ล้อ" && 
                            <div style={{position: 'absolute', top: '65%', left: '34%', width: '15px', height: '15px'}}>
                                <PDFImage src="/image/check.png"/>
                            </div>
                          )}
                          {(item.car_type === "รถบรรทุกอื่นๆ" && 
                            <div style={{position: 'absolute', top: '65%', left: '47.7%', width: '15px', height: '15px'}}>
                                <PDFImage src="/image/check.png"/>
                            </div>
                          )}
                          {(item.car_type === "รถส่วนบุคคล" && 
                            <div style={{position: 'absolute', top: '65%', left: '61.3%', width: '15px', height: '15px'}}>
                                <PDFImage src="/image/check.png"/>
                            </div>
                          )}
                          {(item.car_type === "ตัวบุคคล" && 
                            <div style={{position: 'absolute', top: '65%', left: '74%', width: '15px', height: '15px'}}>
                                <PDFImage src="/image/check.png"/>
                            </div>
                          )}
                          <div style={{position: 'absolute', marginTop: '46.4%', marginLeft: '89%'}}>
                            <Text style={styles.text}>{item.car_reg}</Text>
                          </div>
                          <div style={{position: 'absolute', marginTop: '53.5%', marginLeft: '89%'}}>
                            <Text style={styles.text}>{item.cyf_approve}</Text>
                          </div>
                          <div style={{position: 'absolute', marginTop: '53.2%', marginLeft: '6.5%'}}>
                            <PDFImage 
                                src={draw1}
                                style={{width: '40px', height: '25px'}}
                            />
                          </div>
                          <div style={{position: 'absolute', marginTop: '53.2%', marginLeft: '35%'}}>
                            <PDFImage 
                                src={draw2}
                                style={{width: '40px', height: '25px'}}
                            />
                          </div>
                          <div style={{position: 'absolute', marginTop: '53.2%', marginLeft: '68.8%'}}>
                            <PDFImage 
                                src={draw3}
                                style={{width: '40px', height: '25px'}}
                            />
                          </div>
  
                          {qrCodeDataURL && (
                            <PDFImage
                              src={qrCodeDataURL}
                              style={{ position: 'absolute', border: 'none', top: '84.65%', left: '90%', width: '68px', height: '68px' }}
                            />
                          )}
                          
                      </View>
                      <PDFImage src="/image/Form2.jpg" style={styles.backgroundImage} />
                  </Page>
               );
              })
            )}
          </Document>
      );
  
      // Example of how to download PDF
      const blob = await pdf(content).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
  
    };

    return(

        <div>

            <div style={{display: 'flex', marginBottom: '1%'}}>
                <div style={{marginTop: '0.3%', marginRight: '1%'}}>
                    <label>วันที่ :</label>
                </div>
                <Space direction="vertical">
                    <DatePicker onChange={onChange}/>
                </Space>
                <div style={{marginLeft: '1%'}}>
                    <Button type="primary" onClick={getDataImage}>Search</Button>
                </div>
            </div>

            <Table columns={columns} dataSource={originalData} rowKey="id"/>

            <Backdrop 
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    )
}

const styles = StyleSheet.create({
  page: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    //transform: 'rotate(360deg)'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  text: {
    fontFamily: 'THSarabunNew',
    fontSize: 18,
    textAlign: 'center'
  },
  text_etc: {
    fontFamily: 'THSarabunNew',
    fontSize: 14,
    width: 250
  },
});