'use client'

import { useContext, useState } from "react";
import FileSelect from "./components/File/FileSelect";
import { DataContext } from "./context/DataContext";
import Button from "./components/Button/Button";
import { analyze } from "./utility/analyzer";

export default function Home() {

  const [logsUpload, setLogsUpload] = useState(false);
  const [romUpload, setRomUpload] = useState(false);

  const { logs, setLogs, rom, setRom } = useContext(DataContext);

  const readRom = (event) => {
    const input = event.target;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const rom = new Uint8Array(e.target.result);
          setRom(rom);
          setRomUpload(true);
        }
      }

      reader.readAsArrayBuffer(file);
    }
  }

  const readLogs = (event) => {
    const input = event.target;
    const logs = [];

    if (input.files && input.files.length > 0) {

      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        const reader = new FileReader();

        reader.onload = (e) => {
          if (e.target?.result) {
            let log = {};
            let rawLog;
            try {
              rawLog = JSON.parse(e.target.result);
            } catch (err) {
              console.log(err);
            }

            if (Array.isArray(rawLog)) {
              rawLog.forEach(logEntry => {
                log[logEntry.PC] = logEntry;
              })
            }
            logs.push(log);
          }
        }

        reader.onloadend = (e) => {
          if (!e.target.error){
            setLogsUpload(true);
            setLogs(logs);
          }
        }
        reader.readAsText(file);
      }
    }
  }

  const runAnalyze = () => {
    analyze(rom, logs);
  }

  return (
    <div className='w-1/12 p-2'>
      <FileSelect id={'log'} onChange={(event) => readLogs(event)} accept='.log' multiple>
        {logsUpload ? 'Logs uploaded' : 'Select logs'}
      </FileSelect>
      <FileSelect id={'rom'} onChange={(event) => readRom(event)} accept='.smc'>
        {romUpload ? 'ROM uploaded' : 'Select ROM'}
      </FileSelect>
      <Button onClick={runAnalyze} id='analayze-button' role='button' disabled={!romUpload && !logsUpload}>
        Analyze
      </Button>
    </div>
  );
}
