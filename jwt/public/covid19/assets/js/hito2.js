$(() => {

    let token = localStorage.getItem('jwt_token');

    if (!token) {
        alert("Usted no tiene acceso a esta página.")
        location.href = './';

    } else {


        //INICIO FUNCIÓN ENCARGADA DE MOSTRAR GRÁFICO DE CHILE
        const cargarGraficoChile = (fallecidos, confirmados, recuperados) => {
            console.log(fallecidos, confirmados, recuperados)

            var chart = new CanvasJS.Chart("graficoChile", {
                animationEnabled: true,
                exportEnabled: true,
                title: {
                    text: "Casos de covid en Chile"
                },
                toolTip: {
                    shared: true
                },
                legend: {
                    cursor: "pointer",
                    itemclick: toggleDataSeries
                },
                data: [{
                    type: "spline",
                    name: "Confirmados",
                    showInLegend: true,
                    dataPoints: confirmados
                },
                {
                    type: "spline",
                    name: "Fallecidos",
                    showInLegend: true,
                    dataPoints: fallecidos
                },
                {
                    type: "spline",
                    name: "Recuperados",
                    showInLegend: true,
                    dataPoints: recuperados
                },]
            });

            chart.render();