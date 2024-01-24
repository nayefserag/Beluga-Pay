import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('BillsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('POST /bills/create', async () => {
    const createBillDto = {
      amount: 100,
      customerName: 'Nayf',
      paymentMethod: 'phone',
      customerPhone: '01016022217',
    };

    const response = await request(app.getHttpServer())
      .post('/bills/create')
      .send(createBillDto)
      .expect(201);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('status', 201);
    expect(response.body).toHaveProperty('data');
  });

  it('GET /bills', async () => {
    const searchBillsDto = {
      customerPhone: '01016022217',
    };

    const response = await request(app.getHttpServer())
      .get('/bills')
      .send(searchBillsDto)
      .expect(200);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('status', 200);
    expect(response.body).toHaveProperty('bills');
  });

  it('GET /bills/:billId', async () => {
    const billId = '65ae551c2851ab10b217fb96';

    const response = await request(app.getHttpServer())
      .get(`/bills/${billId}`)
      .expect(200);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('status', 200);
    expect(response.body).toHaveProperty('bills');
  });

  it('PATCH /bills/payBill/:id', async () => {
    const billId = '65ae551c2851ab10b217fb96';
    const accountId = '65b00e91bca44e96902aa68e';

    const response = await request(app.getHttpServer())
      .patch(`/bills/payBill/${billId}`)
      .send({ accountId })
      .expect(200);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('status', 200);
    expect(response.body).toHaveProperty('bill');
  });

  afterAll(async () => {
    await app.close();
  });
});
