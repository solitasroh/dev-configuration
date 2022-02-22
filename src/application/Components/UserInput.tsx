import { Input } from 'antd';
import React from 'react';

interface UserInputProps {
  label?: string ;

  value?: number;

  onChange?: (value: number) => void;
}


export default function UserInput({ label, value, onChange }: UserInputProps): React.ReactElement {
    const textChangeHandle = (v: string ) => {
        if (onChange !== null) {
            onChange(parseInt(v, 10));
        }
        
    }
  return (
    <div>
      <div>{label}</div>
      <div>
        <Input value={value} onChange={ e => textChangeHandle(e.target.value)} style={{ width: 150 }}/>
      </div>
    </div>
  );
}

UserInput.defaultProps  = {
    label: "label",
    value: 0,
    onChange: null
}