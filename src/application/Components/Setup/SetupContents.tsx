import React from 'react';
import { SetupCategoryItem } from '@src/application/Components/Setup/SetupCategoryItem';
import { Card, Col, Row } from 'antd';
import styled from 'styled-components';
import { SetupDef } from './SetupDef';

interface Props {
  definition: SetupDef;
}

const Parameter = styled(Col)`
  padding: 10px;
  background-color: #ffffff;
  font-weight: 600;
`;

const SettingValueContainer = styled(Col)`
  display: flex;
  align-items: center;
`;

const SettingValue = styled.div`
  width: 100%;
  padding: 3px;
  padding-left: 6px;
  background-color: rgba(248, 248, 248, 0.4);

  border-radius: 4px;
`;

export function SetupContent(prop: Props): JSX.Element {
  const { definition } = prop;

  const getValueFromType = (): string | number => {
    if (definition.dataType === 'Enum') {
      return definition.setupEnum.find(
        (value, index) => index === definition.defaultValue,
      );
    }

    return definition.defaultValue;
  };

  return (
    <Row wrap={false}>
      <Parameter flex="220px">{definition.setupParameter}</Parameter>
      <SettingValueContainer flex="Auto">
        <SettingValue>{getValueFromType()}</SettingValue>
      </SettingValueContainer>
    </Row>
  );
}
interface SetupCategoryProps {
  category: SetupCategoryItem;
}

export function SetupCategory(prop: SetupCategoryProps): JSX.Element {
  const { category } = prop;
  return (
    <Card title={category.category} size="small">
      {category.items.map((setupDef) => (
        <SetupContent definition={setupDef} />
      ))}
    </Card>
  );
}

interface MainSetupProps {
  categories: SetupCategoryItem[];
}

export function MainSetup(prop: MainSetupProps): JSX.Element {
  const { categories } = prop;
  return (
    <div>
      {categories.map((category) => (
        <SetupCategory category={category} />
      ))}
    </div>
  );
}
