const colors=['blue', 'green', 'red'];

const randomColor= () =>{
    // * ile colors dizisinin lengthi kadar rastgele sayı üretiyorum.
    //floor ile de yuvarlıyorum.
    //yani 0 ile 3 arasında bir sayı üretilecek
    return colors[Math.floor(Math.random() * colors.length)]
}

module.exports=randomColor;