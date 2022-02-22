import React from 'react';
import styled from 'styled-components';

const Label = styled.p`
  width: 110px;
  text-align: left;
  font-size: 8pt;
`;
interface UserSelectElement {
  value: string;
  key: string;
  name: string;
}
interface UserSelectProps {
  elements: UserSelectElement[];
}

export default function UserSelect({
  elements,
}: UserSelectProps): React.ReactElement {
  return (
    <>
      {elements.map((x: UserSelectElement) => (
        <>
          <Label>x.name</Label>
          <select>
            <option value={x.value}>{x.key}</option>
          </select>
        </>
      ))}
    </>
  );
}
