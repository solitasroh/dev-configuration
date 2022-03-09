import React, { useState, useEffect } from 'react';
import * as ReactSelect from 'react-select';
import styled from 'styled-components';
import { InputValueType } from '@src/application/Components/Shared/Shared';

export type SelectOptionType = {
  label: string;
  value: InputValueType;
};

interface Props {
  label?: string;
  disabled?: boolean;
  options?: SelectOptionType[];
  width?: string;
  onChange?: (e: InputValueType) => void;
  onBlur?: () => void;
  value?: InputValueType;
  defaultValue?: InputValueType;
}

interface StyledSelectProps {
  disabled?: boolean;
  isChanged?: boolean;
  width?: string;
}

const labelColor = '#7e7e7e';
const borderFocused = '#BFD2FF';
const FieldActiveBack = '#393F54CC';
const FieldChangedBack = 'rgb(236,226,61)';
const FieldInactiveBack = 'rgba(57,63,84,0.59)';

const backgroundColor = (props: StyledSelectProps): string => {
  if (props.disabled) return FieldInactiveBack;
  if (props.isChanged) return FieldChangedBack;

  return FieldActiveBack;
};

const Container = styled.div`
  display: flex;
  margin-bottom: 3px;
  padding: 1px;
  justify-content: flex-start;
  align-items: center;
`;

const SelectLabel = styled.div`
  display: inline-block;
  white-space: nowrap;
  margin-right: 0.5em;
  font-size: 9pt;
  font-family: Roboto, serif;
  font-weight: 500;
  color: ${labelColor};
  text-wrap: none;
`;

const SelectControl = styled(ReactSelect.default)<StyledSelectProps>`
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

const SelectEx = ({
  label,
  onChange,
  onBlur,
  options,
  width,
  disabled,
  value,
  defaultValue,
}: Props) => {
  const [isValueChange, setValueChanged] = useState<boolean>(false);

  useEffect(() => {
    setValueChanged(false);
  }, [defaultValue]);

  const valueChanged = (e: SelectOptionType) => {
    if (defaultValue !== e.value) {
      setValueChanged(true);
    } else {
      setValueChanged(false);
    }

    if (onChange !== null) {
      onChange(e.value);
    }
  };
  return (
    <Container>
      <SelectLabel>{label}</SelectLabel>

      <SelectControl
        onBlur={onBlur}
        defaultValue={options.find((c) => c.value === defaultValue)}
        isSearchable={false}
        value={options.find((c) => c.value === value)}
        options={options}
        width={width}
        disabled={disabled}
        isChanged={isValueChange}
        onChange={valueChanged}
        className="react-select-container"
        classNamePrefix="react-select"
      />
    </Container>
  );
};

SelectEx.defaultProps = {
  label: '',
  onChange: null,
  onBlur: null,
  width: '80px',
  disabled: false,
  value: '',
  defaultValue: '',
  options: [],
};

export default SelectEx;
