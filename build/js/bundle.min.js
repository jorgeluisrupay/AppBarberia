let pagina =1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded',function(){
    mostrarServicios();
    mostrarSeccion();
    iniciarApp();

});

function iniciarApp(){
    //mostrarServicios();

    //Resaltar al div actual al k se preciona
    //mostrarSeccion();

    //Oculta o muestra una seccion segun el tab al q se presiona
    cambiarSeccion();


    //Paginacion siguiente y anterior
    paginaSiguiente();

    paginaAnterior();

    //Comprobar la paginacion
    botonesPaginador();

    //Muestra el resumen de la cita o mensaje error en caso no oase la convalidacion
    mostrarResumen();

    //Almacena el nombre de la cita en el objeto
    nombreCita();

    //Almacena la fecha de la cita en el objeto
    fechaCita();
    
    //Deshabilitar dias pasados
    deshabilitarFechaAnterior();

    //Almacena la hora de la cita
    horaCita();
}

function mostrarSeccion(){
    //Eliminar mostrar-seccion de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if(seccionAnterior ){
        seccionAnterior.classList.remove('mostrar-seccion')
    }
    


    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion')

    //Elimiar la clase de actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if(tabAnterior){
        tabAnterior.classList.remove('actual');
    }
    
    

    //Resaltar el tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`)
    tab.classList.add('actual');
}

function cambiarSeccion(){
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach( enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);
            //console.log(pagina);
            
            //Llamar la funcion de mostrar seccion
            mostrarSeccion();
            botonesPaginador();

        })
    })
}

async function mostrarServicios(){
    try{
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();
        //console.log(db.servicios);
        const {servicios} = db;
        //Generar HTML
        servicios.forEach(servicio => {
            const {id,nombre,precio} = servicio;
            
            //DOM Scripting
            //Generar nombre del servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio')

           // console.log(nombreServicio);

            //Generar precio del servicio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio')

            //console.log(precioServicio);

            //Generar el div contenedor del servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            //Selecciona un servicio para la cita
            servicioDiv.onclick = seleccionarServicio;


            //Inyectar precio y nombre al div de servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);
            //console.log(servicioDiv);

            //Inyectarlo al html
            document.querySelector('#servicios').appendChild(servicioDiv)

        })

    } catch (error){
        console.log(error);
    }
}

function seleccionarServicio(e){

    let elemento;
    //console.log(e.target.tagName);
    //Forzar que el element k demos click sea el div
    if(e.target.tagName ==='P'){
        elemento=e.target.parentElement;
        
    }else{
        elemento = e.target;
    }

    //Para seleccionar o desseleccionar 
    if(elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idServicio );

        eliminarServicio(id);
    }else{
        elemento.classList.add('seleccionado');
        //console.log(elemento.firstElementChild.nextElementSibling.textContent);

        const servicioObj ={
            id: parseInt( elemento.dataset.idServicio ),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }
        // console.log(servicioObj);
        agregarServicio(servicioObj);
       
    }
    
}

function eliminarServicio(id){
    //console.log('Eliminando.........',id);
    const { servicios } = cita;
    cita.servicios = servicios.filter( servicio => servicio.id !== id );
    console.log(cita);
}
function agregarServicio(servicioObj){
    const {servicios } = cita;
    cita.servicios = [...servicios, servicioObj]; //una copia
    //console.log('Agregando.........');

    console.log(cita);
}
//Paginacion
function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente')
    paginaSiguiente.addEventListener('click',()=>{
        pagina++;
        console.log(pagina);

        botonesPaginador();
    });
}

function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior')
    paginaAnterior.addEventListener('click',()=>{
        pagina--;
        console.log(pagina);

        botonesPaginador();
    });
}

function botonesPaginador(){
    const paginaSiguiente = document.querySelector('#siguiente')
    const paginaAnterior = document.querySelector('#anterior')

    if(pagina ===1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar')
        
    }else if(pagina===3){
        paginaSiguiente.classList.add('ocultar')
        paginaAnterior.classList.remove('ocultar')

        mostrarResumen(); //carga el resumen de la cita
    }else{
        paginaAnterior.classList.remove('ocultar')
        paginaSiguiente.classList.remove('ocultar')
    }
    mostrarSeccion();
}


function mostrarResumen(){
    //Destructurind
    const { nombre, fecha, hora, servicios} = cita;

    //Seleccionar el Resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    //Limpia el HTML previo
    while( resumenDiv.firstChild){
        resumenDiv.removeChild( resumenDiv.firstChild);
    }

    //validacion de objetos
    //console.log(Object.values(cita));
    if(Object.values(cita).includes('')){
        //console.log('El objeto esta vacio');
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de Servicios, hora, fecha o nombre';

        noServicios.classList.add('invalidar-cita');

        //Agregar a resumen Div
        resumenDiv.appendChild(noServicios);
        return;
    }

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';

    //Moatrar el resumen
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre: </span> ${nombre}`;


    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha: </span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora: </span> ${hora}`;

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';

    serviciosCita.appendChild(headingServicios);

    let cantidad=0;

    //Iterar sobre el arreglo de servicios
    servicios.forEach( servicio =>{

        const { nombre,precio } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$');
        console.log(parseInt(totalServicio[1].trim()));

        cantidad += parseInt(totalServicio[1].trim());

        //Colocar texto y precio en el div
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);
    });

    console.log(cantidad);

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);

    resumenDiv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>Total a Pagar: </span> $ ${cantidad}`;

    resumenDiv.appendChild(cantidadPagar);
}

function nombreCita(){
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input',e =>{
        const nombreTexto = e.target.value.trim();//elimina el espacio en blanco
        console.log(nombreTexto);

        //VALIDACION DE QUE nombreTexto debe tener algo
        if(nombreTexto ==='' || nombreTexto.length < 3){
            mostrarAlerta('Nombre no valido', 'error');
            //console.log('Nombre no valido','error');
        }else{
            const alerta = document.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }
            cita.nombre = nombreTexto;
            //console.log(cita);
            //console.log('Nombre Valido');
        }

    });
}

function mostrarAlerta(mensaje, tipo) {
    //console.log('El mensaje es ',mensaje);
    //Si hay alerta previa, entonces no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia){
        return;
    }


    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo ==='error'){
        alerta.classList.add('error');
    }

    //console.log(alerta);

    //Insertar en el HTML
    const formulario = document.querySelector('.formulario')
    formulario.appendChild( alerta );

    //Eliminar en el html la alerta
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function fechaCita(){
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input' , e=>{
        //console.log(e.target.value);

        const dia = new Date(e.target.value).getUTCDay();
        console.log(dia);
        /*const opciones ={
            weekday: 'long',
            year: 'numeric',
            month: 'long',
        }
        console.log(dia.toLocaleDateString('es-ES', opciones));*/
        if([0].includes(dia)){ //[0,6] domingo o sabado
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Dia no validos','error')
            console.log('Seleccionastes Domingo que nos es valido');
        }else{
            cita.fecha= fechaInput.value;
          //  console.log('Dia valido');
            console.log(cita);
        }

    })
}

function deshabilitarFechaAnterior(){
    
    const inputFecha = document.querySelector('#fecha');
 
    
    fechaAhora = new Date();
    const year=fechaAhora.getFullYear();
    let mes=fechaAhora.getMonth()+1;
    let dia=fechaAhora.getDate()+1;
 
    //formato deseado 2021-02-22 (AAAA-MM-DD)
    let  fechaDehabilitar= `${year}-${mes}-${dia}`;
 
    if(mes < 10){
 
       fechaDehabilitar= `${year}-0${mes}-${dia}`;
    }
    if(dia < 10){
 
       fechaDehabilitar= `${year}-${mes}-0${dia}`;
    }
    console.log(fechaDehabilitar);
    
    inputFecha.min = fechaDehabilitar;
   

}

function horaCita(){
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input' , e =>{
        console.log(e.target.value);

        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if(hora[0]<8 || hora[0]>18){
            console.log('Horas no Valida');
            mostrarAlerta('Hora no valida','error');
            setTimeout(() => {
                inputHora.value='';
            }, 3000);
            
        }else{
            console.log('Horas validas');
            cita.hora = horaCita;

            console.log(cita);
        }   
    })
}