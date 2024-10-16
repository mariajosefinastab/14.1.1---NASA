document.getElementById('btnBuscar').addEventListener('click', function() { //Selecciono el botón de búsqueda y le agrego el addEventListener para saber si se tocó, si se tocó se ejecuta
                                                                            //la función dentro del segundo argumento
    const query = document.getElementById('inputBuscar').value.trim(); //Obtener valor de búsqueda, selecciono el campo de entrada de búsqueda(input) y me guardo el valor, con trim() borro espacios en blanco al principio y al final del texto
    if (!query) { //Si la query(entrada del usuario), está vacía muestro una alerta
        alert('Por favor ingresa un término de búsqueda.');
        return;
    }

    const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}`; //url para la API, encodeURIComponent() me asegura que cualquier caracter especial en la búsqueda sea codificado correctamente en la URL



    fetch(url)
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok' + response.status);
        }
        return response.json(); // o response.text() si es texto
    })
    .then(data => {
        displayResults(data.collection.items); // datos recibidos, llamo a la función displayResults  pasándole los elementos que se encuentran en data.collection.items
    })
    .catch(error => {
        console.error('Hubo un problema con la solicitud:', error);
        const contenedor = document.getElementById('contenedor');
        contenedor.innerHTML = '<p> Error al realizar la búsqueda, intenta nuevamente</p>';
    });

});

function displayResults(items) { //Parámetro items recibe un array de objetos, cada objeto representa un resultado de la búsqueda
    const contenedor = document.getElementById('contenedor'); //Selecciona el elemento en donde voy a mostrar los resultaodos
    contenedor.innerHTML = ''; // Limpia resultados anteriores

    //verificación de resultados
    if (items.length === 0) { //Si la longitud de items es 0 no muestra nada y sale de la función con el return
        contenedor.innerHTML = '<p>No se encontraron resultados.</p>';
        return;
    }

    //iteración sobre los resultados
    items.forEach(item => {  //con forEach recorro cada objeto item que está dentro del array items
        const { links, data } = item; //Desestructuro: extraigo las propiedades links y data del objeto item.links(contiene los enlaces a las imágenes) y data(contiene la información descriptiva)


        if (links && data.length > 0) { //verifico si hay un enlace y datos
            const imgLink = links[0].href; //obtengo primer enlace
            const title = data[0].title || 'Sin título';
            const description = data[0].description || 'Sin descripción';
            const date = data[0].date_created || 'Sin fecha';

            //creo resultados con el estilo de bootstrap
            const resultItem = document.createElement('div');
            resultItem.classList.add('mb-4'); // Espaciado entre elementos (mb-4 agrega margen inferior) (img-fluid hace la img responsive)
            resultItem.innerHTML = ` 
                <h2>${title}</h2>
                <img src="${imgLink}" alt="${title}" class="img-fluid" style="max-width: 100%;"> 
                <p>${description}</p>
                <p><strong>Fecha:</strong> ${date}</p>
                <hr>
            `;
            contenedor.appendChild(resultItem);
        }
    });
}