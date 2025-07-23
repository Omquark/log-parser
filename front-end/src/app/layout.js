'use client'

import { createContext, useState } from "react";
import "./globals.css";
import Header from "./components/Header/Header";

export const UserPrefContext = createContext();

export default function RootLayout({ children }) {

  const preferences = {
    darkMode: false,
  }

  const [prefs, setPrefs] = useState(preferences);

  const setUserPrefs = (userPrefs) => {
    setPrefs(userPrefs);
  }

  return (
    // <html className={`${prefs.darkMode === true ? 'dark' : ''}` + ' dark'} lang="en">
    <UserPrefContext value={{ prefs: prefs, setPrefs: setUserPrefs }}>
      <Header />
      <html className={`${prefs.darkMode ? 'dark' : ''}`}>
        <body className='mt-14 bg-white dark:bg-black'>
          {children}
        </body>
      </html>
    </UserPrefContext>
  );
}
