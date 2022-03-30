const boton_agregar = document.getElementById('boton-agregar');
const lista_compras = document.querySelector('.lista-compras');
const boton_limpiar = document.querySelector('.boton-limpiar');

boton_agregar.addEventListener('click', () => {
  agregarCompra("")
})

boton_limpiar.addEventListener('click', () => {
  limpiarTodo()
})

lista_compras.addEventListener('click', (event) => {
  if(event.path[0].type == 'submit') {
    eliminarCompra(event.path[1].id)
  }
})

lista_compras.addEventListener('keypress', (event) => {
  if (event.keyCode == 13) {
    editarCompra(event.path[1].id, event.path[0].value)
  }
})

// Local Storage

var arregloCompras = []
var contador = 0

const getContador = () => {
  const cont = localStorage.getItem("contador")
  return cont
}

const setContador = () => {
    localStorage.setItem("contador",contador)
}

const inicilizarContador = () => {
  if (getContador() != null) {
    contador = getContador()
  }
}

const getArregloCompras = () => {
  setContador()
  const arreglo = JSON.parse(localStorage.getItem("arregloCompras"))
  return arreglo
}

const setArregloCompras = () => {
  localStorage.setItem("arregloCompras",JSON.stringify(arregloCompras))
  listarCompras()
}

const agregarCompra = (descripcion) => {
  contador++
  let objCompra = {
    id: contador,
    descripcion: descripcion
  }
  if (getArregloCompras() != null) {
    arregloCompras = getArregloCompras()
  }
  arregloCompras.push(objCompra)
  setArregloCompras()
}

const listarCompras = () => {
  lista_compras.innerHTML = ''
  let datos = getArregloCompras()
  if (datos != null) {
    for (const compra of datos.reverse()) {
      lista_compras.innerHTML += `
        <li id="${compra.id}">
            <input type="text" class="input-compra" value="${compra.descripcion}">  
            <button class="boton-eliminar">X</button>
        </li>
      `
    }
  }
}

const editarCompra = (idCompra, descripcion) => {
  let newCompra = {
    id: idCompra,
    descripcion: descripcion
  }
  let datos = getArregloCompras()
  let newArreglo = []
  if (datos != null) {
    for (const compra of datos) {
      if (compra.id == idCompra) {
        newArreglo.push(newCompra)
      }else{
        newArreglo.push(compra)
      }
    }
  }
  arregloCompras = newArreglo
  setArregloCompras()
}

const eliminarCompra = (idCompra) => {
  let datos = getArregloCompras()
  let newArreglo = []
  if (datos != null) {
    for (const compra of datos) {
      if (compra.id != idCompra) {
        newArreglo.push(compra)
      }
    }
  }
  arregloCompras = newArreglo
  setArregloCompras()
}

const limpiarTodo = () => {
  arregloCompras = []
  contador = 0
  setArregloCompras()
  setContador()
}

// inicia
/*inicilizarContador()
listarCompras()*/
