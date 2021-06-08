import { WithMinimumRatingPipe } from './with-minimum-rating.pipe';

describe('WithMinimumRatingPipe', () => {
  it('create an instance', () => {
    const pipe = new WithMinimumRatingPipe();
    expect(pipe).toBeTruthy();
  });
});
