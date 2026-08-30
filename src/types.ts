export interface Reminder {
  id: string;
  time: string; // HH:mm
  label: string;
  alwaysVisible: boolean;
  acknowledged?: boolean;
}
