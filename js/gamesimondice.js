
const juego = () => {
    const sleep = m => new Promise(r => setTimeout(r, m));
    const cargarSonido = function (fuente) {
        const sonido = document.createElement("audio");
        sonido.src = fuente;
        sonido.setAttribute("preload", "auto");
        sonido.setAttribute("controls", "none");
        sonido.style.display = "none";
        document.body.appendChild(sonido);
        return sonido;
    }
    const partidoEn16 = (Math.PI * 2) / 16;
    const centroX = 200, centroY = 200;
    const radioCirculo = 200;
    const radioCuarto = 170;
    const radioCirculoCentral = 80;
    const distancia = 10;
    const gamma = 2;
    const milisegundosCpu = 200,
        milisegundosUsuario = 100;
    const sonidoSuperiorIzquierda = cargarSonido("../sounds/1.mp3"),
        sonidoSuperiorDerecha = cargarSonido("../sounds/2.mp3"),
        sonidoInferiorIzquierda = cargarSonido("../sounds/3.mp3"),
        sonidoInferiorDerecha = cargarSonido("../sounds/4.mp3");

    let puedeJugar = false;
    let contador = 0;
    let puntaje = 0;
    let secuencia = [];

    const cyan = d3.color("#00B0F6"),
        magenta = d3.color("#F50087"),
        amarillo = d3.color("#FFE900"),
        negro = d3.color("#212121"),
        gris= d3.color("#474b4e");


    const circuloFondo = d3.arc()
        .innerRadius(0)
        .outerRadius(radioCirculo)
        .startAngle(0)
        .endAngle(Math.PI * 2);

    const circuloCentral = d3.arc()
        .innerRadius(0)
        .outerRadius(radioCirculoCentral)
        .startAngle(0)
        .endAngle(Math.PI * 2);

    const $svg = d3.select("#contenedorJuego")
        .append("svg")
        .attr('width', 400)
        .attr('height', 400);

    $svg.append("g")
        .attr("transform", `translate(${centroX},${centroY})`)
        .append("path")
        .attr("d", circuloFondo)
        .attr("fill", gris);


    const superiorIzquierda = $svg.append("g")
        .attr("transform", `translate(${centroX - distancia},${centroY - distancia})`)
        .attr("class", "boton")
        .append("path")
        .attr("d",
            d3.arc()
                .innerRadius(0)
                .outerRadius(radioCuarto)
                .startAngle(partidoEn16 * 12)
                .endAngle(partidoEn16 * 16)
        )
        .attr("fill", cyan);


    const superiorDerecha = $svg.append("g")
        .attr("transform", `translate(${centroX + distancia},${centroY - distancia})`)
        .attr("class", "boton")
        .append("path")
        .attr("d",
            d3.arc()
                .innerRadius(0)
                .outerRadius(radioCuarto)
                .startAngle(0)
                .endAngle(partidoEn16 * 4)
        )
        .attr("fill", magenta);
    

    const inferiorDerecha = $svg.append("g")
        .attr("transform", `translate(${centroX + distancia},${centroY + distancia})`)
        .attr("class", "boton")
        .append("path")
        .attr("d",
            d3.arc()
                .innerRadius(0)
                .outerRadius(radioCuarto)
                .startAngle(partidoEn16 * 4)
                .endAngle(partidoEn16 * 8)
        )
        .attr("fill", amarillo);

        const inferiorIzquierda = $svg.append("g")
        .attr("transform", `translate(${centroX - distancia},${centroY + distancia})`)
        .attr("class", "boton")
        .append("path")
        .attr("d",
            d3.arc()
                .innerRadius(0)
                .outerRadius(radioCuarto)
                .startAngle(partidoEn16 * 8)
                .endAngle(partidoEn16 * 12)
        )
        .attr("fill", negro);

    // Encima de los otros círculos, el círculo central
    $svg.append("g")
        .attr("transform", `translate(${centroX},${centroY})`)
        .append("path")
        .attr("d", circuloCentral)
        .attr("fill", gris);

    const textoPuntaje = $svg.append("text")
        .attr("transform", `translate(${centroX},${centroY})`)
        .attr("fill", "#ffffff")
        .attr("font-size", 30)
        .attr("font-weight", "bold")
        .attr("font-family", "Courier")
        .style("text-anchor", "middle")
        .style("dominant-baseline", "central")
        .text("0")
    const encenderYApagarBoton = async (boton, duracion) => {
        puedeJugar = false;
        const colorActual = boton.attr("fill");
        let sonidoQueSeReproduce;
        if (compararBotones(boton, superiorIzquierda)) {
            sonidoQueSeReproduce = sonidoSuperiorIzquierda;
        } else if (compararBotones(boton, superiorDerecha)) {
            sonidoQueSeReproduce = sonidoSuperiorDerecha;
        } else if (compararBotones(boton, inferiorIzquierda)) {
            sonidoQueSeReproduce = sonidoInferiorIzquierda
        } else {
            sonidoQueSeReproduce = sonidoInferiorDerecha;
        }
        sonidoQueSeReproduce.currentTime = 0;
        await sonidoQueSeReproduce.play();
        boton.attr("fill", d3.color(colorActual).brighter(gamma))
        await sleep(duracion);
        boton.attr("fill", d3.color(colorActual));
        await sleep(duracion);
        await sonidoQueSeReproduce.pause();
        puedeJugar = true;
    };
    const reproducirSecuencia = async secuencia => {
        for (const boton of secuencia) {
            await encenderYApagarBoton(boton, milisegundosCpu);
        }
    };
    const botones = [superiorIzquierda, superiorDerecha, inferiorIzquierda, inferiorDerecha];
    const aleatorioDeArreglo = arreglo => arreglo[Math.floor(Math.random() * arreglo.length)];
    const agregarBotonAleatorioASecuencia = secuencia => secuencia.push(aleatorioDeArreglo(botones));
    const compararBotones = (boton, otroBoton) => {
        return boton.attr("fill") === otroBoton.attr("fill");
    };
    const compararSecuenciaDeUsuarioConOriginal = (secuenciaOriginal, botonDeUsuario, indice) => {
        return compararBotones(secuenciaOriginal[indice], botonDeUsuario);
    };
    const refrescarPuntaje = puntaje => textoPuntaje.text(puntaje.toString());
    const reiniciar = () => {
        secuencia = [];
        puedeJugar = false;
        contador = puntaje = 0;
        refrescarPuntaje(puntaje);
    }

    botones.forEach(boton => {
        boton.on("click", async () => {
            if (!puedeJugar) {
                console.log("No puedes jugar ._.");
                return;
            }
            puedeJugar = false;
            const ok = compararSecuenciaDeUsuarioConOriginal(secuencia, boton, contador);
            if (ok) {
                await encenderYApagarBoton(boton, milisegundosUsuario);
                if (contador >= secuencia.length - 1) {
                    puntaje++;
                    refrescarPuntaje(puntaje);
                    await sleep(500);
                    await turnoDelCpu();
                } else {
                    contador++;
                }
                puedeJugar = true;
            } else {

                $btnComenzar.disabled = false;
                Swal.fire("Perdiste", `Has perdido. Tu puntuación fue de ${puntaje}. Puedes jugar de nuevo cuando quieras`);
            }
        });
    });

    const turnoDelCpu = async () => {
        puedeJugar = false;
        agregarBotonAleatorioASecuencia(secuencia);
        await reproducirSecuencia(secuencia);
        contador = 0;
        puedeJugar = true;
    }

    const $btnComenzar = document.querySelector("#comenzar");
    $btnComenzar.addEventListener("click", () => {
        $btnComenzar.disabled = true;
        reiniciar();
        turnoDelCpu();
    });
}
Swal.fire("Bienvenido", `Comienza a jugar, mira la secuencia e imítala (cuando hagas clic, espera a que el botón se apague para hacer el siguiente clic).
<br>
<br>
    Ganas cuando se desborde la memoria del programa u ocurra un fallo, aunque probablemente pierdas antes de que eso ocurra.
    <br>
    <br>
    <a href="#"></a>`)
    .then(juego)
