const { sampleCtx } = require("../opcodes/interrupts");
const opcodes = require('../opcodes.json');

/**
 * Contains the addressing modes used by the 65816.
 * This is used to resolve an address used by any addressing mode.
 * Pass in a context and the addressing mode to determine the resolved address.
 */

/**
 * Resolves the address of an immediate mode addressing
 * This mode the address is the immediate following code
 * i.e LDA #$00 would load $00 into A
 * @param {sampleCtx} ctx Context including a memory map and CPU state
 * @returns The address of the expected location of the value. You must read this location
 * for the proper value
 */
function immediateAddressing(ctx) {
    return ctx.cpu.P & cpu65816.flagMask('M') !== 0 ? ctx.memory.readByte(ctx.cpu.PC + 1) : ctx.memory.readWord(ctx.cpu.PC + 1)
}

/**
 * Resolves addresses which use the Absolute addressing mode
 * This mode resolves an address within the same bank for control statements
 * and resolves addresses using the DB register for data statements
 * @param {sampleCtx} ctx Context including a memory map and CPU state
 * @returns The resolved address of the expected location of the value
 */
function absoluteAddressing(ctx) {
    return ctx.cpu.P & cpu65816.flagMask('M') !== 0 ?
        ctx.memory.readByte(ctx.cpu.PC + ((opcodes.type === "control" ? ctx.cpu.PB : ctx.cpu.DB) << 16)) :
        ctx.memory.readWord(ctx.cpu.PC + ((opcodes.type === "control" ? ctx.cpu.PB : ctx.cpu.DB) << 16));
}
/**
 * Resolves an address based on Direct Page mapping.
 * @param {sampleCtx} ctx Context including a memory map and CPU state
 * @returns The resolved address of the expected location of the value
 */
function directPageAddressing(ctx) {
    return ctx.cpu.DP + ctx.memory.readByte(ctx.cpu.PC + 1);
}

/**
 * Resolves an address using indexing. Covers both indexes as needed as they behave the same.
 * This mode resolves based on the operand and the PBR, then adds the index to determine the location.
 * This can use the X or Y index as a displacer.
 * @param {sampleCtx} ctx Context including a memory map and CPU state
 * @param {boolean} x Determines if the indexing is based off X register. False will use the Y register
 * @returns The resolved address of the expected location of the value
 */
function absoluteIndexedAddressing(ctx, x = true) {
    return (ctx.cpu.DB << 16) +
        ctx.memory.readWord(ctx.cpu.PC + 1) +
        (x ? ctx.cpu.X : ctx.cpu.Y) & (ctx.cpu.P | cpu65816.flagMask('X') === 0 ? 0xFFFF : 0xFF);
}

/**
 * Resolves an address using the Direct page and indexing from either index register.
 * This mode adds the operand to the DP registerm then uses an index register for offset.
 * @param {sampleCtx} ctx Context including a memory map and the CPU state
 * @param {boolean} x Determines if the indexing is based off X register. False will use the Y register
 * @returns The resolved address of the expected location of the value
 */
function directPageIndexedAddressing(ctx, x) {
    return (ctx.cpu.DP + ctx.memory.readByte(ctx.cpu.PC + 1)) +
        (x ? ctx.cpu.X : ctx.cpu.Y) & (ctx.cpu.P | cpu65816.flagMask('X') === 0 ? 0xFFFF : 0xFF);
}

/**
 * !!!!This addressing mode returns the value, not the resolved address!!!!
 * Returns the value in the accumulator as it does not have a physical address in memory
 * @param {sampleCtx} ctx Context including a memory map and the CPU state
 * @returns The value in the Accumulator as it does not have a physical address
 */
function accumulatorAddressing(ctx) {
    return ctx.cpu.A & (ctx.cpu.P & cpu65816.flagMask('M') === 0 ? 0xFFFF : 0xFF);
}

/**
 * Resolved an address using the Direct page with the operand
 * which points to an address in bank 0, this in turn is combined with the DBR
 * to resolve the address.
 * @param {sampleCtx} ctx Context including a memory map and CPU state
 * @returns The resolved address of the expected location of the value
 */
function directPageIndirectAddressing(ctx) {
    return (ctx.cpu.DB << 16) + ctx.memory.readWord(ctx.cpu.DP + ctx.memory.readByte(ctx.cpu.PC + 1));
}

/**
 * Resolves an address using the absolute value of the next 3 bytes
 * This determines bank, page, and address.
 * @param {sampleCtx} ctx Context including a memory map and CPU state
 * @returns The resolved address of the expected location of the value
 */
function absoluteLongAddressing(ctx) {
    return ctx.memory.readByte(ctx.cpu.PC + 1) + (ctx.memory.readWord(ctx.cpu.PC + 2) << 8);
}

/**
 * Resolves an address using the absolute value of the next 3 bytes, added to the X register.
 * This mode does not use the Y register.
 * @param {sampleCtx} ctx Context including a memory map and CPU state
 * @returns The resolved address of the expected location of the value
 */
function absoluteLongIndexedXAddressing(ctx) {
    return (ctx.memory.readByte(ctx.cpu.PC + 1) + (ctx.memory.readWord(ctx.cpu.PC + 2) << 8) +
        ctx.cpu.X & (ctx.cpu.P & cpu65816.flagMask('X') === 0 ? 0xFFFF : 0xFF));
}

/**
 * Creates a long (24-bit) address from aa direct page indirect address
 * Combines the operand with the DP, and reads that value as a long address for the value location
 * @param {sampleCtx} ctx Context including a memory map and CPU state
 * @returns The resolved address of the expected location of the value
 */
function directPageIndirectLongAddressing(ctx) {
    let effectiveAddress = (ctx.memory.readByte(ctx.cpu.PC) + ctx.cpu.DP);
    return (ctx.memory.readByte(effectiveAddress + 2) << 16) + ctx.memory.readWord(effectiveAddress);
}

/**
 * Used in block moving opcodes (MVN and MVP).
 * This will return the resolved address of the source block.
 * Note you must call blockMoveAddressingDestination to determine the destination
 * This will pull the source bank from the instruction, and combine it with 
 * the X register to determine the source
 * @param {sampleCtx} ctx Context including a memory map and CPU state
 * @returns The location address of the expected location of the value
 */
function blockMoveAddressingSource(ctx) {
    return (ctx.memory.readByte(ctx.cpu.PC + 1) << 16) +
        (ctx.cpu.X & (ctx.cpu.P & cpu65816.flagMask('X') === 0 ? 0xFFFF : 0xFF))
}

/**
 * Used in block moving opcodes (MVN and MVP).
 * This will return the resolved address of the destination block.
 * Note you must call blockMoveAddressingSource to determine the source
 * This will pull the destination bank from the instruction, and combine it with 
 * the Y register to determine the destination
 * @param {sampleCtx} ctx Context including a memory map and CPU state
 * @returns The location address of the expected location of the value
 */
function blockMoveAddressingDestination(ctx) {
    return (ctx.memory.readByte(ctx.cpu.PC + 2) << 16) +
        (ctx.cpu.Y & (ctx.cpu.P & cpu65816.flagMask('X') === 0 ? 0xFFFF : 0xFF));
}

/**
 * Resolves an address using the Direct page with the instruction operand
 * then adds that value to the Y register to determine the location of the value desired.
 * @param {sampleCtx} ctx Context including a memory map and  CPU state
 * @returns The location address of the expected location of the value
 */
function directPageIndirectIndexedYAddressing(ctx) {
    return (ctx.memory.readByte(ctx.cpu.PC + 1) + ctx.cpu.DP) +
        (ctx.cpu.Y & (ctx.cpu.P & cpu65816.flagMask('X') === 0 ? 0xFFFF : 0xFF));
}

/**
 * Resolves an address by using the direct page with the X register
 * then adds that value to the operand to determine the location to read from for the value
 * @param {sampleCtx} ctx Context including a memory map and CPU state
 * @returns The resolved address of the expected location of the value
 */
function directPageIndexedIndirect(ctx) {
    let indirectPointer = ctx.cpu.X & (ctx.cpu.P & cpu65816.flagMask('X') === 0 ? 0xFFFF : 0xFF) +
        ctx.cpu.DP + ctx.memory.readByte(ctx.cpu.PC + 1);
    return (ctx.cpu.DB << 16) + ctx.memory.readWord(indirectPointer);
}

/**
 * Resolves an address by using a 2 byte operand and adding it with the X register
 * that value then is read from memory to find the effective address. Also applies the DBR
 * @param {sampleCtx} ctx Context including a memory map and CPU state
 * @returns The resovled address of the expected location of the value
 */
function absoluteIndexedIndirect(ctx) {
    return (ctx.cpu.PB << 16) +
        memory.readWord(ctx.memory.readWord(ctx.cpu.PC + 1) +
            (ctx.cpu.X & (ctx.cpu.P & cpu65816.flagMask('X') === 0 ? 0xFFFF : 0xFF)));
}

/**
 * Resolves an address by adding a 1 byte operand to the DP to find the 3 byte indirect address
 * It then adds the Y register to this value for the effective address.
 * @param {sampleCtx} ctx Context including a memory map and CPU state
 * @returns The resolved address of the expected location of the value
 */
function directPageIndirectLongIndexedY(ctx) {
    let indirectPointer = ctx.memory.readByte(ctx.cpu.PC + 1) + ctx.cpu.DP;
    let indirectAddress = (memory.readByte(indirectPointer + 2) << 16) + memory.readWord(indirectPointer);
    return indirectAddress + (ctx.cpu.Y & (ctx.cpu.P & cpu65816.flagMask('X') ? 0xFFFF : 0xFF));
}

/**
 * Resolves an address by adding the operand to the stack pointer.
 * Generally, push some values on the stack, then use this addressing mode.
 * This mode does not effect the stack
 * @param {sampleCtx} ctx Context including a memory map and CPU state
 * @returns The resolved address of the expected location of the value
 */
function stackRelative(ctx) {
    return ctx.memory.readByte(ctx.sampleCtx.PC) + ctx.cpu.S;
}

/**
 * Resolves an address by adding the stack pointer to the operand,
 * that value is used to pull the indirect address, which is added to the Y register
 * and DBR to get a full 24-bit address
 * @param {sampleCtx} ctx Context including a memory map and CPU state
 * @returns The resolved address of the expected location of the value
 */
function stackRelativeIndirectIndexedYAddressing(ctx) {
    let indirectPointer = ctx.memory.readWord(ctx.cpu.PC + 1 + ctx.cpu.S);
    return (ctx.cpu.Y & (ctx.cpu.P & cpu65816.flagMask('X') === 0 ? 0xFFFF : 0xFF) + (ctx.cpu.DB << 16)) + indirectPointer;
}

/**
 * Resolves an address by using the operands to read 2 bytes from memory,
 * using that value to read from that address and adding it to the Program Bank
 * @param {sampleCtx} ctx Context including a memory map and CPU state
 * @returns The resovled address of the expected location of the value
 */
function absoluteIndirectAddressing(ctx) {
    return memory.readWord(ctx.memory.readWord(ctx.cpu.PC + 1)) + (ctx.cpu.PB << 16)
}

/**
 * Resolves an address by using the operands to read 3 bytes from the memory location
 * This data read is used to get the absolute address
 * @param {sampleCtx} ctx Context including a memory map and CPU state
 * @returns The resolved address of the expected location of the value
 */
function absoluteIndirectLongAddressing(ctx) {
    let indirectPointer = ctx.memory.readWord(ctx.cpu.PC + 1) + (ctx.memory.readByte(ctx.cpu.PC + 3) << 16);
    return ctx.memory.readWord(indirectPointer)
}