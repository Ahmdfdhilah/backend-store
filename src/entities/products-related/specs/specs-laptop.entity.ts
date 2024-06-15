import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Product } from '../product.entity';

@Entity()
export class SpecsLaptop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  brand: string; // Brand

  @Column({ nullable: true })
  model: string; // Model

  @Column({ nullable: true })
  company: string; // Company

  @Column({ nullable: true })
  ram: string; // RAM

  @Column({ nullable: true })
  size: string; // Size

  @Column({ nullable: true })
  ssd: string; // SSD

  @Column({ nullable: true })
  operatingSystem: string; // Operating system

  @Column({ nullable: true })
  hardDisk: string; // Hard disk

  @Column({ nullable: true })
  modelNumber: string; // Model Number

  @Column({ nullable: true })
  processor: string; // Processor

  @Column({ nullable: true })
  graphicsProcessor: string; // Graphics Processor

  @Column({ nullable: true })
  dedicatedGraphics: string; // Dedicated Graphics

  @Column({ nullable: true })
  fingerprintSensor: string; // Finger Print Sensor

  @Column({ nullable: true })
  resolution: string; // Resolution

  @Column({ nullable: true })
  wifiStandardsSupported: string; // Wi-Fi standards supported

  @Column({ nullable: true })
  weight: string; // Weight (kg)

  @Column({ nullable: true })
  dimensions: string; // Dimensions (mm)

  @Column({ nullable: true })
  bluetoothVersion: string; // Bluetooth version

  @Column({ nullable: true })
  numberOfUSBPorts: string; // Number of USB Ports

  @Column({ nullable: true })
  series: string; // Series

  @Column({ nullable: true })
  internalMic: string; // Internal Mic

  @Column({ nullable: true })
  touchScreen: string; // Touch Screen

  @Column({ nullable: true })
  baseClockSpeed: string; // Base Clock Speed

  @Column({ nullable: true })
  productName: string; // Product Name

  @Column({ nullable: true })
  touchpad: string; // Touchpad

  @Column({ nullable: true })
  batteryCell: string; // Battery Cell

  @Column({ nullable: true })
  pointerDevice: string; // Pointer Device

  @Column({ nullable: true })
  cache: string; // Cache

  @Column({ nullable: true })
  micIn: string; // Mic In

  @Column({ nullable: true })
  speakers: string; // Speakers

  @Column({ nullable: true })
  multiCardSlot: string;

  @Column({ nullable: true })
  rj45LAN: string;

  @Column({ nullable: true })
  hdmiPort: string;

  @Column({ nullable: true })
  ethernet: string; 

  @Column({ nullable: true })
  batteryLife: string;

  @Column({ nullable: true })
  dedicatedGraphicMemoryType: string; 

  @Column({ nullable: true })
  expandableRAM: string; 

  @OneToOne(() => Product, { cascade: true, onDelete: "CASCADE" })
  @JoinColumn()
  product: Product;
}