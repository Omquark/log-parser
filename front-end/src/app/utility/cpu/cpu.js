class cpu65816 {
    constructor() {
        this.A = 0;
        this.X = 0;
        this.Y = 0;
        this.PC = 0;
        this.DB = 0;
        this.DP = 0;
        this.P = 0;
        this.E = 0;
        this.S = 0;
        this.PB = 0;
        this.cycles = 0;
    }

    /**
     * Returns an 8-bit value which can be used for the P register.
     * The string supplied can contain any combination of flags contained within the P register.
     * The E flag is not a part of the P register.
     * In order : E === 1 : NV-BDIZC
     *            E === 0 : NVMXDIZC
     * @param {String} flags The flags to check for
     * @param {boolean} e The state of the E flag. 1 = emulation on, 0 = emulation off
     */
    static flagMask(flags, e = false) {
        const E1 = { N: 0x80, V: 0x40, /*nil: 0x20,*/ B: 0x10, D: 0x08, I: 0x04, Z: 0x02, C: 0x01 };
        const E0 = { N: 0x80, V: 0x40, M: 0x20, X: 0x10, D: 0x08, I: 0x04, Z: 0x02, C: 0x01 };
        let result = 0x00;

        for (let i = 0; i < flags.length; i++) {
            let flag = flags.charAt(i);
            let value = e ? E1[flag] : E0[flag];
            if (value && value != 0x00) result = result | value;
        }

        return result;
    }

    /**
     * Converts the flags of P into a number, which can be used for the P value.
     * Please not the E flag is not part of P
     * @param {boolean} e State of the E flag
     * @param {Number} p The value of the P register
     */
    static flagUnmask(p, e = false) {
        const E1 = { 0x80: 'N', 0x40: 'V', /*0x20: 'nil',*/ 0x10: 'B', 0x08: 'D', 0x04: 'I', 0x02: 'Z', 0x01: 'C' };
        const E0 = { 0x80: 'N', 0x40: 'V', 0x20: 'M', 0x10: 'X', 0x08: 'D', 0x04: 'I', 0x02: 'Z', 0x01: 'C' };

        let result = "";
        let workingObject = e ? E1 : E0;
        Object.keys(workingObject).forEach(key => {
            if ((p & key) !== 0x00) {
                result = result.concat(workingObject[key]);
            }
        });

        return result;
    }
}

module.exports = { cpu65816 }