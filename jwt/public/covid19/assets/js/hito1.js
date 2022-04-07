$(() => {

    //FUNCIÓN ENCARGADA DE CARGAR GRÁFICO CASOS A NIVEL DE COVID
    const cargarGraficoTotal = (casosCovid) => {

        //FILTRAMOS PAISES CON MÁS DE 100.000 CASOS FALLECIDOS
        const casosFiltrados = casosCovid.filter((item) => item.deaths >= 100000)

        //CREAMOS 2 ARRAYS PARA USAR EN LOS DATAPOINTS DE LOS GRÁFICOS
        let confirmados = [];
        let fallecidos = [];

        //RECORREMOS LA TOTALIDAD DE PAISES CON MÁS DE 100000 CASOS Y LOS PASAMOS A LOS ARRAYS ANTES CREADOS
        casosFiltrados.forEach(element => {
            confirmados.push({ label: element.location, y: element.confirmed })
            fallecidos.push({ label: element.location, y: element.deaths })
        });

        var chart = new CanvasJS.Chart("graficoCovidMundial", {
            exportEnabled: true,
            animationEnabled: true,
            title: {
                text: "Paises con covid 19"
            },
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
                itemclick: toggleDataSeries
            },
            data: [{
                type: "column",
                name: "Casos confirmados",
                showInLegend: true,
                yValueFormatString: "#,##0.# Units",
                //USAMOS ARRAY DE CASOS CONFIRMADOS
                dataPoints: confirmados
            },
            {
                type: "column",
                name: "Casos Fallecidos",
                showInLegend: true,
                yValueFormatString: "#,##0.# Units",
                //USAMOS ARRAY DE CASOS FALLECIDOS
                dataPoints: fallecidos
            }]
        });
        chart.render();

        function toggleDataSeries(e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            } else {
                e.dataSeries.visible = true;
            }
            e.chart.render();
        }

    }


    //FUNCIÓN QUE PERMITE CARGAR LAS FILAS A LA TABLA
    const cargarTabla = (datos) => {
        let cuerpoTabla = document.getElementById('cuerpo-tabla');
        cuerpoTabla.innerHTML = ''


        let dataTabla = '';
        // RECORREMOS Y ACUMULAMOS FILAS EN UNA VARIABLE PARA POSTERIORMENTE INYECTARLAS EN EL TBODY
        datos.forEach((pais, index) => {
            dataTabla += `
                    <tr>
                        <th scope="row">${index + 1}</th>
                        <td>${pais.location}</td>
                        <td>${pais.confirmed}</td>
                        <td>${pais.deaths}</td>
                        <td><button type='button' class='btn btn-primary' onClick='verDetalle("${pais.location}")'>Ver detalle</button></td>
                    </tr>
            `
        })

        cuerpoTabla.innerHTML = dataTabla;

    }

    //FUNCIÓN QUE NOS PERMITE CONSUMIR EL ENDPOINT CON LA TOTALIDAD DE PAISES
    const covidMundial = () => {
        const urlBase = 'http://localhost:3000/api/total';

        fetch(urlBase)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                //LLAMAMOS A MÉTODOS PARA CARGAR DATOS EN GRÁFICO Y TABLA
                cargarGraficoTotal(data.data);
                cargarTabla(data.data);
            })
    }


    covidMundial();


})

//FUNCIÓN FUERA DE LA FUNCIÓN READY, PARA TENERLA DISPONIBLE PARA EL CÓDIGO CREADO DINAMICAMENTE.
const verDetalle = (dataPais) => {

    //INSTANCIA DE BOOTSTRAP PARA MANIPULAR EL MODAL
    let myModal = new bootstrap.Modal(document.getElementById('modalDetalle'))

    //PETICION A API POR PAÍS USANDO EL PARAMETRO QUE NOS ENVÍAN (NOMBRE PAÍS)
    const urlBase = 'http://localhost:3000/api/countries/' + dataPais;
    fetch(urlBase)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            let pais = data.data;
            //CREAMOS ARRAY PARA DESPLEGAR LOS DATOS EN EL EL DATAPOINTS DEL GRÁFICO
            let confirmados = [{ label: pais.location, y: pais.confirmed }];
            let fallecidos = [{ label: pais.location, y: pais.deaths }];

            var chart = new CanvasJS.Chart("graficoDetalle", {
                exportEnabled: true,
                animationEnabled: true,
                title: {
                    text: `Situación Covid-19 en ${pais.location}`
                },
                axisY: {
                    title: "Casos confirmados",
                    titleFontColor: "#4F81BC",
                    lineColor: "#4F81BC",
                    labelFontColor: "#4F81BC",
                    tickColor: "#4F81BC",
                    includeZero: true
                },
                axisY2: {
                    title: "Casos fallecidos",
                    titleFontColor: "#C0504E",
                    lineColor: "#C0504E",
                    labelFontColor: "#C0504E",
                    tickColor: "#C0504E",
                    includeZero: true
                },
                toolTip: {
                    shared: true
                },
                legend: {
                    cursor: "pointer",
                    itemclick: toggleDataSeries
                },
                data: [{
                    type: "column",
                    name: "Confirmados",
                    showInLegend: true,
                    yValueFormatString: "#,##0.# Units",
                    dataPoints: confirmados
                },
                {
                    type: "column",
                    name: "Fallecidos",
                    axisYType: "secondary",
                    showInLegend: true,
                    yValueFormatString: "#,##0.# Units",
                    dataPoints: fallecidos
                }]
            });
            chart.render();

            function toggleDataSeries(e) {
                if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }
                e.chart.render();
            }

        })

    //MOSTRAR MODAL
    myModal.toggle()


}