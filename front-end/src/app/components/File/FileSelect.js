export default function FileSelect(props) {

    const { onChange, children, accept, multiple, id } = props;

    const openFileDialog = () => {
        const inputElement = document.getElementById(id);
        inputElement.click();
    }

    return (
        <div>
            <button
                className={
                    'p-1 mx-auto my-1 hover:cursor-pointer w-full ' +
                    'border-1 border-b-2 border-r-2 border-black rounded-md ' +
                    'bg-stone-400 hover:bg-stone-200 ' +
                    'dark:bg-stone-600 dark:hover:bg-stone-400 ' + 
                    'text-white hover:text-black'
                }
                onClick={() => openFileDialog()}>
                {children}
            </button>
            <input 
                type='file'
                id={id}
                hidden onChange={(event) => onChange(event)}
                accept={accept}
                multiple={multiple ? true : undefined} />
        </div>
    )
}