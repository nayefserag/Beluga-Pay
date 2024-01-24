import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
describe('UserController (e2e)', () => {
  let app: INestApplication;
  let httpServer;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
 
    app = moduleFixture.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/user/create (POST)', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'user@example.com',
      password: 'password123',
    };

    const response = await request(httpServer)
      .post('/user/create')
      .send(newUser)
      .expect(201);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('User created successfully');
  });

  it('/user/getuser (GET)', async () => {
    const emailDto = {
      email: 'user@example.com',
    };

    const response = await request(httpServer)
      .get('/user/getuser')
      .send(emailDto)
      .expect(200);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('User fetched successfully');
  });

  it('/user/updateuser (PATCH)', async () => {
    const updateUserDto = {
      email: 'user@example.com',
      name: 'John Doe 2',
    };

    const response = await request(httpServer)
      .patch('/user/updateuser')
      .send(updateUserDto)
      .expect(200);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('User updated successfully');
  });

  it('/user/deleteuser (DELETE)', async () => {
    const emailDto = {
      email: 'user@example.com',
    };

    const response = await request(httpServer)
      .delete('/user/deleteuser')
      .send(emailDto)
      .expect(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('User deleted successfully');
  });
});
