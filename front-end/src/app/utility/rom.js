/**
 * Essentially just a wrapper for the UInt8Array class which is designed to read and write data
 * Reading and writing a word will do this in little endian. Bytes aren't effected, but can be read/written
 */
export default class RomManager {
    /**
     * 
     * @param {Uint8Array} romData The rom data. This is expected to be exactly 3145728 in size for the default ROM, 
     * but this can be used to edit copies as well
     */
    constructor(romData) {
        this.romData = romData;
        this.size = this.romData.length;
        this.loaded = this.romData.length > 0;
    }

    /**
     * Reads the byte at a given location within the ROM, or undefined if it exceeds the boundry.
     * @param {number} offset The index of the byte to read
     * @returns The value at the requested location, or undefined if it is out of bounds.
     */
    readByte(offset) {
        return offset >= 0 || offset < this.size ? this.romData[offset] : undefined;
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
        word = this.romData[offset];
        word += this.romData[offset + 1] << 8;
        return word;
    }

    /**
     * Writes a byte to the ROM. As this is a single byte, it can only write to 255 (0xFF)
     * @param {number} offset The offset to write this byte at
     * @param {number} value The number to write into this byte. Values higher than 1 byte will be truncated
     */
    writeByte(offset, value) {
        if (offset < 0 || offset >= this.romData.length) return;
        this.romData[offset] = value & 0xFF;
    }

    /**
     * Writes a word to a given value. As this is two bytes, it can only write to 65535 (0xFFFF)
     * @param {number} offset The offset to write this word at
     * @param {number} value The number to write into this word. Values higher than 2 bytes will be truncated
     */
    writeWord(offset, value) {
        if (offset < 0 || offset >= this.romData.length - 1) return;
        this.romData[offset] = (value & 0x00FF);
        this.romData[offset + 1] = (value & 0xFF00) >> 8;
    }

    /**
     * Grabs a block of data as a deep copy from a defined section of ROM. This data can then be written back into the ROM with writeBlock.
     * This data is read in little endian format, so car must be taken when modifying directly. You can also create a new instance of this
     * class with the data to handle writes as needed, then use it to copy back into the original data.
     * @param {number} offset Where this block starts in the ROMData
     * @param {number} size How big the block is, if it extends beyond the data or is <= 0, it will copy the data from offset to end
     * @returns {Uint8Array} The block data as a UInt8Array, undefined if the offset is < 0 or >= size.
     */
    readBlock(offset, size) {
        const shallowCopy = this.romData.subarray(offset, offset + size);
        const deepCopy = shallowCopy.map(value => value);
        return Uint8Array.from(deepCopy);
    }

    /**
     * 
     * @param {number} offset The offset where this block of data will start
     * @param {UInt8Array} data The data to write back into the rom
     * @returns 
     */
    writeBlock(offset, data) {
        if (!Array.isArray(data)) return;
        let dataArray = UInt8Array.from(data);
        // let dataArray = Array.isArray(data) ? [...data] : [data];
        if (offset + dataArray.length >= this.romData.length) return;
        for (let i = 0; i < dataArray.length; i++) {
            this.romData[offset + i] = dataArray[i];
        }
    }
}