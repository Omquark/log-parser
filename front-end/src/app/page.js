'use client'

import FileSelect from "./components/File/FileSelect";

export default function Home() {

  const readFile = (event) => {
    const input = event.target;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const rom = new Uint8Array(e.target.result);
          validateRomCRC32(rom);
          fileLoaded = true;
        }
      }

      reader.readAsArrayBuffer(file);
    }
  }

  return (
    <div>
      <FileSelect onChange={(event) => readFile(event)}>
        {'Select File'}
      </FileSelect>
    </div>
  );
}
