// IMPORTAR un array, porque lo vamos utilizar
import { movimientos } from './data.js';


// DOM de los nodos del formulario
const form = document.getElementById('formulario');
const concepto = document.getElementById('concepto');
const importe = document.getElementById('importe');
const tipo = document.getElementById('tipo');


// **********************************
// Espera al evento del botón submit
// Evento submit del formulario
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el envío del formulario por defecto

    // Obtener los valores del formulario
    const conceptoValue = concepto.value;
    const importeValue = parseFloat(importe.value);
    const tipoValue = tipo.value;

    // Todo la información que obtenemos de .value tiene que ser un objeto, y cada objeto tiene que estar dentro del array movimientos
    const movimiento = {
        concepto: conceptoValue,
        importe: importeValue,
        tipo: tipoValue
    };

    // Añadir el nuevo movimiento al array
    movimientos.push(movimiento);

    // Limpiar el formulario
    form.reset();

    // Mostrar los movimientos en la consola (puedes cambiar esto para mostrarlo en la UI)
    console.log(movimientos)

    // Llamadas a funciones a apoyo
    agregarMovimientoATabla(movimiento);
    calcularBalance();

});

// **********************************
// contructor de la tabla en el HTML
// Función para agregar un movimiento a la tabla en el HTML
function agregarMovimientoATabla(movimiento) {
    const tabla = document.getElementById('introMovimientos')
    // Creado una fila y sus celdas
    const nuevaFila = tabla.insertRow();

    const celdaConcepto = nuevaFila.insertCell(0);
    const celdaImporte = nuevaFila.insertCell(1);
    const celdaTipo = nuevaFila.insertCell(2);

    // Asignar los valores de el objeto creado a las celdas
    celdaConcepto.textContent = movimiento.concepto;
    celdaImporte.textContent = movimiento.importe;
    celdaTipo.textContent = movimiento.tipo;
}



// **********************************
// Todas las operaciones matematicas
// Función que sumar todos los gastos, ingresos y luego nos hace el balance de ingresos-gastos
function calcularBalance() {
    let totalIngresos = 0;
    let totalGastos = 0;

    // Recorrer el array de movimientos y sumar los importes según su tipo
    movimientos.forEach(movimiento => {
        if (movimiento.tipo === 'ingreso') {
            totalIngresos += movimiento.importe;
        } else if (movimiento.tipo === 'gasto') {
            totalGastos += movimiento.importe;
        }
    });

    // La suma total de ingresos y gastos se muestra en el HTML
    const balanceIngresos = document.getElementById('balanceIngresos');
    const balanceGastos = document.getElementById('balanceGastos');
    const balanceTotal = document.getElementById('balanceTotal');

// Actualizar los valores en el HTML
    balanceIngresos.textContent = totalIngresos;
    balanceGastos.textContent = totalGastos

    const balance = totalIngresos - totalGastos;
    balanceTotal.textContent = balance
}
