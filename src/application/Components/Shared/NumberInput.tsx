import React, { ChangeEvent, useEffect, useState } from 'react';

import styled from 'styled-components';
import { InfoCircleFilled } from '@ant-design/icons';
import { useController, UseControllerProps } from 'react-hook-form';
import { Alert, Popover } from 'antd';
import {
  InputChangeEvent,
  InputValueType,
} from '@src/application/Components/Shared/Shared';

// ---- prop definition
interface Props<T> extends UseControllerProps<T> {
  label?: string;
  disabled?: boolean;
  width?: string;
  minValue?: InputValueType;
  maxValue?: InputValueType;
}

interface StyledInputProps {
  width?: string;
  disabled?: boolean;
  isChanged?: boolean;
}

// ---- Brush resources
const labelColor = '#7e7e7e';
const fontColor = '#ffffff';
const changedFontColor = '#000000';
const borderFocused = '#BFD2FF';
const FieldActiveBack = '#393F54CC';
const FieldChangedBack = 'rgb(236,226,61)';
const FieldInactiveBack = 'rgba(57,63,84,0.59)';
const inputTextInActive = '#7881a1';

const backgroundColor = (props: StyledInputProps): string => {
  if (props.disabled) return FieldInactiveBack;
  if (props.isChanged) return FieldChangedBack;

  return FieldActiveBack;
};

const foregroundColor = (props: StyledInputProps): string => {
  if (props.isChanged) return changedFontColor;

  return fontColor;
};

// ---- styled
const InputContainer = styled.div`
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

type FieldValues = Record<string, InputValueType>;
// ---- pop over content
const Contents = ({
  min,
  max,
}: {
  min: InputValueType;
  max: InputValueType;
}) => (
  <Alert
    message="Value Range"
    description={`Min : ${min} Max: ${max}`}
    type="info"
    showIcon
  />
);
// ---- Main Component
const NumberInput = <T extends FieldValues>({
  label,
  name,
  disabled,
  width,
  control,
  rules,
  defaultValue,
  shouldUnregister,
  minValue,
  maxValue,
}: Props<T>): React.ReactElement => {
  const [isValueChange, setValueChanged] = useState<boolean>(false);

  useEffect(() => {
    setValueChanged(false);
  }, [defaultValue]);

  const {
    field: { onChange, onBlur, value, ref },
  } = useController({
    name,
    control,
    rules: { required: true },
    defaultValue,
    shouldUnregister,
  });

  const valueChanged = (e: InputChangeEvent) => {
    if (parseInt(e.target.value) < minValue) {
      e.preventDefault();
      return;
    }

    if (parseInt(e.target.value) > maxValue) {
      e.preventDefault();
      return;
    }

    if (defaultValue !== e.target.value) {
      setValueChanged(true);
    } else {
      setValueChanged(false);
    }

    if (onChange !== null) {
      onChange(e);
    }
  };

  const onBlurHandle = () => {
    if (value === 0) {
    }
    if (onBlur !== null) {
      onBlur();
    }
  };

  return (
    <InputContainer>
      <InputLabel>{label}</InputLabel>
      <ControlWrapper
        disabled={disabled}
        isChanged={isValueChange}
        width={width}
      >
        <InputControl
          onBlur={onBlurHandle}
          value={value}
          name={name}
          ref={ref}
          onChange={valueChanged}
          width={width}
          disabled={disabled}
          isChanged={isValueChange}
        />
        <Popover
          content={() => <Contents max={maxValue} min={minValue} />}
          trigger="click"
          style={{ padding: 0 }}
          overlayInnerStyle={{ padding: 0 }}
        >
          <InputInformationWrapper>
            <InputInformationIcon />
          </InputInformationWrapper>
        </Popover>
      </ControlWrapper>
    </InputContainer>
  );
};

// --- default value for props
NumberInput.defaultProps = {
  label: '',
  width: '80px',
  disabled: false,
  minValue: '',
  maxValue: '',
};

export default NumberInput;
