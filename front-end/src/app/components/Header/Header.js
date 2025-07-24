'use client'

import { UserPrefContext } from "@/app/layout";
import { useContext, useEffect, useState } from "react";
import { FaRegMoon, FaRegSun } from "react-icons/fa";

export default function Header() {

    const { prefs, setPrefs } = useContext(UserPrefContext);

    return (
        <header className={
            'fixed bg-sky-700 dark:bg-sky-300 h-14 mx-auto top-0 left-0 right-0 z-20 ' +
            'text-slate-300 dark:text-slate-700 '
        }>
            <div className='pb-2 px-2 flex h-full'>
                <div className='my-auto '>
                    <span className='font-bold text-lime-400 dark:text-lime-600'>
                        {'Left Header title'}
                    </span>
                </div>
                <div className='my-auto flex-grow text-center'>
                    <span>
                        Middle header
                    </span>
                </div>
                <div className='my-auto flex-shrink duration-300 flex'>
                    <div className='pt-2'>
                        <button onClick={() => setPrefs({ ...prefs, darkMode: !prefs.darkMode })}>
                            {
                                prefs.darkMode ?
                                    <FaRegSun /> :
                                    <FaRegMoon />
                            }
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}