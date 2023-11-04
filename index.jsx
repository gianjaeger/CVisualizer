import { Button, Col, DatePicker, Divider, Form, Input, Popconfirm, Radio, Row, Table, Typography } from 'antd';
import Dayjs from 'dayjs';
import React, { useState } from 'react';
import ChartComp from '../chart';
import { DeleteOutlined } from '@ant-design/icons';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Title, Text } = Typography;

export default function FormComp() {
    const [startdate, setStartdate] = useState("");
    const [enddate, setEnddate] = useState("");
    const [series, setSeries] = useState([]);

    const [options] = useState({
        chart: {
            height: 600,
            type: 'rangeBar',
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350
                }
            }
        },
        plotOptions: {
            bar: {
                horizontal: true
            }
        },
        colors: [
            "#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0",
            "#3F51B5", "#546E7A", "#D4526E", "#8D5B4C", "#F86624",
            "#D7263D", "#1B998B", "#2E294E", "#F46036", "#E2C044"
        ],
        dataLabels: {
            enabled: false,
            // formatter: function (val, opts) {
            //     console.log('val', opts)
            //     return opts.w.globals.seriesNames[opts.seriesIndex]
            // }
        },
        xaxis: {
            type: 'datetime'
        },
        legend: {
            position: 'top',
            horizontalAlign: 'center',
            onItemHover: {
                highlightDataSeries: true
            }
        },
        title: {
            text: 'Overview',
            align: 'center'
        },
        tooltip: {
            theme: 'dark',
            custom: function ({ seriesIndex, dataPointIndex, w }) {
                var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
                return `
                <div style="padding: 10px; max-width: 350px;">
                    <p><b>Activity Type</b>: ${data.x}</p>
                    <p><b>Activity Name</b>: ${data.name}</p>
                    <p><b>Start and End Date</b>: ${Dayjs(data.y[0]).format('MMM, DD, YYYY') + ' - ' + Dayjs(data.y[1]).format('MMM, DD, YYYY')}</p>
                    <p><b>Activity Description</b>: ${data.desc}</p>
                </div>
                `;
            }
        }
    });

    const columns = [
        {
            title: 'Activity Name',
            dataIndex: 'data',
            key: 'data',
            render: (data) => <a>{data[0].name}</a>,
        },
        {
            title: 'Activity Type',
            dataIndex: 'data',
            key: 'data',
            render: (data) => <a>{data[0].x}</a>,
        },
        {
            title: 'Start and End Date',
            dataIndex: 'data',
            key: 'data',
            render: (data) => <a>{Dayjs(data[0].y[0]).format('MMM, DD, YYYY') + ' - ' + Dayjs(data[0].y[1]).format('MMM, DD, YYYY')}</a>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (data, record, i) => (<Popconfirm title="Sure to delete?" onConfirm={() => onDelete(data, record, i)}>
                <DeleteOutlined style={{ color: 'red' }} />
            </Popconfirm>),
        },
    ];

    const onDelete = (data, record, i) => {
        let s = [...series]
        s.splice(i, 1)
        setSeries(s);
    }

    const onRangeChange = (dates, dateStrings) => {
        if (dates) {
            console.log('From: ', dates[0], ', to: ', dates[1]);
            console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
            setStartdate(dateStrings[0]);
            setEnddate(dateStrings[1]);
        } else {
            console.log('Clear');
        }
    };

    const onFinish = (values) => {
        console.log('Success:', values);
        setSeries((prev) => [...prev, {
            name: values.name,
            data: [{
                x: values.type,
                y: [
                    new Date(startdate).getTime(),
                    new Date(enddate).getTime()
                ],
                name: values.name,
                desc: values.describe
            }]
        }])
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (<>
        <Row justify={'center'}>
            <Col span={20}>
                <Title level={2} style={{ textAlign: 'center', marginTop: '2rem' }}>CVisualizer</Title>
                <Text type="secondary">CVisualizer aims to innovate CV formatting by allowing users to submit key information in text format and converting it into an interactive timeline. Two potential use cases for it. Either it could be used by individuals who aim to create more interactive CVs or by HR departments who wish to display their applicant&apos;s information in more visual and chronological formats. Currently running an early stage pilot.</Text>
                <Form
                    name="form"
                    layout={'vertical'}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    style={{ marginTop: '2rem' }}
                >
                    <Form.Item
                        label="Activity Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input activity name!',
                            },
                        ]}
                    >
                        <Input placeholder='Enter activity name' />
                    </Form.Item>
                    <Form.Item
                        label="Activity Description"
                        name="describe"
                        rules={[
                            {
                                required: true,
                                message: 'Please input activity description!',
                            },
                        ]}
                    >
                        <TextArea rows={4} placeholder='Enter activity description' />
                    </Form.Item>
                    <Row gutter={[16, 16]}>
                        <Col md={12} span={24}>
                            <Form.Item
                                label="Start and End Date"
                                name="date_range"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select start and end date!',
                                    },
                                ]}
                            >
                                <RangePicker style={{ width: '100%' }} onChange={onRangeChange} />
                            </Form.Item>
                        </Col>
                        <Col md={12} span={24}>
                            <Form.Item
                                label="Activity Type"
                                name="type"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select activity type!',
                                    },
                                ]}
                            >
                                <Radio.Group>
                                    <Radio value={'Education'}>Education</Radio>
                                    <Radio value={'Work experience'}>Work experience</Radio>
                                    <Radio value={'Extracurricular'}>Extracurricular</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
                <Divider />
            </Col>
            {series.length > 0 &&
                <Col span={20}>
                    <ChartComp series={series} options={options} />
                    <Table columns={columns} dataSource={series || []} style={{ marginTop: '5rem' }} />;
                </Col>
            }
        </Row>
    </>
    )
}
