// specs-smartphone.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Product } from '../product.entity';

@Entity()
export class SpecsSmartphone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  brand: string; // Brand

  @Column()
  model: string; // Model

  @Column()
  company: string; // Company

  @Column()
  os: string; // OS: Android 14, HyperOS

  @Column()
  chipset: string; // Chipset: Qualcomm SM4450 Snapdragon 4+ Gen 2 (4 nm)

  @Column()
  cpu: string; // CPU: Octa-core (2x2.3 GHz Cortex-A78 & 6x1.95 GHz Cortex-A55)

  @Column()
  gpu: string; // GPU: Adreno 613

  @Column()
  cardSlot: boolean; // CardSlot: No

  @Column()
  internal: string; // Internal: 128GB 6GB RAM, 128GB 8GB RAM, 256GB 8GB RAM, 256GB 12GB RAM, 512GB 12GB RAM UFS 2.2

  @Column()
  dualCamera: string; // Dual: 50 MP, f/1.8, (wide), 1/2.76", 0.64µm, PDAF; 2 MP, f/2.4, (macro)

  @Column()
  features: string; // Features: LED flash, HDR

  @Column()
  dualVideo: string; // DualVideo: 1080p@30fps

  @Column()
  singleCamera: string; // Single: 8 MP, (wide), 1/4.0", 1.12µm

  @Column()
  singleVideo: string; // SingleVideo: 1080p@30fps

  @Column()
  loudspeaker: boolean; // Loudspeaker: Yes

  @Column()
  wlan: string; // WLAN: Wi-Fi 802.11 a/b/g/n/ac, dual-band

  @Column()
  bluetooth: string; // Bluetooth: 5.3, A2DP, LE

  @Column()
  positioning: string; // Positioning: GPS, GLONASS, GALILEO, BDS

  @Column()
  nfc: boolean; // NFC: Yes

  @Column()
  infraredPort: boolean; // InfraredPort: Yes

  @Column()
  radio: boolean; // Radio: No

  @Column()
  usb: string; // USB: USB Type-C

  @Column()
  batteryType: string; // batteryType: 5030 mAh, non-removable

  @Column()
  charging: string; // Charging: 33W wired

  @Column()
  color: string; // Colors: Black, Blue, Silver

  @Column()
  screenType: string; // ScreenType: IPS LCD, 120Hz, 550 nits

  @Column()
  screenSize: string; // ScreenSize: 6.79 inches, 109.5 cm2 (~85.1% screen-to-body ratio)

  @Column()
  resolution: string; // Resolution: 1080 x 2460 pixels (~396 ppi density)

  @Column()
  dimensions: string; // Dimensions: 168.6 x 76.3 x 8.2 mm (6.64 x 3.00 x 0.32 in)

  @Column()
  weight: string; // Weight: 205 g (7.23 oz)

  @Column()
  build: string; // Build: Glass front, plastic frame, glass back

  @Column()
  sim: string; // SIM: Dual SIM (Nano-SIM, dual stand-by) IP53, dust and splash resistant

  @OneToOne(() => Product, {cascade: true, onDelete:"CASCADE"})
  @JoinColumn()
  product: Product;
}
