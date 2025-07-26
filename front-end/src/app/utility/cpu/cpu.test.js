const { cpu65816 } = require("./cpu");

describe('Test the registers and make sure they are initialized to 0 and are present', () => {
    it('create the CPU and make sure registers are 0 and are present', () => {
        const testCPU = new cpu65816();
        expect(Object.keys(testCPU).length).toEqual(11);
        expect(testCPU.A).toEqual(0);
        expect(testCPU.X).toEqual(0);
        expect(testCPU.Y).toEqual(0);
        expect(testCPU.PC).toEqual(0);
        expect(testCPU.DB).toEqual(0);
        expect(testCPU.DP).toEqual(0);
        expect(testCPU.P).toEqual(0);
        expect(testCPU.E).toEqual(0);
        expect(testCPU.S).toEqual(0);
        expect(testCPU.PB).toEqual(0);
        expect(testCPU.cycles).toEqual(0);
    });
});

describe('Test to pull the correct mask for any given P value', () => {
    it('should mask to the correct value for any given P string', () => {
        let flagMask = cpu65816.flagMask('M');
        expect(flagMask).toEqual(0x20);
        flagMask = cpu65816.flagMask('M', true);
        expect(flagMask).toEqual(0);
        flagMask = cpu65816.flagMask('B', true);
        expect(flagMask).toEqual(0x10);
        flagMask = cpu65816.flagMask('NVZC', false);
        expect(flagMask).toEqual(0xC3);
        flagMask = cpu65816.flagMask('NVBDIZC', true);
        expect(flagMask).toEqual(0xDF);
        flagMask = cpu65816.flagMask('NVMXDIZC', false);
        expect(flagMask).toEqual(0xFF);
        flagMask = cpu65816.flagMask('CZIDXMVN', false);
        expect(flagMask).toEqual(0xFF);
        flagMask = cpu65816.flagMask('QWERTYUOPLKJHGFSAB', false);
        expect(flagMask).toEqual(0x00);
        flagMask = cpu65816.flagMask('QWERTYUOPLKJHGFSAB', true);
        expect(flagMask).not.toEqual(0x00);
    });

    it('should give a string of correct P flags for any value < 0xFF', () => {
        let flagUnmask = cpu65816.flagUnmask(0x20, false);
        expect(flagUnmask).toMatch(/M/);
        flagUnmask = cpu65816.flagUnmask(0x10, true);
        expect(flagUnmask).toMatch(/B/);
        flagUnmask = cpu65816.flagUnmask(0x30, false);
        expect(flagUnmask).toMatch(/^[MX]{2}$/);
        flagUnmask = cpu65816.flagUnmask(0xFF, false);
        expect(flagUnmask).toMatch(/^[NVMXZIDC]{8}$/);
        flagUnmask = cpu65816.flagUnmask(0xDF, true);
        expect(flagUnmask).toMatch(/^[NVBDIZC]{7}$/);
    });

    it('should be able to take a value mask and unmask with the same result', () => {

    });
});