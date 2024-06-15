import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Product } from '../product.entity';

@Entity()
export class SpecsSmartphone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  brand: string; // Brand

  @Column({ nullable: true })
  model: string; // Model

  @Column({ nullable: true })
  company: string; // Company

  @Column({ nullable: true })
  os: string; // OS: Android 14, HyperOS

  @Column({ nullable: true })
  chipset: string; // Chipset: Qualcomm SM4450 Snapdragon 4+ Gen 2 (4 nm)

  @Column({ nullable: true })
  cpu: string; // CPU: Octa-core (2x2.3 GHz Cortex-A78 & 6x1.95 GHz Cortex-A55)

  @Column({ nullable: true })
  gpu: string; // GPU: Adreno 613

  @Column({ nullable: true })
  cardSlot: boolean; // CardSlot: No

  @Column({ nullable: true })
  internal: string; // Internal: 128GB 6GB RAM, 128GB 8GB RAM, 256GB 8GB RAM, 256GB 12GB RAM, 512GB 12GB RAM UFS 2.2

  @Column({ nullable: true })
  dualCamera: string; // Dual: 50 MP, f/1.8, (wide), 1/2.76", 0.64µm, PDAF; 2 MP, f/2.4, (macro)

  @Column({ nullable: true })
  features: string; // Features: LED flash, HDR

  @Column({ nullable: true })
  dualVideo: string; // DualVideo: 1080p@30fps

  @Column({ nullable: true })
  singleCamera: string; // Single: 8 MP, (wide), 1/4.0", 1.12µm

  @Column({ nullable: true })
  singleVideo: string; // SingleVideo: 1080p@30fps

  @Column({ nullable: true })
  loudspeaker: boolean; // Loudspeaker: Yes

  @Column({ nullable: true })
  wlan: string; // WLAN: Wi-Fi 802.11 a/b/g/n/ac, dual-band

  @Column({ nullable: true })
  bluetooth: string; // Bluetooth: 5.3, A2DP, LE

  @Column({ nullable: true })
  positioning: string; // Positioning: GPS, GLONASS, GALILEO, BDS

  @Column({ nullable: true })
  nfc: boolean; // NFC: Yes

  @Column({ nullable: true })
  infraredPort: boolean; // InfraredPort: Yes

  @Column({ nullable: true })
  radio: boolean; // Radio: No

  @Column({ nullable: true })
  usb: string; // USB: USB Type-C

  @Column({ nullable: true })
  batteryType: string; // batteryType: 5030 mAh, non-removable

  @Column({ nullable: true })
  charging: string; // Charging: 33W wired

  @Column({ nullable: true })
  screenType: string; // ScreenType: IPS LCD, 120Hz, 550 nits

  @Column({ nullable: true })
  screenSize: string; // ScreenSize: 6.79 inches, 109.5 cm2 (~85.1% screen-to-body ratio)

  @Column({ nullable: true })
  resolution: string; // Resolution: 1080 x 2460 pixels (~396 ppi density)

  @Column({ nullable: true })
  dimensions: string; // Dimensions: 168.6 x 76.3 x 8.2 mm (6.64 x 3.00 x 0.32 in)

  @Column({ nullable: true })
  weight: string; // Weight: 205 g (7.23 oz)

  @Column({ nullable: true })
  build: string; // Build: Glass front, plastic frame, glass back

  @Column({ nullable: true })
  sim: string; // SIM: Dual SIM (Nano-SIM, dual stand-by) IP53, dust and splash resistant

  @OneToOne(() => Product, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  product: Product;
}
