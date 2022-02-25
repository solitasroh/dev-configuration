import React, { FC } from 'react';

interface Props {
  moduleId: number;
  diCount: number;
}

const IOHDISetup: FC<Props> = ({ diCount, moduleId }) => (
  <div>
    <div>{`ID ${moduleId}`}</div>
  </div>
);

export default IOHDISetup;
