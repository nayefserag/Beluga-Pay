import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('TransactionController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('POST /transaction/send-money/via-phone', async () => {
    const transactionDto = {
      via: 'Phone',
      description: 'test',
      amount: 100,
      recipient: '01016022217',
      sender: '01000856582',
    };

    const response = await request(app.getHttpServer())
      .post('/transaction/send-money/via-phone')
      .send(transactionDto)
      .expect(201);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('status', 201);
    expect(response.body).toHaveProperty('data');
  });

  it('POST /transaction/send-money/via-account-number', async () => {
    const transactionDto = {
      via: 'phone',
      description: 'test',
      amount: 100,
      recipient: '01016022217',
      sender: '01000856582',
    };

    const response = await request(app.getHttpServer())
      .post('/transaction/send-money/via-account-number')
      .send(transactionDto)
      .expect(201);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('status', 201);
    expect(response.body).toHaveProperty('data');
  });

  it('PATCH /transaction/accept-transaction', async () => {
    const transactionId = 'id123';

    const response = await request(app.getHttpServer())
      .patch('/transaction/accept-transaction')
      .send(transactionId)
      .expect(200);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('status', 200);
    expect(response.body).toHaveProperty('data');
  });

  afterAll(async () => {
    await app.close();
  });
});
