
var tabla;
var diccionario = [];
var pistasRestantes = 3;
var guardar = false;
var id = 1;

function generarTabla() {
    // Obtenemos la referencia del elemento body
    var body = document.getElementById("pasatiempo");
    body.innerHTML = "";
    // Creamos un elemento <table> y un elemento <tbody>
    tabla = document.createElement("table");
    tabla.setAttribute("class", "common");
    var tblBody = document.createElement("tbody");
    var contador = 1;
    // Creamos las celdas
    for (var i = 0; i < 6; i++) {
        // Creamos las hileras de la tabla
        var fila = document.createElement("tr");
        var celda = document.createElement("td");
        //celda inicial vacia
        fila.appendChild(celda);
        for (var j = 0; j < 4; j++) {
            addCeldaInput(fila);
        }
        if (i === 0 || i === 5) {
            addCeldaTexto(fila, contador);
            contador++;
        }
        // agregamos la hilera al final de la tabla (al final del elemento tblbody)
        tblBody.appendChild(fila);
    }
    // Creamos las celdas
    for (let i = 0; i < 6; i++) {
        // Creamos las hileras de la tabla
        var fila = document.createElement("tr");
        if (i === 0 || i === 5) {
            addCeldaTexto(fila, contador);
            contador++;
        } else {
            var celda = document.createElement("td");
            fila.appendChild(celda);
        }
        for (var j = 0; j < 6; j++) {
            addCeldaInput(fila);
        }
        // agregamos la hilera al final de la tabla (al final del elemento tblbody)
        tblBody.appendChild(fila);
    }
    // posicionamos el <tbody> debajo del elemento <table>
    tabla.appendChild(tblBody);
    // appends <table> into <body>
    body.appendChild(tabla);
    tabla.setAttribute("id", "tabla_pasatiempo");

    for (i = 0; i < 11; i++) {
        console.log(localStorage.getItem("" + i + ""));
    }

}

function addCeldaTexto(fila, texto) {
    let celda = document.createElement("td");
    let h1 = document.createElement("h1");
    let label = document.createTextNode(texto);
    h1.setAttribute("id", "label_pasatiempo");
    h1.appendChild(label);
    celda.appendChild(h1);
    fila.appendChild(celda);
}

function addCeldaInput(fila) {
    let celda = document.createElement("td");
    let inputCelda = document.createElement("INPUT");
    inputCelda.setAttribute("maxlength", "1");
    inputCelda.setAttribute("type", "text");
    inputCelda.setAttribute("onchange", "comprobarPasatiempo()");
    inputCelda.setAttribute("onkeyup", "cambiarCursor(event)");

    celda.appendChild(inputCelda);
    fila.appendChild(celda);
}

function cambiarCursor(event) {
    let tecla = event.keyCode;
    let inputField = event.target;
    //Si es tabulador no actúo
    if (tecla === 9) {
        return 0;
    }
    //Mover atrás al pulsar borrado
    if (tecla === 8 && inputField.value.length === 0) {
        retrocederCelda(event);
        //Mover adelante
    } else if (inputField.value.length > 0) {
        avanzarCelda(event);
    }
}

function avanzarCelda(event){
    elemento = $(event.target).closest('td').next().find('input');
    //Estoy en la última celda escribiendo (No ha conseguido encontrar input)
    if (elemento.get().length === 0) {
        elemento = $(event.target).closest('tr').next().children().first().next().find('input');
    }
    elemento.focus();
    //elemento.select();
}

function retrocederCelda(event){
    elemento = $(event.target).closest('td').prev().find('input');
    //Estoy en la primera celda borrando (No ha conseguido encontrar input)
    if (elemento.get().length === 0) {
        elemento = $(event.target).closest('tr').prev().find('input');
    }
    elemento.focus();
    //elemento.select();
}

function comprobarPasatiempo() {

    vector_pasatiempo = JSON.stringify(pasatiempo_a_vector());
    $.ajax({
        method: "POST",
        url: "check_pasatiempo.php",
        data: { pasatiempo: vector_pasatiempo, id:id }
    })
    .done(function( response ) {
        console.log(response);
        let filas_corregidas = JSON.parse(response);
        filas_corregidas.forEach(function(value, i){
            cambiarFondoInputTabla(i, value);
        });
    });
}

function esFilaCompleta(fila) {

    let completo = true;
    for (let j = 1; j < fila.cells.length && completo; j++) {
        let td = fila.cells[j];
        let cell = td.getElementsByTagName('input')[0];
        if (cell != null) {
            let cellValue = cell.value;
            if (cellValue === "") {

                completo = false;
            }
        }
    }
    return completo;
}

function leerFila(fila) {
    let palabra = "";
    for (let i = 1; i < fila.cells.length; i++) {
        var cell = fila.cells[i].getElementsByTagName('input')[0];
        //No entra si es etiqueta
        if (cell != null) {
            if (cell.value === "") {
                palabra = palabra.concat(" ");
            } else {
                palabra = palabra.concat(cell.value.toLowerCase());
            }
            palabra = eliminarAcentos(palabra);
        }

    }
    return palabra;
}
//Precondición: La palabra tiene una longitud adecuada a la fila
function escribirFila(fila, palabra) {
    //Recupero valor guardado
    if (palabra != null) {
        for (let i = 1; i < palabra.length + 1; i++) {
            let letra = palabra[i - 1];
            if (letra != " ") {
                var cell = fila.cells[i].getElementsByTagName('input')[0];
                cell.value = letra;
            }

        }
    }
}
function cargarDiccionario() {
    console.log("Cargando diccionario...");
    url = "https://diccionario.casasoladerueda.es/diccionario.txt";
    //fetch es asincrono
    fetch(url)
        .then(function (response) {
            response.text().then(function (text) {
                let palabras = text.split('\n');
                for (let i = 0; i < palabras.length; i++) {
                    if (palabras[i].length === 4 || palabras[i].length === 6) {

                        diccionario.push(eliminarAcentos(palabras[i]));
                    }
                }
                //console.log(diccionario);
                //comprobarPalabras();
            });
        });

}

function cambiarFondoInputTabla(num_fila, tipo) {
    let color = "#ffffff"
    if (tipo === -1) {
        color = "#f05945";
    } else if (tipo === 1) {
        color = "#a3d2ca";
    }
    
    let fila = tabla.rows[num_fila];

    for (let i = 1; i < fila.cells.length; i++) {
        var cell = fila.cells[i].getElementsByTagName('input')[0];
        //No entra si es etiqueta
        if (cell != null) {
            cell.style.backgroundColor = color;
        }

    }
}

function inicializar() {
    cargarDiccionario();
    generarTabla();

}

function ayuda() {
    let textoEntrada = document.getElementById("ayuda").value;
    
    if (pistasRestantes > 0 && textoEntrada.length > 0) {

        //Si contiene un caracter ajeno al abecedario
        if (textoEntrada.match("[^a-zA-zñÑ]")) {
            document.getElementById("avisosPista").innerHTML = "❌ Revisa la pista";
        } else {
            const match = diccionario.filter(value => palabraMatch(textoEntrada.toLowerCase(), value));
            console.log(match);
            document.getElementById("pistas").innerHTML = match.join('\t');
            document.getElementById("avisosPista").innerHTML = match.length + " resultados";
            pistasRestantes--;
            document.getElementById("pistasRestantes").innerHTML = "Quedan " + pistasRestantes + " pistas";
        }

    } else if (textoEntrada.length === 0) {
        document.getElementById("avisosPista").innerHTML = "⚠️ Rellena el campo";
    } else {
        document.getElementById("avisosPista").innerHTML = "⚠️ ¡Ya no dispones de más pistas!";
    }

    if (pistasRestantes === 0) {
        console.log("Bloqueando...");
        document.getElementById("btnSearch").disabled = true;
        document.getElementById("pistasRestantes").innerHTML = "⚠️ ¡Ya no dispones de más pistas!";
    }
}
function palabraMatch(inputPista, currentValue) {
    let valido = true;

    for (let i = 0; i < inputPista.length && valido; i++) {
        let letra = inputPista[i];
        valido = currentValue.includes(letra);
        currentValue = currentValue.replace(letra, "");
    }
    return valido;
}
function eliminarAcentos(cadena) {
    cadena = cadena.replace(/á/gi, "a");
    cadena = cadena.replace(/é/gi, "e");
    cadena = cadena.replace(/í/gi, "i");
    cadena = cadena.replace(/ó/gi, "o");
    cadena = cadena.replace(/ú/gi, "u");
    return cadena;
    //return cadena.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

//Evento cierre
window.onbeforeunload = guardarProgreso;

function guardarProgreso() {
    if (guardar) {
        for (let i = 0; i < tabla.rows.length; i++) {
            fila = tabla.rows[i];
            palabra = leerFila(fila);
            localStorage.setItem(id + " " + i + "", palabra);
        }
        let inputPista = document.getElementById("ayuda").value;
        let pistas = document.getElementById("pistas").innerHTML;
        let avisosPista = document.getElementById("avisosPista").innerHTML;

        localStorage.setItem(id + " " +"guardado", guardar);
        localStorage.setItem(id + " " +"pistasRestantes", pistasRestantes);
        localStorage.setItem(id + " " +"inputPista", inputPista);
        localStorage.setItem(id + " " +"pistas", pistas);
        localStorage.setItem(id + " " +"avisosPista", avisosPista);
    }
}


function recuperarProgreso() {
    console.log("Recuperando progreso...");
    for (let i = 0; i < tabla.rows.length; i++) {
        let letra = localStorage.getItem(id+" "+i);
        escribirFila(tabla.rows[i], letra);

    }
    guardar = localStorage.getItem(id + " " +"guardado");
    let auxPistas = localStorage.getItem(id + " " +"pistasRestantes");
    if (auxPistas != null) {
        pistasRestantes = auxPistas;
        if (pistasRestantes > 0) {
            document.getElementById("pistasRestantes").innerHTML = "Quedan " + pistasRestantes + " pistas";
        } else {
            document.getElementById("btnSearch").disabled = true;
            document.getElementById("pistasRestantes").innerHTML = "⚠️ ¡Ya no dispones de más pistas!";
        }
    }
    let inputPista = localStorage.getItem(id + " " +"inputPista");
    let pistas = localStorage.getItem(id + " " +"pistas");
    let avisosPista = localStorage.getItem(id + " " +"avisosPista");
    document.getElementById("ayuda").value = inputPista;
    document.getElementById("pistas").innerHTML = pistas;
    document.getElementById("localStorage").checked = guardar;
    document.getElementById("avisosPista").innerHTML = avisosPista;

}

function reiniciarPasatiempo() {
    generarTabla();
    pistasRestantes = 3;
    document.getElementById("pistasRestantes").innerHTML = "Quedan " + 3 + " pistas";
    document.getElementById("btnSearch").disabled = false;
    document.getElementById("pistas").innerHTML = "";
    document.getElementById("ayuda").value = "";
    document.getElementById("avisosPista").innerHTML = "";
}

function gestionarGuardado() {
    guardar = document.getElementById("localStorage").checked;
    if (!guardar) {
        localStorage.clear();
    }
    console.log("Guardado a: " + guardar);
}

function pasatiempo_a_vector(){
    vector = []
     for (let i = 0; i < tabla.rows.length; i++) {
            fila = tabla.rows[i];
            palabra = leerFila(fila);
            vector.push(palabra);
        }
    return vector;
}

function seleccionarPasatiempo(event){
    let texto = event.target.textContent;

    if(texto=="Principiante"){
        id = 1;
    } else if (texto=="Experto"){
        id = 2;
    } else if (texto=="Leyenda"){
        id = 3;
    }
    inicializarPistasIniciales();
    recuperarProgreso();
    comprobarPasatiempo();
    document.getElementsByClassName("principal")[0].style.opacity="1";
    document.getElementsByClassName("emergente")[0].style.display="none";


}

function inicializarPistasIniciales(){
    if(id==1){
        document.getElementById("pista1").innerHTML="Familia en Escocia";
        document.getElementById("pista2").innerHTML="Tristeza y dolor por algo";
        document.getElementById("pista3").innerHTML="Termino algo definitivamente";
        document.getElementById("pista4").innerHTML="El que torea";
    } else if (id==2){
        document.getElementById("pista1").innerHTML="Saludo típico a una persona";
        document.getElementById("pista2").innerHTML="Cantidad indeterminada, generalmente reducida";
        document.getElementById("pista3").innerHTML="Virus pandémico de 2019";
        document.getElementById("pista4").innerHTML="Instrumento sonoro típico de un vehículo";
    } else if (id==3){
        document.getElementById("pista1").innerHTML="Superficie acotada, que se distingue de lo que la rodea";
        document.getElementById("pista2").innerHTML="Lo que muchos niños no hacen a sus padres";
        document.getElementById("pista3").innerHTML="Elemento ortgráfico que se sitúa sobre algunas vocales";
        document.getElementById("pista4").innerHTML="Empleo de una cosa con un fin determinado";
    }
}