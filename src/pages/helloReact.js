import React, { Component } from 'react';
import { Button, Toast } from '@douyinfe/semi-ui';
import Layout from '@theme/Layout';
import { Col, Row } from '@douyinfe/semi-ui';

export default function Hello() {
  return (
    <Layout title="Hello" description="Hello React Page">
      {/* <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          fontSize: '20px',
        }}> */}
       
       <div className="grid">
      
       
        <Row>
            <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}><div className="col-content">Col</div></Col>
            <Col xs={{ span: 11, offset: 1 }} lg={{ span: 6, offset: 2 }}><div className="col-content">Col</div></Col>
            <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}><div className="col-content">Col</div></Col>
        </Row>
    </div>
        
      {/* </div> */}
    </Layout>
  );
}




class Demo extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <Button onClick={() => Toast.warning({ content: 'welcome' })}>Hello Semi</Button>;
    }
}


() => (
    <div className="grid">
        <Row type="flex">
            <Col span={6} order={4}><div className="col-content">col-4</div></Col>
            <Col span={6} order={3}><div className="col-content">col-3</div></Col>
            <Col span={6} order={2}><div className="col-content">col-2</div></Col>
            <Col span={6} order={1}><div className="col-content">col-1</div></Col>
        </Row>
    </div>
);