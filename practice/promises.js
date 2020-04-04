const doProm = new Promise((res, rej) => {
    res([1, 5, 6])
    // rej("error")
})

doProm.then((res) => {
    console.log(res)
})
.catch((err) => {
    console.log(err)
})