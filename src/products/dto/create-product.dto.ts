import {  ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';


class CreateInventoryDto {
  stock: number;
}

class CreateReviewDto {
  rating: number;
  comment: string;
  userId: string;
}

class CreateDiscountDto {
  discount: number;
  expires_at: string;
}


export class CreateSpecsSmartphoneDto {
  brand: string;
  model: string;
  company: string;
  os: string;
  chipset: string;
  cpu: string;
  gpu: string;
  cardSlot: boolean;
  internal: string;
  dualCamera: string;
  features: string;
  dualVideo: string;
  singleCamera: string;
  singleVideo: string;
  loudspeaker: boolean;
  wlan: string;
  bluetooth: string;
  positioning: string;
  nfc: boolean;
  infraredPort: boolean;
  radio: boolean;
  usb: string;
  batteryType: string;
  charging: string;
  color: string;
  screenType: string;
  screenSize: string;
  resolution: string;
  dimensions: string;
  weight: string;
  build: string;
  sim: string;
}

export class CreateSpecsLaptopDto {
  brand: string;
  model: string;
  company: string;
  ram: string;
  size: string;
  ssd: string;
  color: string[];
  operatingSystem: string;
  hardDisk: string;
  modelNumber: string;
  processor: string;
  graphicsProcessor: string;
  dedicatedGraphics: string;
  fingerprintSensor: string;
  resolution: string;
  wifiStandardsSupported: string;
  weight: string;
  dimensions: string;
  bluetoothVersion: string;
  numberOfUSBPorts: string;
  series: string;
  internalMic: string;
  touchScreen: string;
  baseClockSpeed: string;
  productName: string;
  touchpad: string;
  batteryCell: string;
  pointerDevice: string;
  cache: string;
  micIn: string;
  speakers: string;
  multiCardSlot: string;
  rj45LAN: string;
  hdmiPort: string;
  ethernet: string;
  batteryLife: string;
  dedicatedGraphicMemoryType: string;
  expandableRAM: string;
}

export class CreateSpecsTabletDto {
  brand: string;
  model: string;
  launched?: string;
  dimensions: string;
  weight: string;
  batteryCapacity: string;
  removableBattery: string;
  color: string;
  screenSize: string;
  touchscreen: boolean;
  resolution: string;
  ppi: string;
  processor: string;
  processorMake: string;
  ram: string;
  internalStorage: string;
  expandableStorage: string;
  rearCamera: string;
  rearFlash: string;
  frontCamera: string;
  operatingSystem: string;
  skin: string;
  wifi: string;
  gps: string;
  bluetooth: string;
  nfc: boolean;
  infrared: boolean;
  usbOtg: string;
  headphones: string;
  fm: boolean;
  wifiDirect: boolean;
  mhl: boolean;
  compassMagnetometer: boolean;
  proximitySensor: boolean;
  accelerometer: boolean;
  ambientLightSensor: boolean;
  gyroscope: boolean;
  barometer: boolean;
  temperatureSensor: boolean;
}

export class CreateProductDto {
  name: string;
  price: number;
  category: string;

  @ValidateNested({ each: true })
  @Type(() => CreateInventoryDto)
  inventory: CreateInventoryDto[];

  @ValidateNested({ each: true })
  @Type(() => CreateReviewDto)
  reviews: CreateReviewDto[];

  @ValidateNested({ each: true })
  @Type(() => CreateDiscountDto)
  discounts: CreateDiscountDto[];
  @Type(() => CreateSpecsSmartphoneDto)
  smartphoneSpecs?: CreateSpecsSmartphoneDto;
  @Type(() => CreateSpecsLaptopDto)
  LaptopSpecs?: CreateSpecsLaptopDto;
  @Type(() => CreateSpecsTabletDto)
  tabletSpecs?: CreateSpecsTabletDto;
  
}