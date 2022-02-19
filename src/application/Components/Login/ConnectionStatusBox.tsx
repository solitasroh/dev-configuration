import React, { FC } from 'react';
import { connectionColor } from './ConnectionComponents';

interface Props {
  connectionStatus: boolean;
}
const ConnectionStatusBox: FC<Props> = ({ connectionStatus }) => (
  <div
    style={{
      backgroundColor: connectionColor(connectionStatus),
      margin: 10,
      padding: 6,
      borderRadius: 5,
      alignItems: 'center',
    }}
  >
    {connectionStatus}
  </div>
);

export default ConnectionStatusBox;
