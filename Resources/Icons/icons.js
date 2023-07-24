import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import FontAwsome5 from 'react-native-vector-icons/FontAwesome5';

import allColor from '../Colors/Color';

const phone = <Feather name="phone" size={20} color={allColor['light-gray']} />;
const unlock = (
  <Feather name="unlock" size={20} color={allColor['light-gray']} />
);

const arrowRight = (
  <Feather name="arrow-right" size={30} color={allColor['white']} />
);

const forgot = (
  <MaterialCommunityIcons
    name="account-lock-open"
    size={60}
    color={allColor['primary-color']}
  />
);

const person = (
  <Ionicons name="person-outline" size={20} color={allColor['light-gray']} />
);

const buildibg = (
  <MaterialCommunityIcons
    name="office-building"
    size={20}
    color={allColor['light-gray']}
  />
);

const buildibgLocation = (
  <MaterialCommunityIcons
    name="office-building-marker-outline"
    size={20}
    color={allColor['light-gray']}
  />
);

const email = (
  <MaterialCommunityIcons
    name="email-outline"
    size={20}
    color={allColor['light-gray']}
  />
);

const done = <MaterialIcons name="done" size={50} color={allColor.white} />;

const resend = (
  <MaterialCommunityIcons
    name="backup-restore"
    size={20}
    color={allColor['primary-color']}
  />
);

const sync = (
  <MaterialIcons
    name="settings-backup-restore"
    size={50}
    color={allColor['primary-color']}
  />
);

const arrowUp = (
  <MaterialIcons
    name="arrow-circle-up"
    size={50}
    color={allColor['primary-color']}
  />
);

const print = (
  <Feather name="printer" size={50} color={allColor['primary-color']} />
);
const printer_two = (
  <MaterialCommunityIcons
    name="printer"
    size={50}
    color={allColor['primary-color']}
  />
);

const bike = (
  <MaterialCommunityIcons
    name="motorbike"
    size={50}
    color={allColor['primary-color']}
  />
);
const car = (
  <MaterialCommunityIcons
    name="car-hatchback"
    size={50}
    color={allColor['primary-color']}
  />
);
const truck = (
  <MaterialCommunityIcons
    name="truck"
    size={50}
    color={allColor['primary-color']}
  />
);

const calendar = (
  <Ionicons
    name="calendar-outline"
    size={30}
    color={allColor['primary-color']}
  />
);

const time = (
  <Ionicons name="time-outline" size={30} color={allColor['primary-color']} />
);

const paperRoll = (size, color) => (
  <MaterialCommunityIcons
    name="paper-roll-outline"
    size={size || 30}
    color={color || allColor['primary-color']}
  />
);

const cellphone = (size, color) => (
  <MaterialCommunityIcons
    name="cellphone"
    size={size || 30}
    color={color || allColor['primary-color']}
  />
);

const receipt = (color, size) => (
  <Ionicons name="receipt" color={color} size={size} />
);
const setting = (color, size) => (
  <MaterialIcons name="settings" color={color} size={size} />
);

const report = (color, size) => (
  <Foundation name="graph-bar" color={color} size={size} />
);

const alertIcon = (size, color) => (
  <MaterialCommunityIcons
    name="database-alert"
    color={color || allColor['primary-color']}
    size={size || 30}
  />
);

const eraser = (size, color) => (
  <FontAwsome5
    name="eraser"
    color={color || allColor['primary-color']}
    size={size || 30}
  />
);

const userEdit = (size, color) => (
  <FontAwsome5
    name="user-edit"
    color={color || allColor.white}
    size={size || 25}
  />
);

const deleteIcon = (size, color) => (
  <MaterialCommunityIcons
    name="delete-outline"
    color={color || allColor.white}
    size={size || 25}
  />
);

const dynamicvechicleIcon = name => (
  <MaterialCommunityIcons
    name={name}
    size={50}
    color={allColor['primary-color']}
  />
);

const chnagePassword = (
  <MaterialCommunityIcons
    name={'lock-reset'}
    size={50}
    color={allColor['primary-color']}
  />
);

const remove = (
  <MaterialCommunityIcons
    name={'database-remove'}
    size={50}
    color={allColor['primary-color']}
  />
);

// const sync  = <MaterialIcons name="settings-backup-restore" size={50} color={allColor['primary-color']}/>

const book = (
  <MaterialCommunityIcons
    name={'book-open-blank-variant'}
    size={50}
    color={allColor['primary-color']}
  />
);

const language = (
  <MaterialIcons
    name={'language'}
    size={25}
    color={allColor['primary-color']}
  />
);
const deviceMode = (
  <MaterialIcons name={'devices'} size={25} color={allColor['primary-color']} />
);
const report2 = (
  <MaterialIcons name={'report'} size={25} color={allColor['primary-color']} />
);
const onepassword = (
  <MaterialCommunityIcons
    name={'onepassword'}
    size={25}
    color={allColor['primary-color']}
  />
);

const timeSand = (
  <MaterialCommunityIcons
    name={'timer-sand'}
    size={25}
    color={allColor['primary-color']}
  />
);

const totalCollection = (
  <MaterialIcons
    name={'payments'}
    size={25}
    color={allColor['primary-color']}
  />
);

const archiveData = (
  <MaterialCommunityIcons
    name={'database-arrow-down'}
    size={25}
    color={allColor['primary-color']}
  />
);

const resetReceipt = (
  <MaterialCommunityIcons
    name={'autorenew'}
    size={25}
    color={allColor['primary-color']}
  />
);
const mandotaryVehicle = (
  <MaterialIcons
    name={'railway-alert'}
    size={25}
    color={allColor['primary-color']}
  />
);

const backArrow = (
  <MaterialIcons name={'arrow-back'} size={25} color={allColor.black} />
);

const flashOn = (
  <MaterialCommunityIcons
    name={'flashlight'}
    size={25}
    color={allColor.white}
  />
);
const flashOff = (
  <MaterialCommunityIcons
    name={'flashlight-off'}
    size={25}
    color={allColor.white}
  />
);

const users = <MaterialIcons name="supervised-user-circle" size={45}  color={allColor['primary-color']}/>

export default icons = {
  phone,
  unlock,
  arrowRight,
  forgot,
  person,
  buildibg,
  buildibgLocation,
  email,
  done,
  resend,
  sync,
  arrowUp,
  print,
  printer_two,
  bike,
  car,
  truck,
  calendar,
  time,
  receipt,
  setting,
  report,
  paperRoll,
  cellphone,
  alertIcon,
  eraser,
  userEdit,
  deleteIcon,
  dynamicvechicleIcon,
  remove,
  chnagePassword,
  book,
  language,
  deviceMode,
  report2,
  onepassword,
  timeSand,
  totalCollection,
  archiveData,
  resetReceipt,
  mandotaryVehicle,
  backArrow,
  flashOn,
  flashOff,
  users
};
