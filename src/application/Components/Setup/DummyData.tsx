import { SetupCategoryItem } from '@src/application/Components/Setup/SetupCategoryItem';

const SetupData: SetupCategoryItem[] = [
  {
    key: 1,
    category: 'Voltage',
    items: [
      {
        key: 1,
        setupParameter: 'wiring mode',
        defaultValue: 1,
        setupEnum: ['Invalid', '3P3W', '3P4W'], // 1: 3P3W, 2: 3P4W,
        address: 10000,
        dataType: 'Enum',
        dataSize: 1,
        dataRange: [1, 2],
        comment: '',
      },
      {
        key: 2,
        setupParameter: 'Ref Primary Voltage',
        defaultValue: 440,
        address: 10001,
        dataType: 'U16',
        dataSize: 1,
        dataRange: [0, 16000],
        comment: '',
      },
      {
        key: 3,
        setupParameter: 'PT Primary Voltage',
        defaultValue: 460,
        address: 10001,
        dataType: 'U16',
        dataSize: 1,
        dataRange: [0, 16000],
        comment: '',
      },
      {
        key: 4,
        setupParameter: 'PT Secondary Voltage',
        defaultValue: 115,
        address: 10001,
        dataType: 'U16',
        dataSize: 1,
        dataRange: [0, 16000],
        comment: '',
      },
      {
        key: 5,
        setupParameter: 'Min Measure Voltage',
        defaultValue: 5,
        address: 10001,
        dataType: 'U16',
        dataSize: 1,
        dataRange: [0, 16000],
        comment: '',
      },
    ],
  },
  {
    key: 2,
    category: 'A2700M LED Display',
    items: [
      {
        key: 1,
        setupParameter: 'Alarm LED Period',
        defaultValue: 10, // 1.0 s
        address: 10000,
        dataType: 'U16',
        dataSize: 1,
        dataRange: [10, 50],
        comment: '',
      },
      {
        key: 2,
        setupParameter: 'Alarm LED On Time',
        defaultValue: 10, // 1.0 s
        address: 10000,
        dataType: 'U16',
        dataSize: 1,
        dataRange: [10, 50],
        comment: '',
      },
      {
        key: 3,
        setupParameter: 'Fault LED Period',
        defaultValue: 10, // 1.0 s
        address: 10000,
        dataType: 'U16',
        dataSize: 1,
        dataRange: [10, 50],
        comment: '',
      },
      {
        key: 4,
        setupParameter: 'Fault LED On Time',
        defaultValue: 10, // 1.0 s
        address: 10000,
        dataType: 'U16',
        dataSize: 1,
        dataRange: [10, 50],
        comment: '',
      },
    ],
  },
  {
    key: 3,
    category: 'A2700D LED Display',
    items: [
      {
        key: 1,
        setupParameter: 'Alarm LED Period',
        defaultValue: 10, // 1.0 s
        address: 10000,
        dataType: 'U16',
        dataSize: 1,
        dataRange: [10, 50],
        comment: '',
      },
      {
        key: 2,
        setupParameter: 'Alarm LED On Time',
        defaultValue: 10, // 1.0 s
        address: 10000,
        dataType: 'U16',
        dataSize: 1,
        dataRange: [10, 50],
        comment: '',
      },
      {
        key: 3,
        setupParameter: 'Fault LED Period',
        defaultValue: 10, // 1.0 s
        address: 10000,
        dataType: 'U16',
        dataSize: 1,
        dataRange: [10, 50],
        comment: '',
      },
      {
        key: 4,
        setupParameter: 'Fault LED On Time',
        defaultValue: 10, // 1.0 s
        address: 10000,
        dataType: 'U16',
        dataSize: 1,
        dataRange: [10, 50],
        comment: '',
      },
    ],
  },
  {
    key: 4,
    category: 'A2700D LCD & Buzzer',
    items: [
      {
        key: 1,
        setupParameter: 'LCD backlight Timeout [sec]',
        defaultValue: 30, // 1.0 s
        address: 10000,
        dataType: 'U16',
        dataSize: 1,
        dataRange: [0, 60],
        comment: '',
      },
      {
        key: 2,
        setupParameter: 'LCD backlight Low Level [%]',
        defaultValue: 10, // 10%
        address: 10000,
        dataType: 'U16',
        dataSize: 1,
        dataRange: [10, 90],
        comment: '',
      },
      {
        key: 3,
        setupParameter: 'Buzzer for button',
        defaultValue: 1, // enable
        setupEnum: ['Disable', 'Enable'],
        address: 10000,
        dataType: 'Enum',
        dataSize: 1,
        dataRange: [0, 1],
        comment: '',
      },
      {
        key: 4,
        setupParameter: 'Buzzer for fault/alarm',
        defaultValue: 0, // 'disable'
        setupEnum: ['Disable', 'Enable'],
        address: 10000,
        dataType: 'Enum',
        dataSize: 1,
        dataRange: [0, 1],
        comment: '',
      },
      {
        key: 5,
        setupParameter: 'Buzzer period',
        defaultValue: 10, // 1.0 s
        address: 10000,
        dataType: 'U16',
        dataSize: 1,
        dataRange: [0, 60],
        comment: '',
      },
      {
        key: 6,
        setupParameter: 'Buzzer On Time',
        defaultValue: 5, // 0.5 s
        address: 10000,
        dataType: 'U16',
        dataSize: 1,
        dataRange: [10, 90],
        comment: '',
      },
    ],
  },
  {
    key: 5,
    category: 'Phase Naming',
    items: [
      {
        key: 1,
        setupParameter: 'Phase Naming',
        defaultValue: 0, // 1.0 s
        setupEnum: ['R-S-T', 'A-B-C', 'L1-L2-L3'],
        address: 10000,
        dataType: 'Enum',
        dataSize: 1,
        dataRange: [0, 3],
        comment: '',
      },
    ],
  },
  {
    key: 6,
    category: 'Temperature unit selection',
    items: [
      {
        key: 1,
        setupParameter: 'Temperature unit selection',
        defaultValue: 0, // 1.0 s
        setupEnum: ['C', 'F'],
        address: 10000,
        dataType: 'Enum',
        dataSize: 1,
        dataRange: [0, 1],
        comment: '',
      },
    ],
  },
];

export default SetupData;
