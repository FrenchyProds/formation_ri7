const slugify = str =>
    str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '+')
        .replace(/^-+|-+$/g, '')

const fetchDB = async (url) => {
    try {
        return await fetch(url)
        .then(res => {
           const response = res.json()
            return response
        })
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

export {slugify, fetchDB}