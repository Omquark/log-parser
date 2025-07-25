const { sampleCtx } = require("./interrupts");

/**
 * 
 * @param {sampleCtx} ctx The context required to execute this operation
 */
export function immediateADC(ctx) {

    let cycles = 2;
    if (ctx.cpu.P & cpu65816.flagMask(0, 'D') !== 0) { //Decimal mode
        cycles += 1;
        const addDecimalValue = (memoryLocation) => {
            let result = 0;
            let carry = 0;
            let aLowNibble = ctx.cpu.A & 0x0F;
            let aHighNibble = ctx.cpu.A & 0xF0;
            let addend = ctx.memory.readByte(memoryLocation);

            let tempResult = aLowNibble + (addend & 0x0F);
            if (tempResult >= 0x0A) {
                tempResult += 0x06;
                carry = 1;
            }
            result = tempResult;

            tempResult = aHighNibble + (addend & 0xF0);
            if (tempResult >= 0xA0) {
                tempResult += 0x60;
                if (carry === 1) tempResult += 0x10;
            }
            result += tempResult;
            if (carry) {
                tempResult += 0x100;
            }

            return result;
        }

        let result = addDecimalValue(ctx.cpu.PC + 1);
        if (ctx.cpu.P & cpu65816.flagMask('M') === 0x00) {
            cycles += 1;
            result += addDecimalValue(ctx.cpu.PC + 2);
        }
    }
}