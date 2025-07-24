'use client'

import { createContext, useState } from "react";
import "./globals.css";
import Header from "./components/Header/Header";
import Data, { DataContext } from "./context/DataContext";

export const UserPrefContext = createContext();

export default function RootLayout(props) {

  const { children } = props;

  const preferences = {
    darkMode: false,
  }

  const [prefs, setPrefs] = useState(preferences);

  const setUserPrefs = (userPrefs) => {
    setPrefs(userPrefs);
  }

  return (
    // <html className={`${prefs.darkMode === true ? 'dark' : ''}` + ' dark'} lang="en">
    <UserPrefContext.Provider value={{ prefs: prefs, setPrefs: setUserPrefs }}>
      <Data>
        <html className={`${prefs.darkMode ? 'dark' : ''}`}>
          <body className='mt-14 bg-white dark:bg-black'>
            <Header />
            {children}
          </body>
        </html>
      </Data>
    </UserPrefContext.Provider>
  );
}
