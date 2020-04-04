const add = (a, b)=> {
   return new Promise((resolve, reject)=>{
       setTimeout(()=>{
           if(a<0 || b<0){
               return reject("-ve nums")
           }
           resolve(a+b)
       }, 2000)
   })
}

const dowork = async() => {
   const sum= await add(-1,99)
   const sum2= await add(sum,10)
   const sum3= await add(sum2,10)
   return sum3
}

dowork().then((res)=>{
    console.log(res)
})
.catch((e)=>{
    console.log(e)
})