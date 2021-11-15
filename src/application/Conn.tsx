import React from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import Modal from 'react-modal';

const Form = styled.form`
  padding: 5px;
  background-color: #ffffff;
  border-radius: 3px;
  margin-bottom: 10px;
`;

const IPContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: baseline;
  margin-bottom: 10px;
`;

const IPLabel = styled.div`
  font-size: 12px;
  flex-wrap: nowrap;
  text-align: center;
  margin-right: 10px;
`;

const IPField = styled.input.attrs({ type: 'text' })`
  width: 100%;
  font-size: 0.8em;
`;

const SubmitButton = styled.input.attrs({ type: 'submit' })`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 14px;
  font-family: -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
  border-radius: 6px;
  color: #3d3d3d;
  background: #fff;
  border: none;
  box-shadow: 0px 0.5px 1px rgba(0, 0, 0, 0.1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  :focus {
    box-shadow: 0px 0.5px 1px rgba(0, 0, 0, 0.1),
      0px 0px 0px 3.5px rgba(61, 160, 89, 0.5);
    outline: 0;
  }
`;

const CustomModal = styled(Modal)`
  width: auto;
  height: 100%;
`;

type Props = {
  visible: boolean;
  close: () => void;
};

const Conn: React.FC<Props> = ({ visible, close }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = handleSubmit((data) => {
    // const service = IpcService.getInstance();
    // service.send(CONNECTION, {});
    console.log(data);
    close();
  });

  return (
    <CustomModal
      isOpen={visible}
      ariaHideApp={false}
      style={{
        overlay: {
          background: '#5d5d5d42',
        },
      }}
      shouldCloseOnOverlayClick
    >
      <Form onSubmit={onSubmit}>
        <IPContainer>
          <IPLabel>IP</IPLabel>
          <IPField type="text" {...register('ipAddress')} />
        </IPContainer>
        <SubmitButton type="submit" value="CONNECT" />
      </Form>
    </CustomModal>
  );
};

export default Conn;
