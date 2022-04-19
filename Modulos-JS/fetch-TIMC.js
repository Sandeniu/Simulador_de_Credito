//* OBTENER UF TIMC 
//* ===============
// TIMC significa Tasa de interés máxima convencional. las entidades financieras no pueden sobrepasar estas tasas.

let TIMC = [0 , 0, 0]; 
//almacena los valores de tasas de interés máxima convencional para los 3 tramos
// TIMC[0] = tasa para créditos menores de 1 año
// TIMC[1] = tasa para créditos mayores de 1 año; e inferiores o iguales a 2000 UF
// TIMC[2] = tasa para créditos mayores de 1 año; y Superiores a 2000 UF

let URL2 = "https://api.cmfchile.cl/api-sbifv3/recursos_api/tmc/2022?apikey=532c6af64f6d4c35bb6d34080f9c052c2cd96a21&formato=json";

fetch(URL2)
    .then((response) => response.json())
    .then((data) => {
       
       //ANÁLISIS DE DATA REQUEST 
       console.log(data); // data en bruto. Se trata de un json anidaddo, contiene una única propiedad llamada TMCs cuyo valor es un json  → {TMCs: Array(36)}  
       console.log(data.TMCs[0]);   // se aacede al índice 0 de la propiedad TMCs → {Titulo: null, SubTitulo: 'Operaciones...', Valor: '23.66', Fecha: '2022-01-15'}
       console.log(data.TMCs[0].Fecha); // se aacede a la propiedad Fecha, del índice 0, de la propiedad TMCs →  2022-01-15
       
       //TRANSFORMACIÓN DE DATA PARA LOS REQUERIMIENTOS DE ESTE PROGRAMA
       //la siguiente instruccion transforma la propiedad TMCs en array, así podrá ser recorrido con un forEach 
       //La propiedad TMCs posee como valor un json con todos los valores que necesitamos
       let propiedadTMCs = data.TMCs;

       /*
       // verificar si la transformación en array surgió efecto
        if (Array.isArray(propiedadTMCs)) {
            alert(`el data TMCs fue convertido en array`)
        } else {
            alert(`el data de tipo: ${typeof data} no pudo ser convertido en array`);
        }
        */

        propiedadTMCs.forEach(e => {
            if (e.Fecha === "2022-03-15") {
                if (e.Tipo === "21"){ //tasa máxima convencional para créditos menores de 1 año
                    TIMC[0] = e.Valor * 0.5; 
                }
                if (e.Tipo === "24"){ //tasa máxima convencional para créditos mayores de 1 año; e inferiores o iguales a 2000 UF
                    TIMC[1] = e.Valor * 0.5; 
                }

                if (e.Tipo === "22"){ //tasa máxima convencional para créditos mayores de 1 año; y superiores a 2000 UF
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
    })
        
      