//* GASTOS OPERACIONALES-----------------------------------------------------------

//* VARIABLES GLOBALES-----------------------------------------------------------
let almacenDEGastos = []; //array que contendrá los gastos
let totalGastos = 0;

//*  DECLARACIÓN DE LA CLASE ------------------------------------------------------
class Gastos {
    constructor(id, descripcion, costo) {
        this.id = id;
        this.descripcion = descripcion;
        this.costo = costo;
    }

    ingresarGasto() {
        almacenDEGastos.push(this); //se incluye el new Gastos en el array almacenDEGastos
    }
}

//*  LLAMADO A FUNCIONES ----------------------------------------------------------
obtenerGastosOperacionales();
console.log(almacenDEGastos);

totalGastos = sumatoriaGastos();
console.log(totalGastos);


//* EJECUCIÓN DE FUNCIONES --------------------------------------------------------
function obtenerGastosOperacionales() {
    const notaria = new Gastos("1", "Gastos Notariales", 3500);
    const impuesto = new Gastos("2", "Impuestos Asociados", 91165);
    notaria.ingresarGasto();
    impuesto.ingresarGasto();
}


function sumatoriaGastos(){
    let suma = 0;
    almacenDEGastos.forEach(e =>{
        suma += e.costo;
    })
    return suma;
}