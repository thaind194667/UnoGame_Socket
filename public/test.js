function arrToObj(arr) {
    var newObj = {};
    return arr.reduce((obj, item) => ({
        ...obj,
        [item[0]] : item[1],
    })
    , newObj);
}



$(document).ready(function(){
    const obj1 = arrToObj([
        ['name', 'Son Dang'], 
        ['age', 21], 
        ['address', 'Ha Noi']
    ]);
    // $('#res').html(obj1);
    // console.log(obj1);
});
