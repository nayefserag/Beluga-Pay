import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AccountController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('POST /account/create', async () => {
    const createAccountDto = {
      customerName: 'Nof',
      balance: 100,
      accountType: 'savings',
      phoneNumber: '01016022217',
      email: 'nayf@example.com',
    };

    const response = await request(app.getHttpServer())
      .post('/account/create')
      .send(createAccountDto)
      .expect(201);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('status', 201);
  });

  it('GET /account/getbyid/:id', async () => {
    const accountId = '65b00e91bca44e96902aa68e';

    const response = await request(app.getHttpServer())
      .get(`/account/getbyid/${accountId}`)
      .expect(200);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('status', 200);
    expect(response.body).toHaveProperty('data');
  });

  afterAll(async () => {
    await app.close();
  });
});
