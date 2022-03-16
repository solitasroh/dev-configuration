import React, { useState, useEffect } from 'react';
import * as ReactSelect from 'react-select';
import styled from 'styled-components';
import { InputValueType } from '@src/application/Components/Shared/Shared';
import { valueType } from 'antd/lib/statistic/utils';
import { FieldError, FieldValues } from 'react-hook-form';
import { Popover } from 'evergreen-ui';
import ValueRange from './ValueRange';
import { InfoCircleFilled } from '@ant-design/icons';

interface Props {
  label?: string;
  disabled?: boolean;
  width?: string;
  onChange?: (e: InputValueType) => void;
  onBlur?: () => void;
  value?: InputValueType;
  defaultValue?: InputValueType;
  error?: FieldError;
  invalid?:boolean;
  min?:number;
  max?: number;
}

interface StyledInputProps {
  disabled?: boolean;
  isChanged?: boolean;
  width?: string;
}

const labelColor = '#7e7e7e';
const borderFocused = '#BFD2FF';
const FieldActiveBack = '#393F54CC';
const FieldChangedBack = 'rgb(236,226,61)';
const FieldInactiveBack = 'rgba(57,63,84,0.59)';
const inputTextInActive = '#7881a1';
const fontColor = '#ffffff';

const backgroundColor = (props: StyledInputProps): string => {
  if (props.disabled) return FieldInactiveBack;
  if (props.isChanged) return FieldChangedBack;

  return FieldActiveBack;
};
const foregroundColor = (props: StyledInputProps): string => {
  if (props.isChanged) return fontColor;

  return fontColor;
};
const Container = styled.div`
  display: flex;
  margin-bottom: 3px;
  padding: 1px;
  justify-content: flex-start;
  align-items: center;
`;

const InputLabel = styled.div`
  display: inline-block;
  white-space: nowrap;
  margin-right: 0.5em;
  font-size: 9pt;
  font-family: Roboto, serif;
  font-weight: 500;
  color: ${labelColor};
  text-wrap: none;
`;
const ControlWrapper = styled.div<StyledInputProps>`
  display: flex;
  border-radius: 2px;
  font-size: 10px;
  padding: 0.3em 0.5em 0.3em 2em;
  margin: 0 0.5em;
  flex-direction: row;
  align-items: center;
  width: ${(props) => props.width};
  background-color: ${(props) => backgroundColor(props)};

  border: 1px solid #ffffff;

  &:focus-within {
    outline: none;
    border: 1px solid ${borderFocused};
  }
`;
const InputControl = styled.input<StyledInputProps>`
  border: transparent 0;
  background: transparent;
  outline: none;
  color: ${(props) => foregroundColor(props)};
  font-size: 10pt;
  width: 80%;

  &::-webkit-input-placeholder {
    color: ${inputTextInActive};
  }

  &:disabled ${ControlWrapper} {
    background-color: ${FieldInactiveBack};
  }
`;
const InputInformationIcon = styled(InfoCircleFilled)`
  color: white;
`;

const InputInformationWrapper = styled.div`
  &:hover ${InputInformationIcon} {
    color: #b29090;
  }
`;
const InputEx = ({
  label,
  onChange,
  onBlur,
  width,
  disabled,
  value,
  error,
  invalid,
  defaultValue,
  min,
  max
}: Props): React.ReactElement => {
  const [isValueChange, setValueChanged] = useState<boolean>(false);

  useEffect(() => {
    setValueChanged(false);
  }, [defaultValue]);

  const valueChanged = (e: any) => {
    if (defaultValue !== e.value) {
      setValueChanged(true);
    } else {
      setValueChanged(false);
    }

    if (onChange !== null) {
      onChange(e);
    }
  };
  return (
    <Container>
      <InputLabel>{label}</InputLabel>
      <ControlWrapper
        disabled={disabled}
        isChanged={isValueChange}
        width={width}
      >
        <InputControl
          onBlur={onBlur}
          value={value}
          width={width}
          disabled={disabled}
          isChanged={isValueChange}
          onChange={valueChanged}
        />
        <Popover
          minWidth={10}
          content={() => (
            <ValueRange max={max} min={min} error={error?.message} />
          )}
          trigger="click"
          
        >
          <InputInformationWrapper>
            <InputInformationIcon />
          </InputInformationWrapper>
        </Popover>
      </ControlWrapper>
    </Container>
  );
};

InputEx.defaultProps = {
  label: '',
  onChange: null,
  onBlur: null,
  width: '80px',
  disabled: false,
  value: '',
  defaultValue: 0,
  error: null,
  invalid:false,
  min: 0,
  max: 0
};

export default InputEx;
