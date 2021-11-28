import React, { FC } from 'react';
import { Row, Col } from 'antd';
import styled from 'styled-components';

const Label = styled(Col)`
  text-align: left;
  font-size: 8pt;
`;

const Value = styled(Col)`
  text-align: center;
  align-items: center;
  font-weight: 600;
  font-size: 9pt;
  background-color: #f5f5f5;
`;

type DescProps = {
  title: string;
  value: string;
};

const Desc: FC<DescProps> = ({ title, value }) => (
  <Row gutter={16} style={{ marginBottom: 2 }}>
    <Label span={12}>{title}</Label>
    <Value span={12}>{value}</Value>
  </Row>
);

export default Desc;
