import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { urlValidator } from './utils/constants';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
describe('UrlValidator', () => {
  it('Url validator generic function false output check(jeldfk)', () => {
    const isValid = urlValidator('jeldfk');
    expect(isValid).toBe(false);
  });
  it('Url validator generic function true output check(http://google.com)', () => {
    const isValid = urlValidator('http://google.com');
    expect(isValid).toBeTruthy();
  });
});
