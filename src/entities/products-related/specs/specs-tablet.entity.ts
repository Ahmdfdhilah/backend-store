import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Product } from '../product.entity';

@Entity()
export class SpecsTablet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  brand: string; // Brand

  @Column()
  model: string; // Model

  @Column({ nullable: true })
  launched: string; // Launched

  @Column()
  dimensions: string; // Dimensions (mm)

  @Column()
  weight: string; // Weight (g)

  @Column()
  batteryCapacity: string; // Battery capacity (mAh)

  @Column()
  removableBattery: string; // Removable battery

  @Column()
  screenSize: string; // Screen size (inches)

  @Column({ default: true })
  touchscreen: boolean; // Touchscreen

  @Column()
  resolution: string; // Resolution

  @Column()
  ppi: string; // Pixels per inch (PPI)

  @Column()
  processor: string; // Processor

  @Column()
  processorMake: string; // Processor make

  @Column()
  ram: string; // RAM

  @Column()
  internalStorage: string; // Internal storage

  @Column()
  expandableStorage: string; // Expandable storage

  @Column()
  rearCamera: string; // Rear camera

  @Column()
  rearFlash: string; // Rear Flash

  @Column()
  frontCamera: string; // Front camera

  @Column()
  operatingSystem: string; // Operating system

  @Column()
  wifi: string; // Wi-Fi

  @Column()
  gps: string; // GPS

  @Column()
  bluetooth: string; // Bluetooth

  @Column({ default: false })
  nfc: boolean; // NFC

  @Column({ default: false })
  infrared: boolean; // Infrared

  @Column()
  usbOtg: string; // USB OTG

  @Column()
  headphones: string; // Headphones

  @Column({ default: false })
  fm: boolean; // FM

  @Column({ default: false })
  wifiDirect: boolean; // Wi-Fi Direct

  @Column({ default: false })
  mhl: boolean; // Mobile High-Definition Link (MHL)

  @Column({ default: false })
  compassMagnetometer: boolean; // Compass/ Magnetometer

  @Column({ default: false })
  proximitySensor: boolean; // Proximity sensor

  @Column({ default: false })
  accelerometer: boolean; // Accelerometer

  @Column({ default: false })
  ambientLightSensor: boolean; // Ambient light sensor

  @Column({ default: false })
  gyroscope: boolean; // Gyroscope

  @Column({ default: false })
  barometer: boolean; // Barometer

  @Column({ default: false })
  temperatureSensor: boolean; // Temperature sensor

  @OneToOne(() => Product, {cascade:true, onDelete:"CASCADE"})
  @JoinColumn()
  product: Product;
}
