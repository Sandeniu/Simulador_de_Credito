
//! _________________________________ S T O R A G E ________________________________________
//! ////////////////////////////////////////////////////////////////////////////////////////

//TODO: LOAD: (EVENTO DE WINDOWS): Se realiza almacenamiento inicial de la clase persona

//TODO: CHANGE: (EVENTO DEL CUADRO DE TEXTO ID): Cuando el usuario ingresa su rut se 
//TODO: verifica su existencia en el storage, si es que este coincide, los demás text 
//TODO: son llenados con los valores corerspondientes.

//TODO: CLICK: (EVENTO DEL BOTON CALCULAR):Los datos introducidos por el usario se deben 
//TODO: guardar en el storage

//! ========================================================================================
//! _________________________________ VARIABLES GLOBALES ___________________________________
//! ////////////////////////////////////////////////////////////////////////////////////////

let nuevoUser; //* variable con la que se crea un usuario nuevo.
let usuarios;  //* array que contiene a todos los usuarios

//* SE CONVIERTE FECHA A INTEGER PARA PODER COMPARAR CON FECHAS OBTENIDAS EN FETCH(URL2)----
// Modulo-JS → fecha.js
let date1 = new Date(); // Sat Apr 16 2022 17:42:33 GMT-0400 (hora estándar de Chile)
date1 = date1.toISOString().split('T')[0]; //'YYYY-MM-D'
let date1_Integer = stringTONumber(date1); // YYYYMMDD
console.log(`fecha 1: ` + date1_Integer);


// transformar fecha string a Números 
function stringTONumber(fechaString) {
  let nuevaCadena = "";
  for (let x = 0; x <= fechaString.length - 1; x++) {
    if (fechaString[x] != "-") {
      nuevaCadena = nuevaCadena + fechaString[x];
    }
  }
  let nuevoInteger = nuevaCadena * 1;
  return nuevoInteger;
}

//* DATOS PERSONALES -----------------------------------------------------------------------
// Estos datos se inicializan dentro de la función inicializarVariables()
let idUser;
let nombre;
let celular;
let email;
let edad;

//* TASA DE INTERÉS DEL CRÉDITO ------------------------------------------------------------
let UF = 0;               //su valor real se define en el fetch(URL1) Request
let TIMC = [0, 0, 0];     //su valor real se define en el fetch(URL2) Request
// TIMC[0] = tasa para créditos menores de 1 año
// TIMC[1] = tasa para créditos mayores de 1 año; e inferiores o iguales a 2000 UF
// TIMC[2] = tasa para créditos mayores de 1 año; y Superiores a 2000 UF
let tasaCredito = 0;

//* SEGUROS -------------------------------------------------------------------------------
let listSeguros; // almacenará la lista de checkbox del DOM, (valor true para aquel que esté seleccionado)
let checkDesgravamen = false;  //su valor real se define en la función obtenerSegurosOpcionales()
let checkCesantia = false;     //su valor real se define en la función obtenerSegurosOpcionales()
let primaDesgravamen = 0;  //su valor real se define en la función obtenerSegurosOpcionales()
let primaCesantia = 0;     //su valor real se define en la función obtenerSegurosOpcionales()
let almacenDESeguros = []; //su valor se define en la función obtenerSegurosOpcionales()
let totalSeguros = 0;      //su valor real se define en la función obtenerSegurosOpcionales()

//* GASTOS OPERACIONALES--------------------------------------------------------------------
let almacenDEGastos = [];   //su valor se define en la función obtenerGastosOperacionales() 
let totalGastos = 0;        //su valor se define en la función obtenerGastosOperacionales()

//* CUOTA FINAL ----------------------------------------------------------------------------
let montoSolicitado;        //su valor real se define en la función inicializarVariables()
let cuotas;                 //su valor real se define en la función inicializarVariables()
let montoBrutoCredito = 0;  //su valor real se define en la función obtenerCuotaFinal ()
let cuotaMensualInt = 0;        //su valor real se define en la función obtenerCuotaFinal ()
let totalPagoInt = 0;           //su valor real se define en la función obtenerCuotaFinal(), es el Valor Bruto del préstamo

//* CONCLUSIÓN DE VALORES ------------------------------------------------------------------
let CAE = 0;                //su valor real se define en la función obtenerCargaAnualEquivalente()

//* CONFECCIÓN DE TABLA DE SALIDA A PANTALLA------------------------------------------------
// Estos valores se se definen en la función conversionValores ()

let fechaActual;
let CAEStr;
let tasaCreditoStr;

let montoSolicitadoStr;
let UFmontoSolicitado;
let UFmontoSolicitadoStr;

let montoBrutoCreditoStr;
let UFmontoBrutoCredito;
let UFmontoBrutoCreditoStr;


let totalPagoStr;
let UFtotalPago;
let UFtotalPagoStr;

let cuotaMensualStr;
let UFcuotaMensual;
let UFcuotaMensualStr;

let tramoDesgravamen;
let tramoCesantia;
let primaDesgravamenStr;
let UFprimaDesgravamen;
let UFprimaDesgravamenStr;
let primaCesantiaStr;
let UFprimaCesantia;
let UFprimaCesantiaStr;

let totalSegurosStr;
let UFtotalSeguros;
let UFtotalSegurosStr;

let gastoNotariaStr;
let gastoImpuestoStr;
let totalGastosStr;

window.addEventListener("load", loadUsuarios);
window.addEventListener("load", cargarSelect);

//! ========================================================================================
//! ____________________________________ API REQUEST _______________________________________
//! ////////////////////////////////////////////////////////////////////////////////////////

//* REQUEST VALOR DE UF ACTUALIZADO --------------------------------------------------------
// UF = Unidad de Fomento. los interes de creditos se cobran con este indicador financiero
let URL1 = "https://mindicador.cl/api";

fetch(URL1).then((response) => {
  return response.json();
}).then((indicador) => {
  UF = indicador.uf.valor;
}).catch((error) => {
  console.log("Peticion Fallida", error);
  //UF = 31000;
});


//* REQUEST VALOR TIMC ( Tasa de interés máxima convencional del estado)--------------------

// FETCH
// Modulo-JS → fetch-TIMC.js

let URL2 = "https://api.cmfchile.cl/api-sbifv3/recursos_api/tmc/2022?apikey=532c6af64f6d4c35bb6d34080f9c052c2cd96a21&formato=json";
fetch(URL2)
  .then((response) => response.json())
  .then((data) => {
    let propiedadTMCs = data.TMCs;

    //* PRIMERO SE FILTRAN LOS VALORES DEL ÚLTIMO MES
    propiedadTMCs.forEach(e => {
      let date2 = e.Fecha;
      let date2_Integer = stringTONumber(date2); //YYYYMMDD
      console.log(`fecha 2: ` + date2_Integer);
      if ((date1_Integer - date2_Integer) < 200) { // (diferencia es menor a 1 mes)
        //console.log("la diferencia de fechas es menor a 2 meses")
        if (e.Tipo === "21") { //TIMC para créditos menores de 1 año
          TIMC[0] = e.Valor * 0.5;
        }
        if (e.Tipo === "24") { //TIMC para créditos mayores de 1 año; e inferiores o iguales a 2000 UF
          TIMC[1] = e.Valor * 0.5;
        }

        if (e.Tipo === "22") { //TIMC para créditos mayores de 1 año; y superiores a 2000 UF
          TIMC[2] = e.Valor * 0.5;
        }
      }

    })
    console.log(`
    TIMC[0] = ${TIMC[0]}
    TIMC[1] = ${TIMC[1]}
    TIMC[2] = ${TIMC[2]}
    `)
  })

  .catch((error) => {
    console.log("Peticion Fallida", error);
    /*
    TIMC[0] = 2.505;
    TIMC[1] = 3.57;
    TIMC[2] = 3.225;
    console.log(` ENTRÓ POR EL CATCH
    TIMC[0] = ${TIMC[0]}
    TIMC[1] = ${TIMC[1]}
    TIMC[2] = ${TIMC[2]}
    `)
    */
  })

//! ========================================================================================
//! _______________________________REFERENCIAS HTMLObjects__________________________________
//! ////////////////////////////////////////////////////////////////////////////////////////

let listTextBox = document.querySelectorAll('input.text');    // array que contiene todos los input text 

//* html: ROW [1] DATOS PERSONALES ---------------------------------------------------------
let REFrutTex = document.getElementById("rutTex");
REFrutTex.addEventListener("change", changeChequearID);       // llenado de campos con datos del storage
let REFuserTex = document.getElementById("userTex");
let REFceluTel = document.getElementById("celuTel");
let REFemailEma = document.getElementById("emailEma");
let REFedadSel = document.getElementById("edadSel");           // elemento select 

//* html: ROW [2] DATOS CREDITICIOS --------------------------------------------------------
let REFcreditoRan = document.getElementById("creditoRan");      //barra para agregar monto del credito
REFcreditoRan.addEventListener("click", clickAsignarRangeAText1);

let REFcuotasRan = document.getElementById("cuotasRan");        //barra para agrgar nro de cuotas
REFcuotasRan.addEventListener("click", clickAsignarRangeAText2);

let REFcreditoTex = document.getElementById("creditoTex");      //cuadro de texto monto del crédito
REFcreditoTex.addEventListener("change", changeValidarEntrada1);
REFcreditoTex.addEventListener("keyup", keyupValidarTeclaTex1);
let REFcuotasTex = document.getElementById("cuotasTex");        //cuadro de texto nro de cuotas
REFcuotasTex.addEventListener("change", changeValidarEntrada2);
REFcuotasTex.addEventListener("keyup", keyupValidarTeclaTex2);

//* html: ROW [3] SEGUROS COMPLEMENTARIOS---------------------------------------------------
let REFsegurosChe = document.querySelectorAll('.segurosChe');   // ARRAY
//* html: ROW [4] BOTONERAS ----------------------------------------------------------------
let REFcalcularBut = document.getElementById("calcularBut");    //boton calcular
REFcalcularBut.addEventListener("click", clickCalcular);
let REFlimpiarBut = document.getElementById("limpiarBut");      //boton limpiar
REFlimpiarBut.addEventListener("click", clickLimpiar);

//* html: ROW [5] RESULTADO ----
let REFresultadosFie = document.getElementById("resultadosFie"); //<Fieldset> (Nodo Padre)

//! ========================================================================================
//! _________________________________DECLARACIÓN DE CLASES__________________________________
//! ////////////////////////////////////////////////////////////////////////////////////////


//TODO: =================================CLASE PERSONAS=====================================
class Persona {
  constructor(id, nombre, celular, email, edad) {
    this.id = id;
    this.nombre = nombre;
    this.celular = celular;
    this.email = email;
    this.edad = edad;
  }
  almacenarUser() {                                             // almacenaje primero en array, luego en storage
    usuarios.push(nuevoUser);                                   // se empuja el nuevo usuario al array 'Usuarios'
    localStorage.setItem('usuarios', JSON.stringify(usuarios)); // se guarda usuario en storage
    console.log(usuarios);
  }
}

//TODO: ==========================CLASE GASTOS OPERACIONALES================================

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

//TODO: =================================CLASE SEGUROS======================================

class Seguros {
  constructor(id, nombre, tramo, recargo, tasa,) {
    this.id = id;
    this.nombre = nombre;
    this.tramo = tramo;
    this.recargo = recargo;
    this.tasa = tasa / 1000;
  }

  calcularPrima() {
    let prima = montoSolicitado * cuotas * this.tasa * (1 + this.recargo);
    return prima; // con este valor se hará la sumatoria para la variable totalSeguros
  }
  almacenarSeguro() {
    almacenDESeguros.push(this);
  }
}

//TODO: =================================CLASE CRÉDITO======================================

class credito {
  constructor(id, nombre) {
    this.id = id;
    this.nombre = nombre;
  }

  obtenerMontoBruto(montoSolicitado) {
    this.montoSolicitado = montoSolicitado;
    this.montoBruto = this.montoSolicitado + totalGastos + totalSeguros;
    return this.montoBruto;
  }

  obtenerCuota(valorCredito, cuotas, interes) {
    this.valorCredito = valorCredito;
    this.cuotas = cuotas;
    this.interes = interes / 100;

    // método para potencias → Math.pow(base, exponente)
    this.cuotaMensual = this.valorCredito * ((this.interes * (Math.pow((1 + this.interes), this.cuotas))) / ((Math.pow((1 + this.interes), this.cuotas)) - 1));
    console.log("cuota mensual =" + this.cuotaMensual);
    return this.cuotaMensual;
  }

  obtenerTotalAPagar() {
    this.totalPrestamo = this.cuotaMensual * this.cuotas;
    return this.totalPrestamo;
  }

}

//! ========================================================================================
//! __________________________ MANEJADORES DE EVENTOS DEL DOM ______________________________
//! ////////////////////////////////////////////////////////////////////////////////////////


//TODO: =========== MANEJADORES DE EVENTOS AL CARGAR LA PÁGINA (WINDOWS LOAD) ===========
//* STORAGE INICIAL ------------------------------------------------------------------------
function loadUsuarios() { //* 
  usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  console.log(usuarios);
}

//* CARGAR EDAD EN SELECT ------------------------------------------------------------------
function cargarSelect() {
  let selector = REFedadSel;

  for (let x = 21; x <= 100; x++) {
    let nuevoItem = document.createElement("option");
    nuevoItem.text = x;
    selector.add(nuevoItem);
  }
}

//TODO: ============== MANEJADORES DE EVENTOS EN SECCION DATOS PERSONALES ==================
//* INPUT TEXT: Prevenir comportamiento por defecto en todos los cuadros de texto
/* 
Se previene el comportamiento por defecto al presionar la tecla enter en todos los cuadros de texto
Para este fin se crea un array conformado por los selectores input.text, a los cuales se les incorpora
el evento "keydown" que gestiona la prevención de este comportamiento.
*/
for (const textBox of listTextBox) {
  textBox.addEventListener("keydown", (event) => {
    let tecla = event.which || event.keyCode;
    if (tecla == 13) {
      event.preventDefault(); 	//Prevenir
      return false;
    }
  });
}

//* TEXT ID: VERIFICACIÓN EXISTENCIA DE USUARIOS -------------------------------------------
function changeChequearID() {
  let VARrutTex = REFrutTex.value;

  //* Se consulta si array.id coincide con el id ingresado en el textbox
  let encontrado = usuarios.find(elem => elem.id === VARrutTex)

  if (encontrado) {
    //* inputar datos de usuario en cuadros de texto
    REFrutTex.value = encontrado.id;
    REFuserTex.value = encontrado.nombre;
    REFceluTel.value = encontrado.celular;
    REFemailEma.value = encontrado.email;

    //* inputar edad de usuario en elemento select
    for (let x = 0; x <= REFedadSel.length - 1; x++) {
      if (REFedadSel.options[x].text === encontrado.edad) {
        // REFedadSel.selectedIndex  = REFedadSel.options[x];
        REFedadSel.selectedIndex = x;
        break;
      }
    }
    let mensajebienvenida = `Bienvenido/a  ${encontrado.nombre}`;
    document.getElementById('bienvenidoUsuarioH2').textContent = mensajebienvenida;
  }
}

//TODO: ============== MANEJADORES DE EVENTOS EN SECCIÓN DATOS CREDITICIOS =================
//* CUADRO DE TEXTO CREDITO ----------------------------------------------------------------
//SE VALIDA QUE CARACTER ENTRANTE SEA NUMERO
function keyupValidarTeclaTex1(event) {
  // elimina el último caracter ingresado cuando no es un numéro o retroceso o enter.
  // para ello convierte el text.value en un array para así eliminar el último caracter tecleado,
  // luego este array modificado es conviertido nuevamente a un string el cual es devuelto al text.value

  let tecla = event.which || event.keyCode;
  console.log(`Tecla Presionada es: ${tecla}`);

  //* borrar todo carácter ingresado que sea distinto a NÚMEROS, intro, backspace, flechaS izq/der 
  if ((tecla != 8 && tecla != 13) && (tecla != 37 && tecla != 39)) { //* back, intro, izq, y der.

    if ((tecla < 48 || tecla > 57) && (tecla < 96 || tecla > 105)) { //* números del 0 al 9
      let VARcreditoTex = REFcreditoTex.value; //* se obtiene el valor del text
      let palabraAArray = VARcreditoTex.split(""); //* split convierte este valor en un array

      palabraAArray.pop(); //* pop() elimina el último elemento del array 
      //console.log(`palabra A Array: ${palabraAArray}`);

      let arrayAPalabra = palabraAArray.toString(); //**toString converte el array en un string 
      arrayAPalabra = arrayAPalabra.replace(/,/g, ""); //* se depuran las comas (,) que dejó la conversión
      //console.log(`array A Palabra: ${arrayAPalabra}`);

      REFcreditoTex.value = arrayAPalabra; //* el string limpio se devuelve al cuadro de texto 
    }
  }
}

//* TEXT CREDITO: ASIGNANDO VALOR AJENO ----------------------------------------------------
function clickAsignarRangeAText1() {
  // cuadro de texto toma el valor del elemento range($)
  REFcreditoTex.value = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(REFcreditoRan.value);

  /* Las siguientes líneas de esta función no interfieren ni contribuyen en ningún resultado, 
  pero generan una salida de consola que le sirve al programador */
  let VARcreditoTex = REFcreditoTex.value;  // el valor del cuadro de texto($) es almacenado en una variable
  console.log(`valor del input text (#creditoTex) es: ${VARcreditoTex}`);

  let VARcreditoRan = REFcreditoRan.value;  // el valor de la barra texto($) es almacenado en una variable
  console.log(`valor del input range (#creditoRan): ${VARcreditoRan}`);
}

//* TEXT CREDITO: CONVERSIÓN DE STRING EN NÚMERO (DEPURACIÓN DE CARÁCTERES ($ .)------------
/*
El valor presente en el cuadro de texto se limpia de carácteres ($.) y se envía a validación de 
monto límite permitido.
Para limpiar los carácteres se crea un array que recorre el string formando una cadena de solo números
(omitiendo arácteres NAN), luego la cadena es convertida en número, el cual es enviado como argumento
a la función de validación
*/
function changeValidarEntrada1(entrada) {
  entrada = REFcreditoTex.value;
  if (isNaN(entrada)) {  //* Devuelve true cuando el valor No es númerico.
    let caracteres = Array.from(entrada);
    let cadena = "";
    for (let caracter in caracteres) {
      let numero = (caracteres[caracter] * 1); //* al multiplicar * 1 el string se convierte en integer
      if (!isNaN(numero)) {
        cadena = cadena + caracteres[caracter];
        console.log(cadena);
      }
    }
    cadena = cadena * 1;
    montoLimite(cadena);

  } else {
    montoLimite(entrada);
  }
}

//* TEXT CREDITO: VALIDACIÓN DE MONTO LIMITE PERMITIDO  ------------------------------------
function montoLimite(entrada) {
  let resto = entrada % 100000;

  if (entrada < 500000 || entrada > 60000000) { // valor ingresado fuera de límites permitidos
    Swal.fire({
      title: 'Valor fuera de rango',
      text: 'Se permiten montos entre 500.000, y 60.000.000',
      //icon: 'warning',
      confirmButtonText: 'Ok',
      width: 500,
      //padding: 1,
      color: '#ffffff',
      background: '#22223b',
      position: 'top'
    })
    REFcreditoTex.value = "";
  } else
    if (resto >= 50000) {
      Swal.fire({
        title: 'Solo se permiten múltiplos de 100.000',
        text: 'El valor ingresado será aproximado al siguiente multiplo de 100.000',
        // icon: 'warning',
        //icon: 'warning',
        confirmButtonText: 'Ok',
        width: 600,
        //padding: 1,
        color: '#ffffff',
        background: '#22223b',
        position: 'top'
      })
      entrada = (entrada - resto) + 100000;
      asignarConvertirMonto(entrada);
    } else
      if (resto > 0 && resto < 50000) {
        Swal.fire({
          title: 'Solo se permiten múltiplos de 100.000',
          text: 'El valor ingresado será aproximado al siguente multiplo de 100.000',
          //icon: 'warning',
          confirmButtonText: 'Ok',
          width: 600,
          //padding: 1,
          color: '#ffffff',
          background: '#22223b',
          position: 'top'
        })
        entrada = entrada - resto;
        asignarConvertirMonto(entrada);
      } else {
        asignarConvertirMonto(entrada);
      }
}

//* TEXT CREDITO: CONVERSION  A FORMATO MONEDA ---------------------------------------------
function asignarConvertirMonto(entrada) {
  REFcreditoRan.value = entrada;
  REFcreditoTex.value = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(entrada);
}

//TODO: ======================MANEJADORES DEL CUADRO DE TEXTO CUOTAS=====================
//* TEXT CUOTAS --> ASIGNANDO VALOR AJENO ---------------------------------------------------
function clickAsignarRangeAText2() {
  REFcuotasTex.value = REFcuotasRan.value; // cuadro de texto toma el valor del elemento range
  /* Las siguientes líneas de esta función no interfieren ni contribuyen en ningún resultado, 
  pero generan una salida de consola que le sirve al programador */
  let VARcuotasTex = REFcuotasTex.value // variable almacena valor del cuadro de texto
  console.log(`valor del input text (#cuotasTex) es: ${VARcuotasTex}`);

  let VARcuotasRan = REFcuotasRan.value; //variable almacena valor del input Range
  console.log(`valor del input range (#cuotasRan): ${VARcuotasRan}`);
}

//* TEXT CUOTAS: VALIDAR TECLA INGRESADA (SOLO SE ADMITEN NUMEROS) -------------------------
// Se elimina el último caracter ingresado cuando no es un numéro o retroceso o enter.
// para ello convierte el text.value en un array para así eliminar el último caracter tecleado,
// luego este array modificado es conviertido nuevamente a un string el cual es devuelto al text.value

function keyupValidarTeclaTex2() {
  let tecla = event.which || event.keyCode;
  console.log(`Tecla Presionada es: ${tecla}`);

  // borrar todo carácter ingresado que sea distinto a NÚMEROS, intro, backspace, flechaS izq/der 
  if ((tecla != 8 && tecla != 13) && (tecla != 37 && tecla != 39)) { // back, intro, izq, y der.
    if ((tecla < 48 || tecla > 57) && (tecla < 96 || tecla > 105)) { // números del 0 al 9
      let VARcuotasTex = REFcuotasTex.value;                         // se obtiene el valor del text
      let palabraAArray = VARcuotasTex.split("");                    // split convierte este valor en un array

      palabraAArray.pop();                                           // pop() elimina el último elemento del array 
      //console.log(`palabra A Array: ${palabraAArray}`);

      let arrayAPalabra = palabraAArray.toString();                  // toString converte el array en un string 
      arrayAPalabra = arrayAPalabra.replace(/,/g, "");               // se depuran las comas (,) que dejó la conversión
      //console.log(`array A Palabra: ${arrayAPalabra}`);

      REFcuotasTex.value = arrayAPalabra; //* el string limpio se devuelve al cuadro de texto 
    }
  }
}

//* VALIDACIÓN ENTRADA SEA:   *NUMERO, *ENTRE 6 Y 60, *MULTIPLO DE 2 ------------------------
//* TEXT RANGE : ASIGNACION DE VALOR AJENO --------------------------------------------------
function changeValidarEntrada2(entrada) {
  entrada = REFcuotasTex.value;
  let resto = entrada % 2;

  if (isNaN(entrada)) {                      // true cuando el valor es NaN (NaN ="No númerico")
    REFcuotasTex.value = "";
  } else
    if (entrada < 6 || entrada > 60) {  // valor ingresado fuera de límites permitidos
      Swal.fire({
        title: 'Valor fuera de rango',
        text: 'Se permiten entre 6 y 60 cuotas',
        // icon: 'warning',
        //icon: 'warning',
        confirmButtonText: 'Ok',
        width: 500,
        //padding: 1,
        color: '#ffffff',
        background: '#22223b',
        position: 'top'
      })
      REFcuotasTex.value = "";
    } else
      if (resto == 1) {
        entrada = (entrada * 1) + resto
        REFcuotasTex.value = entrada;
        REFcuotasRan.value = entrada;
      } else {
        REFcuotasRan.value = entrada;
      }
}

//! ========================================================================================
//! __________________________ EVENTO CLICK DEL BOTON CALCULAR _____________________________
//! ////////////////////////////////////////////////////////////////////////////////////////

//TODO: =====================  FASE 1. LLAMADOS A FUNCIONES ===============================

//* 1. PREPARACIÓN DE DATOS Y ESTRUCTURA DE LLAMADAS---------------------------------------
function clickCalcular(event) {
  event.preventDefault();                  // previene el comportamiento default del submit
  if (userValidarVacios() === true) {      // ante todo se valida que todos los campos esten llenos
    inicializarVariables();                // se verifica que la existencia del usuario a crear no sea "true"
    storageUsuario();                      // Almacenar usuario en el storage 
    calculoSimulacion();                   // Procesamiento de operaciones matemáticas para la simulación de crédito 
    despliegueDEInformacion();
  } else {
    return false; // Si existen campos vacíos salir del programa
  }
}

//* 1.1. LLAMADAS A FUNCIONES REALACIONADAS CON STORAGE USUARIO ---------------------------
function storageUsuario() {
  if (userVerificarExistencia() != true) {  // se verifica que el usuario a crear no exista
    if (crearUser()) {                      // si el usuario no existe, entonces se crea
      nuevoUser.almacenarUser();            // se almacena en el storage usuamdo el constructor d ela clase usuario
    }
  }
}

//* 1.2. LLAMADAS A FUNCIONES REALACIONADAS CON CÁLCULOS DE SIMULACIÓN --------------------
function calculoSimulacion() {
  tasaCredito = obtenerTasaMaximaConvencional();
  totalSeguros = obtenerSegurosOpcionales();
  totalGastos = obtenerGastosOperacionales();
  cuotaMensualInt = obtenerCuotaFinal();
  CAE = obtenerCargaAnualEquivalente();
}

//* 1.3. LLAMADAS A FUNCIONES REALACIONADAS CON EL DESPLIEGUE DE INFO EN PANTALLA-----------
function despliegueDEInformacion() {
  conversionValores()
  generarTabla()
}

//TODO: ============== FASE 2.1 DESARROLLO DE FUNCIONES PARA PREPARAR DATOS ================

//* VALIDAR QUE LOS DATOS ESTÉN LLENOS (IMPRECINDIBLE ANTES DE INICIALIZAR VARIABLES)-------
function userValidarVacios() {              // no puede haber campos vacíos
  let mensaje = "";
  let contador = 0;
  if (REFrutTex.value === "") {                 // verifica si el campo rut está vacío
    mensaje += `Rut, `;
    contador++;
    if (contador == 1) { REFrutTex.focus(); }   // si es la primera ocurrencia de vacío, recibe el foco  
  }
  if (REFuserTex.value === "") {                //verifica si el campo nombre está vacío
    mensaje += `Nombre, `;
    contador++;
    if (contador == 1) { REFuserTex.focus(); }  // si es la primera ocurrencia de vacío, recibe el foco
  }
  if (REFceluTel.value === "") {                // verifica si el campo celular está vacío
    mensaje += `Celular, `;
    contador++;
    if (contador == 1) { REFceluTel.focus(); }  // si es la primera ocurrencia de vacío, recibe el foco
  }
  if (REFemailEma.value === "") {               //verifica si el campo email está vacío
    mensaje += `Email, `;
    contador++;
    if (contador == 1) { REFemailEma.focus(); } // si es la primera ocurrencia de vacío, recibe el foco
  }
  if (REFedadSel.selectedIndex === 0) {         //verifica existencia de EDAD
    mensaje += `Edad, `;
    contador++;
    if (contador == 1) { REFedadSel.focus(); }  // si es la primera ocurrencia de vacío, recibe el foco
  }

  // let resultado = contador > 0 ? alert(mensaje) : true;
  // return resultado;

  if (contador > 0) {
    Swal.fire({
      title: 'No se permiten campos vacíos',
      text: `Faltan los siguientes datos: ${mensaje} ¡Por favor complete la información!`,
      //icon: 'warning',
      confirmButtonText: 'Ok',
      width: 500,
      //padding: 1,
      color: '#ffffff',
      background: '#22223b',
      position: 'top'
    })
  } else {
    return true;
  }
}

//* INICIALIZAR VARIABLES PROVENIENTES DEL DOM ---------------------------------------------
function inicializarVariables() {
  //Variables de sección usuario
  idUser = REFrutTex.value;
  nombre = REFuserTex.value;
  celular = REFceluTel.value;
  email = REFemailEma.value;
  edad = (REFedadSel.options[REFedadSel.selectedIndex].text);

  //variables de sección créditos
  montoSolicitado = REFcreditoRan.value;
  montoSolicitado = montoSolicitado * 1;
  cuotas = REFcuotasRan.value;
  cuotas = cuotas * 1;

  //variables de sección seguos Opcionales
  listSeguros = REFsegurosChe; //array objects que contiene los checkbox
}

//TODO: FASE 2.2 DESARROLLO DE FUNCIONES RELACIONADAS CON ALMACEN STORAGE===================
//*  VERIFICAR EXISTENCIA DE USUARIO EN EL STORAGE -----------------------------------------
function userVerificarExistencia() {
  let encontrado = usuarios.find(elem => elem.id === idUser) //* ¿text.value = array.id[x]?
  if (encontrado) {
    return true;
  }
}

//* CREACIÓN DE USUARIO EN EL STORAGE ------------------------------------------------------
function crearUser() {
  nuevoUser = new Persona(idUser, nombre, celular, email, edad); // se construye usuario según plantilla 'Persona'
  return true;
}

//TODO: 2.3. DESARROLLO DE FUNCIONES RELACIONADAS CON CALCULOS DE SIMULACIÓN ================
//* CALCULO DE TASA DE INTERÉS MAXIMA CONVENCIONAL ------------------------------------------
// El array TIMC se obtuvo mediante FETCH al cargar la página
function obtenerTasaMaximaConvencional() {
  let montoUF = montoSolicitado / UF
  let tasa;
  if (cuotas <= 12) {        // se aplicará tasa de interés para créditos menor o igual a  1 año
    tasa = TIMC[0];
  }
  else
    if (montoUF < 2000) {   // se aplicará tasa de interés para créditos mayores a 1 año y menor a 2000 UF
      tasa = TIMC[1];
    } else {                // se aplicará tasa de interés para créditos mayores a 1 año y menor a 2000 UF
      tasa = TIMC[2];
    }
  return tasa;
}

//*  CALCULOS DE PRIMA SEGUROS DESGRAVAMEN Y CESANTÍA --------------------------------------
function obtenerSegurosOpcionales() {
   let edadInt = edad * 1;
  let riesgo = edadInt + (cuotas / 12);

  //Verificar si el usuario hizo check en Seguro de Desgravamen
  // constructor(id nombre, tramo, recargo, tasa)
  if (listSeguros[0].checked) {
    checkDesgravamen = true;
    if (riesgo < 65) {//no hay riesgo
      const desgravamenTramo1 = new Seguros("0", "Seguro de Desgravamen", "Tramo 1", 0.15, 0.38);
      primaDesgravamen = desgravamenTramo1.calcularPrima();
      desgravamenTramo1.almacenarSeguro();
    } else { //hay riesgo, por ende un incremento en la tasa
      const desgravamenTramo2 = new Seguros("0", "Seguro de Desgravamen", "Tramo 2", 0.15, 0.76);
      primaDesgravamen = desgravamenTramo2.calcularPrima();
      desgravamenTramo2.almacenarSeguro();
    }
    totalSeguros += primaDesgravamen;
  }
  //Verificar si el usuario hizo check en Seguro de Cesantía
  // constructor(id nombre, tramo, recargo, tasa)
  if (listSeguros[1].checked) {
    checkCesantia = true;
    const cesantiaTramo1 = new Seguros("1", "Seguro de Cesantía", "Tramo Unico", 0.15, 0.30);
    primaCesantia = cesantiaTramo1.calcularPrima();
    cesantiaTramo1.almacenarSeguro();
    totalSeguros += primaCesantia;
  }
  //retorno de valores
  return totalSeguros;
}

//*  GASTOS OPERACIONALES DEL CRÉDITO -------------------------------------------------------
function obtenerGastosOperacionales() {
  const notaria = new Gastos("1", "Gastos Notariales", 3500);
  const impuesto = new Gastos("2", "Impuestos Asociados", 91165);
  notaria.ingresarGasto();
  impuesto.ingresarGasto();
  let total = sumatoriaGastos();
  return total;

  function sumatoriaGastos() {
    let suma = 0;
    almacenDEGastos.forEach(e => {
      suma += e.costo;
    })
    return suma;
  }
}

//*  SE OBTIENE VALOR DE LA CUOTA FINAL -----------------------------------------------------
function obtenerCuotaFinal() {
  let idCredito = "1";
  let tipocredito = "Crédito de Consumo";
  let interes = tasaCredito;
  const credito1 = new credito(idCredito, tipocredito);
  montoBrutoCredito = credito1.obtenerMontoBruto(montoSolicitado);
  let valorCuota = credito1.obtenerCuota(montoBrutoCredito, cuotas, interes);
  totalPagoInt = credito1.obtenerTotalAPagar();
  return valorCuota;
}

//* CALCULO DE CAE (CARGA ANUAL EQUIVALENTE) -----------------------------------------------
//Modulo-JS → cae.js
function obtenerCargaAnualEquivalente() {
  totalPagoInt = totalPagoInt * 1;
  let factorMovil = 1 / 100;
  let frecuenciaConversion = 12;
  let anos = cuotas / 12;
  let comprobadorCAE = 0;
  let cuota = cuotaMensualInt;

  while (comprobadorCAE < cuota) {
    factorMovil += 0.00001;
    comprobadorCAE = montoSolicitado * factorMovil / frecuenciaConversion / (1 - (Math.pow((1 + factorMovil / frecuenciaConversion), -(anos * frecuenciaConversion))));
  }
  console.log(factorMovil);
  return factorMovil; //eL factorMovil es el verdadero valor del CAE
}

//* CONVERTIR VALORES TAL COMO SE DEPLEGARÁN EN PANTALLA --------------------------------------
function conversionValores() {
  //DATOS PERSONALES CONVERTIR VALORES A MAYUSCULAS
  idUser;
  nombre;
  celular;
  email ;
  edad ;

  let encontrado0 = almacenDESeguros.find(elem => elem.id === "0")
  if (encontrado0) { 
    tramoDesgravamen = encontrado0.tramo;
  }
  
  let encontrado1 = almacenDESeguros.find(elem => elem.id === "1")
  if (encontrado1) { 
    tramoCesantia = encontrado1.tramo;
  }

  //CONVERTIR FECHA ACTUAL A FORMATO DD/MM/AAAA
  fechaActual = new Date().toLocaleDateString();

  // CONVERTIR MONTOS DE INTEGER A STRING PARA ADQUIRIR EL FORMATO UF 
  UFmontoSolicitado = montoSolicitado / UF;
  UFmontoBrutoCredito = montoBrutoCredito / UF
  UFtotalPago = totalPagoInt / UF;
  UFcuotaMensual = cuotaMensualInt / UF;
  UFprimaDesgravamen = primaDesgravamen / UF;
  UFprimaCesantia = primaCesantia / UF;
  UFtotalSeguros = totalSeguros / UF;

  //CONVERTIR MONTOS DE INTEGER A STRING PARA ADQUIRIR EL FORMATO MONEDA
  montoSolicitadoStr = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(montoSolicitado);
  montoBrutoCreditoStr = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(montoBrutoCredito);
  totalPagoStr = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(totalPagoInt);
  cuotaMensualStr = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(cuotaMensualInt);
  primaDesgravamenStr = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(primaDesgravamen);
  primaCesantiaStr = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(primaCesantia);
  totalSegurosStr = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(totalSeguros);
  gastoNotariaStr = almacenDEGastos[0].costo; //obtener valor desde el array
  gastoNotariaStr = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(gastoNotariaStr);
  gastoImpuestoStr = almacenDEGastos[1].costo; //obtener valor desde el array
  gastoImpuestoStr = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(gastoImpuestoStr);
  totalGastosStr = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(totalGastos);

  //CONVERTIR MONTOS FLOAT A STRING PARA ADQUIRIR FORMATO D EPORCENTAJE
  CAEStr = CAE * 100;
  CAEStr = CAEStr.toFixed(1);
  CAEStr = `${CAEStr} %`;

  tasaCreditoStr = tasaCredito * 100;
  tasaCreditoStr = tasaCreditoStr.toFixed(1);
  tasaCreditoStr = `${tasaCreditoStr} %`;


  //CONVERTIR UF A SISTEMA DECIMAL 
  UFmontoSolicitadoStr = UFmontoSolicitado.toFixed(1);
  UFmontoSolicitadoStr = new Intl.NumberFormat({ style: 'decimal' }).format(UFmontoSolicitado);

  UFmontoBrutoCreditoStr = UFmontoBrutoCredito.toFixed(1);
  UFmontoBrutoCreditoStr = new Intl.NumberFormat({ style: 'decimal' }).format(UFmontoBrutoCreditoStr);

  UFtotalPagoStr = UFtotalPago.toFixed(1);
  UFtotalPagoStr = new Intl.NumberFormat({ style: 'decimal' }).format(UFtotalPagoStr);

  UFcuotaMensualStr = UFcuotaMensual.toFixed(1);
  UFcuotaMensualStr = new Intl.NumberFormat({ style: 'decimal' }).format(UFcuotaMensualStr);

  UFprimaDesgravamenStr = UFprimaDesgravamen.toFixed(1);
  UFprimaDesgravamenStr = new Intl.NumberFormat({ style: 'decimal' }).format(UFprimaDesgravamenStr);

  UFprimaCesantiaStr = UFprimaCesantia.toFixed(1);
  UFprimaCesantiaStr = new Intl.NumberFormat({ style: 'decimal' }).format(UFprimaCesantiaStr);

  UFtotalSegurosStr = UFtotalSeguros.toFixed(1);
  UFtotalSegurosStr = new Intl.NumberFormat({ style: 'decimal' }).format(UFtotalSegurosStr);
}

function generarTabla() {
  console.log("estamos en la funcion generarTabla");

}

//! ========================================================================================
//! __________________________ EVENTO CLICK DEL BOTON LIMPIAR ______________________________
//! ////////////////////////////////////////////////////////////////////////////////////////

//* BUTTON LIMPIAR - REALIZA RESET DE TODOS LOS VALORES INTRODUCIDOS -----------------------
function clickLimpiar() {
  //* Limpiando cajas de datos personales 
  REFrutTex.value = "";
  REFuserTex.value = "";
  REFceluTel.value = "";
  REFemailEma.value = "";
  REFedadSel.selectedIndex = REFedadSel.options[0];
  document.getElementById('bienvenidoUsuarioH2').textContent = "Crédito de Consumo";

  //* Limpiando cajas de datos Simulación
  REFcreditoTex.value = "";
  REFcuotasTex.value = "";
  REFcreditoRan.value = "500000";
  REFcuotasRan.value = "6";

  //* resetando los checkbox seleccionados
  for (let i = 0; i <= REFsegurosChe.length - 1; i++) {
    REFsegurosChe[i].checked = false;
  }
}

//* _____________________________________________________________________________________
//* BUTTON LIMPIAR: borrarParrafo() --> -------------------------------------------------
//* BORRA EL RESULTADO DEL CALCULO DE SIMULACIÓN DESPLEGADO EN TIEMPO DE EJECUCIÓN ------
//* =====================================================================================

// function borrarParrafo() {
//   //* padre resultadoFie, Hijo resultadoP
//   let REFresultadosFie = document.getElementById("resultadosFie"); //* Nodo Padre
//   let nodosHijos = REFresultadosFie.children;
//   let NodoPadreLenght = nodosHijos.length;
//   console.log(`El largo del fieldset es ${NodoPadreLenght}`);

//   if (NodoPadreLenght > 0) {
//     let REFresultadosP = document.getElementById("resultadosP");
//     REFresultadosP.remove();
//   }
// }




