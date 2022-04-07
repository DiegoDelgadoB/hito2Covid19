$(() => {

    let token = localStorage.getItem('jwt_token');

    if(!token){
        alert("Usted no tiene acceso a esta página.")
        location.href = './';

    }else {


        //INICIO FUNCIÓN ENCARGADA DE MOSTRAR GRÁFICO DE CHILE
        const cargarGraficoChile = (fallecidos, confirmados, recuperados) => {
            console.log(fallecidos, confirmados, recuperados)

            var chart = new CanvasJS.Chart("graficoChile", {
                animationEnabled: true,
                exportEnabled: true,
                title:{
                    text: "Casos de covid en Chile"             
                }, 
                toolTip: {
                    shared: true
                },
                legend:{
                    cursor:"pointer",
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
            
            function toggleDataSeries(e) {
                if(typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                }
                else {
                    e.dataSeries.visible = true;            
                }
                chart.render();
            }

        }
        // FIN FUNCIÓN ENCARGADA DE MOSTRAR GRÁFICO DE CHILE


        const getData = async (consulta) => {
            let url = 'http://localhost:3000/api/' + consulta;

            //en segundo parametro pasar objeto indicando método GET y headers.
            const response = await fetch(url, {
                method :'GET',
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();

            if(consulta == 'deaths'){
                localStorage.setItem('deaths',JSON.stringify(data))
            }
            

            //variable que guardará los registros para cargar en el gráfico.
            let datos = []

            //"date": "1/22/20",
            //"total": 0
            
            data.data.forEach(element => {
                if(element.total >0){
                    datos.push({ label: element.date, y: element.total})
                }
            });

            return datos

        }

        //EJEMPLO PARA TRABAJAR CON PETICIONES ASÍNCRONAS
        /* let fallecidos = getData("deaths");
        let confirmados = getData("confirmed");
        
        
        fallecidos.then(respuesta => {
            console.log(respuesta)
        })

        confirmados.then(respuesta => {
            console.log(respuesta)
        })
 */

        //EJEMPLO PARA TRABAJAR CON PETICIONES ASÍNCRONAS ESPERANDO RESPUESTA DE LA PRIMERA
        /* fallecidos.then(respuesta1 => {
            console.log(respuesta1)
            let confirmados = getData("confirmed");
            confirmados.then(respuesta2 => {
                console.log(respuesta2)
            })      

        }) */

        Promise.all([getData("deaths"), getData("confirmed"), getData("recovered")]).then((respuesta) => {

            cargarGraficoChile(respuesta[0], respuesta[1], respuesta[2])

        }).catch(error => {
            alert("Ha ocurrido un error al realizar las consultas a la API de casos en Chile.")
        })


    }








})