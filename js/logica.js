// IMPORTAR un array, porque lo vamos utilizar
import { movimientos } from './data.js';

// IMPORTAR supabase desde CDN (para proyectos sin bundler)
// Configuración de Supabase
const supabaseUrl = 'https://kufbnscaaljjpybnaabg.supabase.co'
// IMPORTANTE: Reemplaza 'TU_ANON_KEY_AQUI' con tu clave anon/public de Supabase
const supabaseKey = 'sb_publishable_k-sc2ODvAUFdkmewFX5_HA_o536dkkK'

// Crear cliente de Supabase (se inicializará después de cargar el script)
let supabase = null;

// Función para inicializar Supabase
function initSupabase() {
    if (window.supabase) {
        supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
        console.log('Supabase inicializado correctamente');
    } else {
        console.error('Error: La librería de Supabase no se ha cargado');
    }
}

// Función para guardar movimiento en Supabase
async function guardarEnSupabase(movimiento) {
    if (!supabase) {
        console.error('Supabase no está inicializado');
        return null;
    }
    
    const { data, error } = await supabase
        .from('movimientos')
        .insert([movimiento])
        .select();
    
    if (error) {
        console.error('Error al guardar en Supabase:', error.message);
        return null;
    }
    
    console.log('Movimiento guardado en Supabase:', data);
    return data;
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initSupabase);


// DOM de los nodos del formulario
const form = document.getElementById('formulario');
const concepto = document.getElementById('concepto');
const importe = document.getElementById('importe');
const tipo = document.getElementById('tipo');


// **********************************
// Espera al evento del botón submit
// Evento submit del formulario
form.addEventListener('submit', async function(event) {
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

    // Guardar en Supabase
    const resultado = await guardarEnSupabase(movimiento);
    
    if (resultado) {
        // Solo añadir al array local si se guardó correctamente en Supabase
        movimientos.push(movimiento);
        
        // Limpiar el formulario
        form.reset();

        // Mostrar los movimientos en la consola
        console.log(movimientos)

        // Llamadas a funciones de apoyo
        agregarMovimientoATabla(movimiento);
        calcularBalance();
    } else {
        alert('Error al guardar el movimiento. Revisa la consola para más detalles.');
    }

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
    celdaImporte.textContent = `${movimiento.importe}€`;
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
    balanceIngresos.textContent = `${totalIngresos}€`;
    balanceGastos.textContent = `${totalGastos}€`;

    const balance = totalIngresos - totalGastos;
    balanceTotal.textContent = `${balance}€`;
}
