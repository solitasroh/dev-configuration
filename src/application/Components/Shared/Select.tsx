import React, { FC, useState } from 'react';
import Select from 'react-select';
import styled from 'styled-components';

import { KeyInputEvent } from '@src/application/Components/Shared/Input/Input';

interface Props extends StyledSelectProps {
  label?: string;
  value?: SelectValueType;
  refValue?: SelectValueType;
  disabled?: boolean;
  onChange?: (value: SelectChangeEvent) => void;
  onKeyPress?: (event: KeyInputEvent) => void;
  options?: { label: string; value: any }[];
}

interface StyledSelectProps {
  disabled?: boolean;
  isChanged?: boolean;
  width?: string;
}

export type SelectValueType = string | number | ReadonlyArray<string>;
export type SelectChangeEvent = {
  label: string;
  value: string;
};

const labelColor = '#7e7e7e';
// const fontColor = '#ffffff';
// const changedFontColor = '#000000';
const borderFocused = '#BFD2FF';
const FieldActiveBack = '#393F54CC';
const FieldChangedBack = 'rgb(236,226,61)';
const FieldInactiveBack = 'rgba(57,63,84,0.59)';
// const inputTextInActive = '#7881a1';

const backgroundColor = (props: StyledSelectProps): string => {
  if (props.disabled) return FieldInactiveBack;
  if (props.isChanged) return FieldChangedBack;

  return FieldActiveBack;
};

// const foregroundColor = (props: StyledSelectProps): string => {
//   if (props.isChanged) return changedFontColor;
//
//   return fontColor;
// };

const Box = styled.div`
  display: flex;
  margin-bottom: 3px;
  padding: 1px;
  justify-content: flex-start;
  align-items: center;
`;

const Label = styled.div`
  display: inline-block;
  white-space: nowrap;
  margin-right: 0.5em;
  font-size: 9pt;
  font-family: Roboto, serif;
  font-weight: 500;
  color: ${labelColor};
  text-wrap: none;
`;

const Contents = styled(Select)<StyledSelectProps>`
  .react-select__control {
    width: ${(props) => props.width};
    border: 1px solid #ffffff;
    cursor: pointer;
    border-radius: 2px;
    background-color: ${(props) => backgroundColor(props)};
    font-size: 10px;
    padding: 0.3em 0.5em 0.3em 2em;
    min-height: 10px;
    color: white;
    margin: 0 0.5em;
  }
  .react-select__control--is-focused {
    border: 1px solid ${borderFocused};
  }
  .react-select__indicators {
    border: none;
  }
  .react-select__single-value {
    color: white;
    font-size: 10pt;
    margin: 1px 2px;
  }
  .react-select__indicator-separator {
    display: none;
  }
  .react-select__value-container {
    padding: 0;
    color: white;
  }
  .react-select__dropdown-indicator {
    padding: 0;
  }
`;

const UserSelect: FC<Props> = ({
  label,
  width,
  options,
  disabled,
  value,
  refValue,
  onChange,
  isChanged,
  onKeyPress,
}: Props) => {
  const [, setSelectedValue] = useState<SelectValueType>(value);
  // const [refInput, setRefValue] = useState<SelectValueType>(refValue);
  const [isValueChange, setIsValueChange] = useState<boolean>(false);
  const valueChanged = (e: { label: string; value: string }) => {
    console.log(e);
    const newValue = e.value;

    if (newValue !== refValue) {
      setIsValueChange(true);
    } else {
      setIsValueChange(false);
    }

    setSelectedValue(newValue);
    if (onChange !== null) {
      onChange(e);
    }
  };
  return (
    <Box>
      <Label>{label}</Label>

      <Contents
        isSearchable={false}
        value={value}
        options={options}
        width={width}
        disabled={disabled}
        isChanged={isValueChange}
        onChange={valueChanged}
        className="react-select-container"
        classNamePrefix="react-select"
      />
    </Box>
  );
};

UserSelect.defaultProps = {
  label: '',
  value: '',
  refValue: '',
  onChange: null,
  onKeyPress: null,
  width: '80px',
  disabled: false,
  isChanged: false,
  options: [],
};

export default UserSelect;
