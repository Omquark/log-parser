import { createContext, useState } from "react";
import RomManager from "../utility/rom";

export const DataContext = createContext();

export default function Data(props) {

    const [rom, setRom] = useState({})
    const [logs, setLogs] = useState([{}]);

    const setRomData = (data) => {
        const romData = new RomManager(data);
        setRom(romData);
    }

    const { children } = props;

    return (
        <DataContext.Provider value={{ rom: rom, setRom: setRomData, logs: logs, setLogs: setLogs }}>
            {children}
        </DataContext.Provider>
    );
}