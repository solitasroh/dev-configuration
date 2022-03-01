import React, {
  ChangeEvent,
  FC,
  KeyboardEvent,
  useEffect,
  useState,
} from 'react';

import styled from 'styled-components';
import { InfoCircleFilled } from '@ant-design/icons';

export type InputValueType = string | number | ReadonlyArray<string>;
export type InputChangeEvent = ChangeEvent<HTMLInputElement>;
export type KeyInputEvent = KeyboardEvent<HTMLInputElement>;

interface Props extends StyledInputProps {
  label?: string;
  value?: InputValueType;
  refValue?: InputValueType;
  disabled?: boolean;
  onChange?: (event: InputChangeEvent) => void;
  onKeyPress?: (event: KeyInputEvent) => void;
}

interface StyledInputProps {
  width?: string;
  disabled?: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  isChanged?: boolean;
}

const labelColor = '#7e7e7e';
const fontColor = '#ffffff';
const changedFontColor = '#000000';
const borderFocused = '#BFD2FF';
const FieldActiveBack = '#393F54CC';
const FieldChangedBack = 'rgb(236,226,61)';
const FieldInactiveBack = 'rgba(57,63,84,0.59)';
const inputTextInActive = '#7881a1';

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

const backgroundColor = (props: StyledInputProps): string => {
  if (props.disabled) return FieldInactiveBack;
  if (props.isChanged) return FieldChangedBack;

  return FieldActiveBack;
};

const foregroundColor = (props: StyledInputProps): string => {
  if (props.isChanged) return changedFontColor;

  return fontColor;
};

const Wrapper = styled.div<StyledInputProps>`
  display: flex;
  border-radius: 2px;
  font-size: 10px;
  padding: 0.3em 0.5em 0.3em 2em;
  margin: 0 0.5em;
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => backgroundColor(props)};

  border: 1px solid #ffffff;

  &:focus-within {
    outline: none;
    border: 1px solid ${borderFocused};
  }
`;

const Contents = styled.input<StyledInputProps>`
  border: transparent 0;
  background: transparent;
  outline: none;
  color: ${(props) => foregroundColor(props)};
  font-size: 10pt;
  width: ${(props) => props.width};

  &::-webkit-input-placeholder {
    color: ${inputTextInActive};
  }

  &:disabled ${Wrapper} {
    background-color: ${FieldInactiveBack};
  }
`;

const ContentInfoIcon = styled(InfoCircleFilled)`
  color: white;
`;

const ContentInfo = styled.div`
  &:hover ${ContentInfoIcon} {
    color: #b29090;
  }
`;

const Input: FC<Props> = (props: Props) => {
  const { label, value, refValue, onChange, onKeyPress, disabled, width } =
    props;
  const [inputValue, setInputValue] = useState<InputValueType>(value);
  const [refInput, setRefValue] = useState<InputValueType>(refValue);
  const [isValueChange, setIsValueChange] = useState<boolean>(false);

  useEffect(() => {
    console.log('ref is changed');
    setIsValueChange(false);
  }, [refInput]);

  const valueChanged = (event: InputChangeEvent) => {
    const newValue = event.target.value;

    if (newValue !== refValue) {
      setIsValueChange(true);
    } else {
      setIsValueChange(false);
    }

    setInputValue(newValue);

    if (onChange !== null) {
      onChange(event);
    }
  };

  const keyEntered = (event: KeyInputEvent) => {
    if (event.key === 'Enter') {
      if (onKeyPress !== null) {
        onKeyPress(event);
      }
    }
  };

  return (
    <Box>
      <Label>{label}</Label>
      <Wrapper disabled={disabled} isChanged={isValueChange}>
        <Contents
          width={width}
          value={value}
          disabled={disabled}
          isChanged={isValueChange}
          onChange={valueChanged}
          onKeyPress={keyEntered}
        />
        <ContentInfo>
          <ContentInfoIcon />
        </ContentInfo>
      </Wrapper>
    </Box>
  );
};

Input.defaultProps = {
  label: '',
  value: '',
  refValue: '',
  onChange: null,
  onKeyPress: null,
  width: '80px',
  disabled: false,
  isChanged: false,
};

export default Input;
