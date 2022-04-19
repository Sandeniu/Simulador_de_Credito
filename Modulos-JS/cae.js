
let boton = document.getElementById("boton");
boton.addEventListener("click", calcularCae);


function calcularCae() {
 let valorSolicitado = 7266061;
 let cuota = 309749;
 let cuotas = 30;
 let frecuenciaConversion = 12;
 let anos = cuotas / 12;
 let factorMovil = 1 / 100;
 let CAE = 0;
 let comprobadorCAE = 0; 


    while (comprobadorCAE < cuota) {
        factorMovil += 0.00001;
        comprobadorCAE = valorSolicitado * factorMovil / frecuenciaConversion / (1 - (Math.pow((1 + factorMovil / frecuenciaConversion), -(anos * frecuenciaConversion))));
        CAE = factorMovil;
    }
    console.log(CAE);
    alert(CAE);
}

