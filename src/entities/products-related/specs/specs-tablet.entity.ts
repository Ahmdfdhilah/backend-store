import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Product } from '../product.entity';

@Entity()
export class SpecsTablet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  brand: string | null; // Brand

  @Column({ nullable: true })
  model: string | null; // Model

  @Column({ nullable: true })
  launched: string | null; // Launched

  @Column({ nullable: true })
  dimensions: string | null; // Dimensions (mm)

  @Column({ nullable: true })
  weight: string | null; // Weight (g)

  @Column({ nullable: true })
  batteryCapacity: string | null; // Battery capacity (mAh)

  @Column({ nullable: true })
  removableBattery: string | null; // Removable battery

  @Column({ nullable: true })
  screenSize: string | null; // Screen size (inches)

  @Column({ nullable: true, default: true })
  touchscreen: boolean | null; // Touchscreen

  @Column({ nullable: true })
  resolution: string | null; // Resolution

  @Column({ nullable: true })
  ppi: string | null; // Pixels per inch (PPI)

  @Column({ nullable: true })
  processor: string | null; // Processor

  @Column({ nullable: true })
  processorMake: string | null; // Processor make

  @Column({ nullable: true })
  ram: string | null; // RAM

  @Column({ nullable: true })
  internalStorage: string | null; // Internal storage

  @Column({ nullable: true })
  expandableStorage: string | null; // Expandable storage

  @Column({ nullable: true })
  rearCamera: string | null; // Rear camera

  @Column({ nullable: true })
  rearFlash: string | null; // Rear Flash

  @Column({ nullable: true })
  frontCamera: string | null; // Front camera

  @Column({ nullable: true })
  operatingSystem: string | null; // Operating system

  @Column({ nullable: true })
  wifi: string | null; // Wi-Fi

  @Column({ nullable: true })
  gps: string | null; // GPS

  @Column({ nullable: true })
  bluetooth: string | null; // Bluetooth

  @Column({ nullable: true, default: false })
  nfc: boolean | null; // NFC

  @Column({ nullable: true, default: false })
  infrared: boolean | null; // Infrared

  @Column({ nullable: true })
  usbOtg: string | null; // USB OTG

  @Column({ nullable: true })
  headphones: string | null; // Headphones

  @Column({ nullable: true, default: false })
  fm: boolean | null; // FM

  @Column({ nullable: true, default: false })
  wifiDirect: boolean | null; // Wi-Fi Direct

  @Column({ nullable: true, default: false })
  mhl: boolean | null; // Mobile High-Definition Link (MHL)

  @Column({ nullable: true, default: false })
  compassMagnetometer: boolean | null; // Compass/ Magnetometer

  @Column({ nullable: true, default: false })
  proximitySensor: boolean | null; // Proximity sensor

  @Column({ nullable: true, default: false })
  accelerometer: boolean | null; // Accelerometer

  @Column({ nullable: true, default: false })
  ambientLightSensor: boolean | null; // Ambient light sensor

  @Column({ nullable: true, default: false })
  gyroscope: boolean | null; // Gyroscope

  @Column({ nullable: true, default: false })
  barometer: boolean | null; // Barometer

  @Column({ nullable: true, default: false })
  temperatureSensor: boolean | null; // Temperature sensor

  @OneToOne(() => Product, { cascade: true, onDelete: "CASCADE" })
  @JoinColumn()
  product: Product;
}