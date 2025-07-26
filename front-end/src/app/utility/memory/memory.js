class memory{
    constructor(){
        this.size = 0x1000000; //16MB
        const buffer = new ArrayBuffer(this.size);
        this.memory = new Uint8Array(buffer);
    }

    /**
     * Reads the byte at a given location within the ROM, or undefined if it exceeds the boundry.
     * @param {number} offset The index of the byte to read
     * @returns The value at the requested location, or undefined if it is out of bounds.
     */
    readByte(offset) {
        return offset >= 0 || offset < this.size ? this.memory[offset] : undefined;
    }

    /**
     * Reads the word at the given location. As this reads 2 bytes, it cannot exceed past size - 2, since the second byte will be out of bounds.
     * This reads as epected in little endian format.
     * @param {number} offset The index of the word to read
     * @returns The value of the word at that location, or undefined if it is out of bounds
     */
    readWord(offset) {
        let word = 0x00;
        if (offset < 0 || offset >= this.size - 1) {
            return undefined;
        }
        word = this.memory[offset];
        word += this.memory[offset + 1] << 8;
        return word;
    }

    /**
     * Writes a byte to the ROM. As this is a single byte, it can only write to 255 (0xFF)
     * @param {number} offset The offset to write this byte at
     * @param {number} value The number to write into this byte. Values higher than 1 byte will be truncated
     */
    writeByte(offset, value) {
        if (offset < 0 || offset >= this.memory.length) return;
        this.memory[offset] = value & 0xFF;
    }

    /**
     * Writes a word to a given value. As this is two bytes, it can only write to 65535 (0xFFFF)
     * @param {number} offset The offset to write this word at
     * @param {number} value The number to write into this word. Values higher than 2 bytes will be truncated
     */
    writeWord(offset, value) {
        if (offset < 0 || offset >= this.memory.length - 1) return;
        this.memory[offset] = (value & 0x00FF);
        this.memory[offset + 1] = (value & 0xFF00) >> 8;
    }

    /**
     * Grabs a block of data as a deep copy from a defined section of ROM. This data can then be written back into the ROM with writeBlock.
     * This data is read in little endian format, so car must be taken when modifying directly. You can also create a new instance of this
     * class with the data to handle writes as needed, then use it to copy back into the original data.
     * @param {number} offset Where this block starts in the memory
     * @param {number} size How big the block is, if it extends beyond the data or is <= 0, it will copy the data from offset to end
     * @returns {Uint8Array} The block data as a UInt8Array, undefined if the offset is < 0 or >= size.
     */
    readBlock(offset, size) {
        const shallowCopy = this.memory.subarray(offset, offset + size);
        const deepCopy = shallowCopy.map(value => value);
        return Uint8Array.from(deepCopy);
    }

    /**
     * 
     * @param {number} offset The pffset where this block of data will start
     * @param {UInt8Array} data data to write to the memory
     * @returns 
     */
    writeBlock(offset, data) {
        if (!Array.isArray(data)) return;
        let dataArray = UInt8Array.from(data);
        // let dataArray = Array.isArray(data) ? [...data] : [data];
        if (offset + dataArray.length >= this.memory.length) return;
        for (let i = 0; i < dataArray.length; i++) {
            this.memory[offset + i] = dataArray[i];
        }
    }
}