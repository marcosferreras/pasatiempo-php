<?php
$response = [];
$diccionario = [];
main();

function main(){
    global $response, $diccionario;
    $text = $_POST['pasatiempo'];
    $id = $_POST['id'];
    $tablero = json_decode($text);
    cargarDiccionario();
    comprobarPasatiempo($tablero, $id);
    $json_response = json_encode($response);
    echo($json_response);
}

function comprobarPasatiempo($tablero_pasatiempo, $id){
    global $response;
    foreach($tablero_pasatiempo as $index=>$fila){
        $completa = esFilaCompleta($fila);

        if(!$completa){
            #Equivalente a array_push. Inserta al final
            $response [] = 0;
        } else {
            $esValido = comprobarPalabraValida($fila, $index, $tablero_pasatiempo, $id);
            if ($esValido) {
                //cambiarFondoInputTabla(fila, "correcto");
                $response [] = 1;
            } else {
                //cambiarFondoInputTabla(fila, "error");
                $response [] = -1;
            }
        }
    }
}


function esFilaCompleta($fila) {
    #Si se encuentra el caracter, entonces la fila no es completa
    return !includes($fila, " ");
}

function includes($cadena, $letra) {
    $pos = strpos($cadena, $letra);
    
    if ($pos !== false) {
        return true;
    } 
    return false;
}

function comprobarPalabraValida($palabra, $numFila, $tablero_pasatiempo, $id_pasatiempo) {
    $pas_1 = ["clan", "pena", "remato", "torero"];
    $pas_2 = ["hola", "algo", "corona", "bocina"];
    $pas_3 = ["zona", "caso", "acento", "manejo"];
    $pasatiempo = [];
    if($id_pasatiempo == 1){
         $pasatiempo = $pas_1;
    } else if ($id_pasatiempo == 2){
        $pasatiempo = $pas_2;
    } else if ($id_pasatiempo == 3){
        $pasatiempo = $pas_3;
    } else {
        return 0;
    }

    if ($numFila === 0) {
        return $palabra === $pasatiempo[0];
    } else if ($numFila === 5) {
        return $palabra === $pasatiempo[1];
    } else if ($numFila === 6) {
        return $palabra === $pasatiempo[2];
    } else if ($numFila === 11) {
        return $palabra === $pasatiempo[3];
    } else if ($numFila % 2 == 1) {
        return comprobarImpares($tablero_pasatiempo, $palabra, $numFila);
    } else {
        return comprobarPares($tablero_pasatiempo, $palabra, $numFila);
    }
}

//Precondición: La fila actual está completa
function comprobarImpares($tablero_pasatiempo, $palabraFila, $numFila) {
    global $response, $diccionario;
    //Comprobar que la fila anterior no esté a medias
    if (!esFilaCompleta($tablero_pasatiempo[$numFila - 1])) {
        return false;
    }
    
    //Obtener fila anterior
    $palabraFilaAnterior = $tablero_pasatiempo[$numFila - 1];
    $distintos = 0;

    for ($i = 0; $i < strlen($palabraFila) && $distintos < 2; $i++) {
        if ($palabraFilaAnterior[$i] !== $palabraFila[$i]) {
            $distintos++;
        }
    }

    if ($distintos == 1) {

        return in_array($palabraFila, $diccionario);

    } else {

        return false;
    }
}
//Precondición: La fila actual está completa
function comprobarPares($tablero_pasatiempo, $palabraFila, $numFila) {
    global $response, $diccionario;
    

    //Comprobar que la fila anterior no esté a medias
    if (!esFilaCompleta($tablero_pasatiempo[$numFila - 1])) {
        return false;
    }
    $palabraFilaAnterior = $tablero_pasatiempo[$numFila - 1];
    $valido = true;

    $palabraFilaAux = $palabraFila;

    while (strlen($palabraFilaAnterior) > 0 && $valido) {

        $letra = $palabraFilaAnterior[0];
        $valido = includes($palabraFilaAux, $letra);

        $palabraFilaAnterior = preg_replace('/' .$letra. '/', "", $palabraFilaAnterior, 1);
        $palabraFilaAux = preg_replace('/' .$letra. '/', "", $palabraFilaAux, 1);

        
    }

    if ($valido) {
        //Comprobar que la penultima del bloque también se ajusta a la última, y no solo a la anterior palabra
        if ($numFila === 4 || $numFila === 10) {
            $validoSiguiente = comprobarImpares($tablero_pasatiempo, $tablero_pasatiempo[$numFila + 1], $numFila + 1);
            return in_array($palabraFila, $diccionario) && $validoSiguiente;
        }

        return in_array($palabraFila, $diccionario);

    } else {
        return false;
    }
}

function cargarDiccionario() {
    global $diccionario;
    $archivo = fopen("diccionario.txt", "r");

    while(!feof($archivo)) {

        $linea = eliminarAcentos(fgets($archivo));
    
        if (strlen($linea) === 4 || strlen($linea) === 6) {
            $diccionario [] = $linea;
        }
    }


    fclose($archivo);
}

function eliminarAcentos($cadena) {
     $cadena = str_replace(
        array('á', 'é', 'í', 'ó', 'ú', "\n"),
        array('a', 'e', 'i', 'o', 'u', ""),
        $cadena );

    return $cadena;

}

?>