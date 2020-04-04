const doCallback = (callback) => {
    setTimeout(() => {
        callback("error", undefined)
    }, 2000)
}

doCallback((error, result) => {
    if (error)
    {
        return console.log(error)
    }

    console.log(result)
})
