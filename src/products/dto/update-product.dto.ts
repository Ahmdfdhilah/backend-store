import { z } from 'zod';

const UpdateInventoryDtoSchema = z.object({
  stock: z.number(),
});

const UpdateReviewDtoSchema = z.object({
  rating: z.number().optional(),
  comment: z.string().optional(),
  userId: z.string().optional(),
});

const UpdateDiscountDtoSchema = z.object({
  discount: z.number(),
  expires_at: z.string(),
});

const UpdateSpecsSmartphoneDtoSchema = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
  company: z.string().optional(),
  os: z.string().optional(),
  chipset: z.string().optional(),
  cpu: z.string().optional(),
  gpu: z.string().optional(),
  cardSlot: z.boolean().optional(),
  internal: z.string().optional(),
  dualCamera: z.string().optional(),
  features: z.string().optional(),
  dualVideo: z.string().optional(),
  singleCamera: z.string().optional(),
  singleVideo: z.string().optional(),
  loudspeaker: z.boolean().optional(),
  wlan: z.string().optional(),
  bluetooth: z.string().optional(),
  positioning: z.string().optional(),
  nfc: z.boolean().optional(),
  infraredPort: z.boolean().optional(),
  radio: z.boolean().optional(),
  usb: z.string().optional(),
  batteryType: z.string().optional(),
  charging: z.string().optional(),
  screenType: z.string().optional(),
  screenSize: z.string().optional(),
  resolution: z.string().optional(),
  dimensions: z.string().optional(),
  weight: z.string().optional(),
  build: z.string().optional(),
  sim: z.string().optional(),
});

const UpdateSpecsLaptopDtoSchema = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
  company: z.string().optional(),
  ram: z.string().optional(),
  size: z.string().optional(),
  ssd: z.string().optional(),
  operatingSystem: z.string().optional(),
  hardDisk: z.string().optional(),
  modelNumber: z.string().optional(),
  processor: z.string().optional(),
  graphicsProcessor: z.string().optional(),
  dedicatedGraphics: z.string().optional(),
  fingerprintSensor: z.string().optional(),
  resolution: z.string().optional(),
  wifiStandardsSupported: z.string().optional(),
  weight: z.string().optional(),
  dimensions: z.string().optional(),
  bluetoothVersion: z.string().optional(),
  numberOfUSBPorts: z.string().optional(),
  series: z.string().optional(),
  internalMic: z.string().optional(),
  touchScreen: z.string().optional(),
  baseClockSpeed: z.string().optional(),
  productName: z.string().optional(),
  touchpad: z.string().optional(),
  batteryCell: z.string().optional(),
  pointerDevice: z.string().optional(),
  cache: z.string().optional(),
  micIn: z.string().optional(),
  speakers: z.string().optional(),
  multiCardSlot: z.string().optional(),
  rj45LAN: z.string().optional(),
  hdmiPort: z.string().optional(),
  ethernet: z.string().optional(),
  batteryLife: z.string().optional(),
  dedicatedGraphicMemoryType: z.string().optional(),
  expandableRAM: z.string().optional(),
});

const UpdateSpecsTabletDtoSchema = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
  launched: z.string().optional(),
  dimensions: z.string().optional(),
  weight: z.string().optional(),
  batteryCapacity: z.string().optional(),
  removableBattery: z.string().optional(),
  screenSize: z.string().optional(),
  touchscreen: z.boolean().optional(),
  resolution: z.string().optional(),
  ppi: z.string().optional(),
  processor: z.string().optional(),
  processorMake: z.string().optional(),
  ram: z.string().optional(),
  internalStorage: z.string().optional(),
  expandableStorage: z.string().optional(),
  rearCamera: z.string().optional(),
  rearFlash: z.string().optional(),
  frontCamera: z.string().optional(),
  operatingSystem: z.string().optional(),
  wifi: z.string().optional(),
  gps: z.string().optional(),
  bluetooth: z.string().optional(),
  nfc: z.boolean().optional(),
  infrared: z.boolean().optional(),
  usbOtg: z.string().optional(),
  headphones: z.string().optional(),
  fm: z.boolean().optional(),
  wifiDirect: z.boolean().optional(),
  mhl: z.boolean().optional(),
  compassMagnetometer: z.boolean().optional(),
  proximitySensor: z.boolean().optional(),
  accelerometer: z.boolean().optional(),
  ambientLightSensor: z.boolean().optional(),
  gyroscope: z.boolean().optional(),
  barometer: z.boolean().optional(),
  temperatureSensor: z.boolean().optional(),
});

export const UpdateProductDtoSchema = z.object({
  name: z.string().optional(),
  price: z.number().optional(),
  imgSrc: z.string(),
  weight: z.number(),
  color: z.array(z.string()), 
  inventory: z.number().optional(),
  reviews: z.array(UpdateReviewDtoSchema).optional(),
  discounts: UpdateDiscountDtoSchema.optional(),
  category: z.string().optional(),
  smartphoneSpecs: UpdateSpecsSmartphoneDtoSchema.optional(),
  laptopSpecs: UpdateSpecsLaptopDtoSchema.optional(),
  tabletSpecs: UpdateSpecsTabletDtoSchema.optional(),
});

export type UpdateProductDto = z.infer<typeof UpdateProductDtoSchema>;