/**
 * An example context (ctx) which needs to be passed to any instruction in order to execute.
 * Assume these instructions will alter the state of the ctx.
 */
export const sampleCtx = {
    cpu: new cpu65816(),
    memory: new memory(),
}

/**
 * 
 * @param {sampleCtx} ctx The context required to execute this function.
 * See the sampleCtx for details.
 */
export function interruptBRK(ctx) {
    if (ctx.cpu.E) {
        ctx.cpu.PC += 2;
        ctx.memory.writeWord(ctx.cpu.S, ctx.cpu.PC);
        ctx.cpu.S -= 2;
        ctx.cpu.P = ctx.cpu.P | cpu65816.flagMask(1, 'B');
        ctx.memory.writeByte(ctx.cpu.S, ctx.cpu.P);
        ctx.cpu.P = ctx.cpu.P & cpu65816.flagMask(ctx.cpu.E, 'I');
        ctx.cpu.PC = ctx.memory.readWord(0xFFFE);
    } else {
        ctx.memory.writeByte(ctx.cpu.S, ctx.cpu.DB);
        ctx.cpu.S += 1;
        ctx.cpu.PC += 2;
        ctx.memory.writeWord(ctx.cpu.S, ctx.cpu.PC);
        ctx.cpu.S -= 2;
        ctx.memory.writeByte(ctx.cpu.S, ctx.cpu.P);
        ctx.cpu.P = ctx.cpu.P | cpu65816.flagMask(ctx.cpu.E, 'I');
        ctx.cpu.DB = 0;
        ctx.cpu.PC = ctx.memory.readWord(0xFFE6);
    }
}