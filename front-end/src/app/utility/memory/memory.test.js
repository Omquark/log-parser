const { memory } = require("./memory");

describe('Test the memory for init to all 0', () => {
  it.skip('should be all 0\'s', () => {
    const testMemory = new memory();
    let testVal = 0x01;
    expect(testMemory).toHaveProperty('size');
    expect(testMemory.size).toEqual(0x1000000);

    testMemory.size = 0;
    expect(testMemory.size).not.toEqual(0x00);
    for (let i = 0; i < testMemory.size; i++) {
      testVal = testMemory.readByte(i);
      expect(testVal).toEqual(0);
    }
  });

  it('should write and read words in little endian style', () => {
    const testMemory = new memory();
    let testVal = 0x215665;
    let testByte = 0x40;
    testMemory.writeWord(0x100, testVal);
    testByte = testMemory.readByte(0x100);
    expect(testByte).toEqual(0x65);
    testByte = testMemory.readByte(0x101);
    expect(testByte).toEqual(0x56);
    testByte = testMemory.readByte(0x102);
    expect(testByte).toEqual(0x00);
    testVal = testMemory.readWord(0x100);
    expect(testVal).toEqual(0x5665);
    expect(testVal).not.toEqual(0x215665);
  });

  it('should write blocks in exact format', () => {
    const testMemory = new memory();
    let testByte = 0x20;
    let size = 0x10;
    let testBlock = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
      testBlock[i] = i;
    }
    testMemory.writeBlock(0x200, testBlock);
    testMemory.readBlock(0x200);
    for (let i = 0; i < size; i++) {
      testByte = testMemory.readByte(0x200 + i);
      expect(testByte).toEqual(i);
    }

    testBlock = testMemory.readBlock(0x200, 0x10);
    for (let i = 0; i < 0x10; i++) {
      expect(testBlock[i]).toEqual(i);
    }
  });
});