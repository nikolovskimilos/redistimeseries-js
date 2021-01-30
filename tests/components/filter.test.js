const { Filter } = require('../../index');

const TEST_PARAMS = {
  label1: 'somelabel1',
  label2: 'somelabel1',
  value1: 22,
  value2: 23
};

describe('Filter component tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const { label1, label2, value1, value2 } = TEST_PARAMS;

  it('exists filter', async () => {
    expect(Filter.exists(label1).toString()).toBe(`${label1}!=`);
  });

  it('notExists filter', async () => {
    expect(Filter.notExists(label1).toString()).toBe(`${label1}=`);
  });

  it('equal filter', async () => {
    expect(Filter.equal(label1, value1).toString()).toBe(`${label1}=${value1}`);
  });

  it('notEqual filter', async () => {
    expect(Filter.notEqual(label1, value1).toString()).toBe(`${`${label1}!=${value1}`}`);
  });

  it('in filter', async () => {
    expect(Filter.in(label1, [value1, value2]).toString()).toBe(`${label1}=(${value1},${value2})`);
  });

  it('notIn filter', async () => {
    expect(Filter.notIn(label1, [value1, value2]).toString()).toBe(`${label1}!=(${value1},${value2})`);
  });

  it('exists filter should fail, invalid filter', async () => {
    expect(() => Filter.exists()).toThrow();
  });

  it('notExists filter should fail, invalid filter', async () => {
    expect(() => Filter.notExists()).toThrow();
  });

  it('equal filter should fail, invalid filter', async () => {
    expect(() => Filter.equal()).toThrow();
  });

  it('equal filter should fail, no value', async () => {
    expect(() => Filter.equal(label1)).toThrow();
  });

  it('notEqual filter should fail, invalid filter', async () => {
    expect(() => Filter.notEqual()).toThrow();
  });

  it('notEqual filter should fail, no value', async () => {
    expect(() => Filter.notEqual(label2)).toThrow();
  });

  it('in filter should fail, invalid filter', async () => {
    expect(() => Filter.in()).toThrow();
  });

  it('in filter should fail, no values', async () => {
    expect(() => Filter.in(label1)).toThrow();
  });

  it('in filter should fail, empty values array', async () => {
    expect(() => Filter.in(label1, [])).toThrow();
  });

  it('notIn filter should fail, invalid filter', async () => {
    expect(() => Filter.notIn()).toThrow();
  });

  it('notIn filter should fail, no values', async () => {
    expect(() => Filter.notIn(label1)).toThrow();
  });

  it('notIn filter should fail, empty values array', async () => {
    expect(() => Filter.notIn(label1, [])).toThrow();
  });
});
