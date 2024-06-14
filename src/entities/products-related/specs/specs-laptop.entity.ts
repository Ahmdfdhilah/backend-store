import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Product } from '../product.entity';

@Entity()
export class SpecsLaptop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  brand: string; // Brand

  @Column()
  model: string; // Model

  @Column()
  company: string; // Company

  @Column()
  ram: string; // RAM

  @Column()
  size: string; // Size

  @Column()
  ssd: string; // SSD

  @Column()
  operatingSystem: string; // Operating system

  @Column()
  hardDisk: string; // Hard disk

  @Column()
  modelNumber: string; // Model Number

  @Column()
  processor: string; // Processor

  @Column()
  graphicsProcessor: string; // Graphics Processor

  @Column()
  dedicatedGraphics: string; // Dedicated Graphics

  @Column()
  fingerprintSensor: string; // Finger Print Sensor

  @Column()
  resolution: string; // Resolution

  @Column()
  wifiStandardsSupported: string; // Wi-Fi standards supported

  @Column()
  weight: string; // Weight (kg)

  @Column()
  dimensions: string; // Dimensions (mm)

  @Column()
  bluetoothVersion: string; // Bluetooth version

  @Column()
  numberOfUSBPorts: string; // Number of USB Ports

  @Column()
  series: string; // Series

  @Column()
  internalMic: string; // Internal Mic

  @Column()
  touchScreen: string; // Touch Screen

  @Column()
  baseClockSpeed: string; // Base Clock Speed

  @Column()
  productName: string; // Product Name

  @Column()
  touchpad: string; // Touchpad

  @Column()
  batteryCell: string; // Battery Cell

  @Column()
  pointerDevice: string; // Pointer Device

  @Column()
  cache: string; // Cache

  @Column()
  micIn: string; // Mic In

  @Column()
  speakers: string; // Speakers

  @Column()
  multiCardSlot: string;

  @Column()
  rj45LAN: string;

  @Column()
  hdmiPort: string;

  @Column()
  ethernet: string; 

  @Column()
  batteryLife: string;

  @Column()
  dedicatedGraphicMemoryType: string; 

  @Column()
  expandableRAM: string; 

  @OneToOne(() => Product, {cascade: true, onDelete:"CASCADE"})
  @JoinColumn()
  product: Product;
}
