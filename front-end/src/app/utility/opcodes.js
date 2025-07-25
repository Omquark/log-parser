/**
 * ctx: {
 *  cpu: cpu65816,
 *  memory: memory
 * }
 */
const opcodes = {
    0: {
        value: 0,
        mnemonic: 'BRK',
        bytes: 2,
        fullName: 'Software Break',
        addressingMode: 'Stack/Interrupt',
        func: (ctx) => {
            
        }
    }
}