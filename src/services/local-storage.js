const setItem = async (name, content) => {
    localStorage.setItem(name, JSON.stringify(content))
}

const getItem = async (name) => {
    await JSON.parse(localStorage.getItem(name))
}

export {setItem, getItem}