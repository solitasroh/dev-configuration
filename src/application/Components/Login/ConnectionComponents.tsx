import React from 'react';
import styled, { keyframes } from 'styled-components';

const Status = {
  CONNECTED: 1,
  DISCONNECTED: 2,
  REQUEST_CONNECT: 4,
};

const fadeIn = keyframes`
  0%{
    opacity: 1;
  }
  50%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
`;

function connectionColor(connectionStatus: boolean): string {
  return connectionStatus ? '#4bcc3af6' : '#eb5d4a';
}

const ConnecionState = styled.div<{ connected: boolean }>`
  font-size: 10px;
  margin-bottom: 5px;
  opacity: 1;
  color: ${(prop) => connectionColor(prop.connected)};
  animation: ${fadeIn} ${(prop) => (prop.connected ? '0s' : '2.5s')} infinite;
`;

export { Status, ConnecionState, connectionColor };
