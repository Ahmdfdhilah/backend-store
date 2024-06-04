import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateInventoryDto {
  stock: number;
}

class UpdateReviewDto {
  rating?: number;
  comment?: string;
  userId?: string;
}

class UpdateDiscountDto {
  discount: number;
  expires_at: string;
}


export class UpdateSpecsSmartphoneDto {
  brand?: string;
  model?: string;
  company?: string;
  os?: string;
  chipset?: string;
  cpu?: string;
  gpu?: string;
  cardSlot?: boolean;
  internal?: string;
  dualCamera?: string;
  features?: string;
  dualVideo?: string;
  singleCamera?: string;
  singleVideo?: string;
  loudspeaker?: boolean;
  wlan?: string;
  bluetooth?: string;
  positioning?: string;
  nfc?: boolean;
  infraredPort?: boolean;
  radio?: boolean;
  usb?: string;
  batteryType?: string;
  charging?: string;
  color?: string;
  screenType?: string;
  screenSize?: string;
  resolution?: string;
  dimensions?: string;
  weight?: string;
  build?: string;
  sim?: string;
}

export class UpdateSpecsLaptopDto {
  brand?: string;
  model?: string;
  company?: string;
  ram?: string;
  size?: string;
  ssd?: string;
  color?: string[];
  operatingSystem?: string;
  hardDisk?: string;
  modelNumber?: string;
  processor?: string;
  graphicsProcessor?: string;
  dedicatedGraphics?: string;
  fingerprintSensor?: string;
  resolution?: string;
  wifiStandardsSupported?: string;
  weight?: string;
  dimensions?: string;
  bluetoothVersion?: string;
  numberOfUSBPorts?: string;
  series?: string;
  internalMic?: string;
  touchScreen?: string;
  baseClockSpeed?: string;
  productName?: string;
  touchpad?: string;
  batteryCell?: string;
  pointerDevice?: string;
  cache?: string;
  micIn?: string;
  speakers?: string;
  multiCardSlot?: string;
  rj45LAN?: string;
  hdmiPort?: string;
  ethernet?: string;
  batteryLife?: string;
  dedicatedGraphicMemoryType?: string;
  expandableRAM?: string;
}

export class UpdateSpecsTabletDto {
  brand?: string;
  model?: string;
  launched?: string;
  dimensions?: string;
  weight?: string;
  batteryCapacity?: string;
  removableBattery?: string;
  color?: string;
  screenSize?: string;
  touchscreen?: boolean;
  resolution?: string;
  ppi?: string;
  processor?: string;
  processorMake?: string;
  ram?: string;
  internalStorage?: string;
  expandableStorage?: string;
  rearCamera?: string;
  rearFlash?: string;
  frontCamera?: string;
  operatingSystem?: string;
  skin?: string;
  wifi?: string;
  gps?: string;
  bluetooth?: string;
  nfc?: boolean;
  infrared?: boolean;
  usbOtg?: string;
  headphones?: string;
  fm?: boolean;
  wifiDirect?: boolean;
  mhl?: boolean;
  compassMagnetometer?: boolean;
  proximitySensor?: boolean;
  accelerometer?: boolean;
  ambientLightSensor?: boolean;
  gyroscope?: boolean;
  barometer?: boolean;
  temperatureSensor?: boolean;
}

export class UpdateProductDto {
  name: string;
  price: number;

  @ValidateNested({ each: true })
  @Type(() => UpdateInventoryDto)
  inventory: UpdateInventoryDto[];

  @ValidateNested({ each: true })
  @Type(() => UpdateReviewDto)
  reviews: UpdateReviewDto[];

  @ValidateNested({ each: true })
  @Type(() => UpdateDiscountDto)
  discounts: UpdateDiscountDto[];

  category: string;
  @Type(() => UpdateSpecsSmartphoneDto)
  smartphoneSpecs?: UpdateSpecsSmartphoneDto;
  @Type(() => UpdateSpecsLaptopDto)
  laptopSpecs?: UpdateSpecsLaptopDto;
  @Type(() => UpdateSpecsTabletDto)
  tabletSpecs?: UpdateSpecsTabletDto;
}
