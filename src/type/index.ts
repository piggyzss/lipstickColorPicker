// [255, 255, 255]
export type colorArray = Array<number>

interface IEvent extends Event {
  target: any;
  currentTarget: any;
}

export interface LipstickInfoList {
  [brand: string]: LipstickInfo;
}

export interface LipstickInfo {
  [group: string]: Array<LipstickInfoDetail>;
}

export interface LipstickInfoDetail {
  info: string;
  color: string;
}

export interface MinMax {
  maxHue: number;
  maxLight: number;
  minHue: number;
  minLight: number;
}