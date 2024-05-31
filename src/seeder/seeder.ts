import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeederModule } from './seeder.module';
import { SeederService } from './seeder.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const seederService = appContext.select(SeederModule).get(SeederService);
  await seederService.seed();
  await appContext.close();
}

bootstrap()
  .then(() => {
    console.log('Seeding complete!');
    process.exit();
  })
  .catch(error => {
    console.error('Seeding failed!', error);
    process.exit(1);
  });
