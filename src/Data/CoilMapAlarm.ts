import A2700Data from './A2700Data';
import A2700DataType from './A2700DataType';

class CoilAlarm implements A2700Data {
  type: A2700DataType = A2700DataType.CoilMapAlarm;

  ringState: boolean;

  displayDisconnect: boolean;

  activeStatus: boolean;

  ethernetDisconnect: boolean;

  lmhMismatch: boolean; 
}

export default CoilAlarm;
