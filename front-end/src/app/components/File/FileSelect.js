export default function FileSelect(props) {

    const { onChange, children } = props;

    const openFileDialog = () => {
        const inputElement = document.getElementById('file-select');
        inputElement.click();
    }

    return (
        <div>
            <button
                className={
                    'p-1 m-2 hover:cursor-pointer ' +
                    'border-1 border-b-2 border-r-2 border-black rounded-md ' +
                    'bg-stone-400 hover:bg-stone-200 ' +
                    'text-white hover:text-black'
                }
                onClick={() => openFileDialog()}>
                {children}
            </button>
            <input type='file' id='file-select' hidden onChange={(event) => onChange(event)} />
        </div>
    )
}