//COMPARACION DE 2 FECHAS


//fecha actual
let date1 = new Date(); // Sat Apr 16 2022 17:42:33 GMT-0400 (hora estándar de Chile)
    date1 = date1.toISOString().split('T')[0]; //'2022-04-16'
let date1_Integer = stringTONumber(date1); //20220416
console.log(`fecha 1: ` + date1_Integer) ;


//fecha anterior
let date2 = "2022-03-15";
let date2_Integer = stringTONumber(date2); //20220415
console.log(`fecha 2: ` + date2_Integer) ;


//función que transforma string a Números (para luego poder realizar la resta entre las 2 fechas)
function stringTONumber(fechaString){
    let nuevaCadena = "";
    for (let x = 0; x <= fechaString.length-1; x++) {
        if (fechaString[x] != "-") {
            nuevaCadena  = nuevaCadena + fechaString[x];
        }
    }
    let nuevoInteger = nuevaCadena * 1;
    return nuevoInteger;
}

if ((date1_Integer - date2_Integer)< 200){ // 20220416 - 20220315 = 101, (LA DIFERENCIA ES DE 1 MES + 1 DÍA)
    console.log("la diferencia de fechas es menor a 2 meses")
}
  
