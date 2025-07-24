export default function Button(props) {
    const { children, onClick, className, id, role, disabled } = props;

    return (
        <div className=''>
            <button
                className={
                    'p-1 mx-auto my-1 hover:cursor-pointer w-full ' +
                    'border-1 border-b-2 border-r-2 border-black rounded-md ' +
                    'bg-stone-400 hover:bg-stone-200 ' +
                    'dark:bg-stone-600 dark:hover:bg-stone-400 ' + 
                    'text-white hover:text-black ' + className
                }
                onClick={onClick}
                id={id}
                type={role ? role : 'button'}
                disabled={disabled}>
                {children}
            </button>
        </div>
    )
}