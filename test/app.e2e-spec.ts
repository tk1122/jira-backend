import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  // @ts-ignore
  let app;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // it('/ (GET)', () => {
  //   // @ts-ignore
  //   return request(app.getHttpServer())
  //     .get('/')
  //     .expect(200)
  //     .expect('Hello World!');
  // });
});
