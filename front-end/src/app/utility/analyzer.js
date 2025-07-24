import RomManager from "./rom";
const opcodes = require('./opcodes.json');

/**
 * Reads the logs against the ROM and verifies if the ROM is Hi or Lo ROM, and reads through the instructions to determine the program flow
 * Ultimately, it will generate information on what the ROM does and how it behaves when played based on these logs.
 * 
 * @param {RomManager} rom The ROM to verify against the logs
 * @param {Array<Object>} logs An array of objects, created from the logs, which contain the CPU registers from the logger utility
 */
export function analyze(rom, logs) {
    if (!Array.isArray(logs)) {
        throw ('The logs passed is not an array! An array is expected, even with size one!');
    }

    if (!rom instanceof RomManager) {
        throw ('The ROM passed was not a type of RomManager! A RomMAnager is required to perform the analysis.')
    }

    console.log('Running analayzer');
    console.log(opcodes);

    //Read both, because we don't know if it's lo or hi yet.
    const loRomResetVector = rom.readWord(0x7FFC);
    const hiRomResetVector = rom.readWord(0xFFFC);

    let loScore = 0;
    let hiScore = 0;

    let loRomPosition = loRomResetVector;
    let hiRomPosition = hiRomResetVector;

    const scoreAdjustments = {
        CLC: (ctx) => {
            console.log(ctx)
            if (ctx.nextMnemonic === 'XCE') {
                console.log('CLC followed by XCE, +2')
                return 2;
            }
            return 1;
        },
        REP: (ctx) => {
            if ((rom.readByte(ctx.address + 1) & 0x08) !== 0) {
                return 1;
            }
            return 0;
        },
        SEI: (ctx) => {
            return 1;
        },
        SEC: (ctx) => {
            if (ctx.nextMnemonic === 'XCE') return -1;
            return 0;
        },
        BRK: (ctx) => {
            return -5;
        },
        WAI: (ctx) => {
            return -5;
        },
        COP: (ctx) => {
            return -5;
        },
        WDM: (ctx) => {
            return -5;
        },
    }

    for (let i = 0; i < 30; i++) {
        const loValue = rom.readByte(loRomPosition);
        const loOpcode = opcodes[loValue];
        const hiValue = rom.readByte(hiRomPosition);
        const hiOpcode = opcodes[hiValue];

        const loCtx = {};
        const hiCtx = {};

        let loScoreAddition = 0;
        let hiScoreAddition = 0;

        loCtx['mnemonic'] = loOpcode.mnemonic; //String opcode, ADC, BCC, BEQ, etc...
        loCtx['nextMnemonic'] = opcodes[rom.readByte(loRomPosition + parseInt(loOpcode.bytes))].mnemonic; //As above
        loCtx['address'] = loRomPosition; //Current position

        hiCtx['mnemonic'] = hiOpcode.mnemonic; //String opcode, ADC, BCC, BEQ, etc...
        hiCtx['nextMnemonic'] = opcodes[rom.readByte(hiRomPosition + parseInt(hiOpcode.bytes))].mnemonic; //As above
        hiCtx['address'] = hiRomPosition; //Current position

        if (scoreAdjustments[loOpcode.mnemonic]) {
            console.log(`loOpcode.mnemonic`, loOpcode.mnemonic)
            loScoreAddition = scoreAdjustments[loOpcode.mnemonic](loCtx);
        }
        if (scoreAdjustments[hiOpcode.mnemonic]) {
            console.log(`hiOpcode.mnemonic`, hiOpcode.mnemonic)
            hiScoreAddition = scoreAdjustments[hiOpcode.mnemonic](hiCtx);
        }
        loScore += loScoreAddition;
        hiScore += hiScoreAddition;

        loRomPosition += parseInt(loOpcode.bytes);
        hiRomPosition += parseInt(hiOpcode.bytes);
    }

    console.log(`loScore: ${loScore}`);
    console.log(`hiScore: ${hiScore}`);
}