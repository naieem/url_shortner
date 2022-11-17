import { urlValidator } from './utils/constants';

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