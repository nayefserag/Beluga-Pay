import { LoggingInterceptor } from "./loging.interceptor";

describe('LogingInterceptor', () => {
  it('should be defined', () => {
    expect(new LoggingInterceptor()).toBeDefined();
  });
});
