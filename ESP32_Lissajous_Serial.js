let port;
let reader;
let isPortOpen = false;
var printData = 0;

let readingInterval; // Variable para almacenar el identificador del temporizador
var n_read = 0;
var sampling_rate; 
var time_update; 
var data_out = document.getElementById("display_data");
var points_max = parseInt(document.getElementById("points_max").value)+1;
const connectButton = document.getElementById ('SerialConnectBt');
var serial_speed = parseInt(document.getElementById("SerialSpeed").value);
data_out.style.display = "none";

var toggle_X = document.getElementById('toggleX');
toggle_X.addEventListener('click', plotX_out);
var toggle_Y = document.getElementById('toggleY');
toggle_Y.addEventListener('click', plotY_out);
var toggle_YvsX = document.getElementById('toggleXY');
toggle_YvsX.addEventListener('click', plotXY_out);


connectButton.addEventListener('click', connectToSerial );
/*
applyOrientation();

window.onresize = function(event) {
        applyOrientation();
    }

function applyOrientation() {
    
var my_element = document.getElementById("plot_data");

    my_element.scrollIntoView({
  behavior: "smooth",
  block: "start",
  inline: "nearest"
});

}
 
    
*/



var result1000 = [];
var result = [];
var data1000 = "" ; 
var data_tot = [];
var data_tot2 = [];

var columnX;
var columnY;

var n_read = 0;

var chunk = "";

async function connectToSerial() {
    try {
        // Si el puerto ya está abierto, lo cerramos
        if (isPortOpen) {
            await closeSerialPort();
            return;
        }

        if (!port) {
            // Solicitar permiso para acceder al puerto serie
            port = await navigator.serial.requestPort();
        }
        serial_speed = parseInt(document.getElementById("SerialSpeed").value);
        //console.log("serial_speed =" + serial_speed);
        await port.open({ baudRate: [serial_speed],bufferSize: 1024  }); // Puedes cambiar la velocidad de baudios según necesites

        reader = port.readable.getReader();


        connectButton.value = 'Disconnect';
       

        isPortOpen = true;
        printData = 0;
        data_out.style.display = "none";


        sampling_rate = parseFloat(document.getElementById("sampling_rate").value);
        time_update = 1000.0/sampling_rate/4.0; // ms


        readingInterval = setInterval(readSerialData, time_update); 
    } catch (error) {
        console.error('Error:', error);
    }
}

async function closeSerialPort() {
    try {
        clearInterval(readingInterval);

        if (reader) {
            await reader.cancel();
            await reader.releaseLock();
        }

        if (port) {
            await port.close();
        }

    
        connectButton.value = 'Connect';

        isPortOpen = false;
        printData = 1;
        print_data();

    } catch (error) {
        console.error('Error:', error);
    }
}

async function readSerialData() {
     
    try {
        const { value, done } = await reader.read();
        if (!done) {
            n_read = n_read + 1;
            chunk = new TextDecoder().decode(value); 
            data1000 = data1000 + chunk;
            result1000 = data1000.split(/\r?\n/);

            columnX = parseInt(document.getElementById("ColumnX").value);
            columnY = parseInt(document.getElementById("ColumnY").value);
           
            points_max = parseInt(document.getElementById("points_max").value)+1;
            
            data_tot = [];
            data_tot2 = [];
            if (result1000.length > points_max) {
                result = result1000.slice(result1000.length-points_max,result1000.length-1);
              
                for (let i = 0;i<result.length;i++){
                    data_tot.push(String(result[i]).split(' ')[columnX]);
                    data_tot2.push(String(result[i]).split(' ')[columnY]);
            }

            } else {
                result = result1000;
                for (let i = 0;i<result.length-1;i++){
                    data_tot.push(String(result[i]).split(' ')[columnX]);
                    data_tot2.push(String(result[i]).split(' ')[columnY]);2
            }
            }


            updatePlot();
        }
    } catch (error) {
        printData = 1;
        updatePlot();
        console.error('Error:', error);
    }
}


function updatePlot(){
    var X_axis = [];
    //var XX = [];
    //var YY = [];
    for (var i = 0; i < data_tot.length; i++) {
      X_axis.push(i);
    }
    /*
    for (var i = 0; i < data_tot.length-1; i++) {
      XX.push(data_tot[i]);
      YY.push(data_tot2[i]);
    }
    */

    var traceX = {
x: X_axis,
y: data_tot,
  mode: 'markers+lines',
  name: 'Red CD',
    line: {
    color: 'red',
    width: 2,
    dash: 'line'
  }
};

    var traceY = {
x: X_axis,
y: data_tot2,
  mode: 'markers+lines',
  name: 'Red CD',
    line: {
    color: 'green',
    width: 2,
    dash: 'line'
  }
};

var lastX = [data_tot[data_tot.length-1]];
var lastY = [data_tot2[data_tot2.length-1]];

var traceXY = {
x: data_tot,
y: data_tot2,
  mode: 'markers+lines',
  name: 'Total',
    line: {
    color: 'blue',
    width: 2,
    dash: 'line'
  }
};
var traceXYLast = {
x: lastX,
y: lastY,
    marker: {
    color: 'red',
    size: 15
  },
  mode: 'markers',
  name: 'Last',
    line: {
    color: 'white',
    width: 2,
    dash: 'line'
  }
};
  


    var dataX =[traceX]
    var layoutX = {
              xaxis: {
                  //   range: [0, N],
                  title: "Sample Number"
              },
              yaxis: {
                  //    range: [-1, 1],
                  title: "Column " + String(columnX)
              },
              title: "Data for Column "+ String(columnX) ,font: {
    family: 'Arial, sans-serif;',
    size: 18,
    color: '#000'
  },
          };
var dataY =[traceY]
var layoutY = {
              xaxis: {
                  //   range: [0, N],
                  title: "Sample Number"
              },
              yaxis: {
                  //    range: [-1, 1],
                  title: "Column " + String(columnY)
              },
              title: "Data for Column " + String(columnY) ,font: {
    family: 'Arial, sans-serif;',
    size: 18,
    color: '#000'
  },
          };

    var dataXY =[traceXY,traceXYLast]
    var layoutXY = {
              xaxis: {
                range: [-1.1, 1.1],
                title: "Column  " + String(columnX)
              },
              yaxis: {
                  range: [-1.1, 1.1],
                  title: "Column " + String(columnY)
              },
              title: "Column " + String(columnY) +" vs Column " + String(columnX),font: {
    family: 'Arial, sans-serif;',
    size: 18,
    color: '#000'
  },
          };


          Plotly.purge("plot_dataX");
    Plotly.newPlot("plot_dataX", dataX, layoutX);
          Plotly.purge("plot_dataY");
    Plotly.newPlot("plot_dataY", dataY, layoutY);

    Plotly.newPlot("plot_dataXY", dataXY, layoutXY);
if (printData == 1){
    print_data();
}
}

function print_data(){



data_out.style.display = "block";

              data_out.textContent = "Row    Columns    \n";
              for (let i = 0;i<result.length ;i++){
                
                data_out.textContent += i + " " + String(result[i]) + "\n"
              }

             printData = 0;
            

}


async function send_sr() {
      try {
        const newVal = String(document.getElementById("sampling_rate").value);
        const writer = port.writable.getWriter();
        await writer.write(new TextEncoder().encode('setSR:' +newVal));
        await writer.releaseLock();
        console.log('Datos enviados con éxito');
        console.log(newVal);   
      } catch (error) {
        console.error('Error al enviar datos por el puerto serie:', error);
      }
}

async function send_f1() {
      try {
        const newVal = String(document.getElementById("f1").value);
        const writer = port.writable.getWriter();
        await writer.write(new TextEncoder().encode('setF1:' +newVal));
        await writer.releaseLock();
        console.log('Datos enviados con éxito');
        console.log(newVal);   
      } catch (error) {
        console.error('Error al enviar datos por el puerto serie:', error);
      }
}
async function send_f2() {
      try {
        const newVal = String(document.getElementById("f2").value);
        const writer = port.writable.getWriter();
        await writer.write(new TextEncoder().encode('setF2:' +newVal));
        await writer.releaseLock();
        console.log('Datos enviados con éxito');
        console.log(newVal);   
      } catch (error) {
        console.error('Error al enviar datos por el puerto serie:', error);
      }
}
async function send_p1() {
      try {
        const newVal = String(document.getElementById("p1").value);
        const writer = port.writable.getWriter();
        await writer.write(new TextEncoder().encode('setP1:' +newVal));
        await writer.releaseLock();
        console.log('Datos enviados con éxito');
        console.log(newVal);   
      } catch (error) {
        console.error('Error al enviar datos por el puerto serie:', error);
      }
}
async function send_p2() {
      try {
        const newVal = String(document.getElementById("p2").value);
        const writer = port.writable.getWriter();
        await writer.write(new TextEncoder().encode('setP2:' +newVal));
        await writer.releaseLock();
        console.log('Datos enviados con éxito');
        console.log(newVal);   
      } catch (error) {
        console.error('Error al enviar datos por el puerto serie:', error);
      }
}
function plotX_out(){
var plotOut = document.getElementById("plot_dataX");
if (plotOut.style.display === "none") {
    plotOut.style.display = "block";
  } else {
    plotOut.style.display = "none";
  }
}
function plotY_out(){
var plotOut = document.getElementById("plot_dataY");
if (plotOut.style.display === "none") {
    plotOut.style.display = "block";
  } else {
    plotOut.style.display = "none";
  }
}
function plotXY_out(){
var plotOut = document.getElementById("plot_dataXY");
if (plotOut.style.display === "none") {
    plotOut.style.display = "block";
  } else {
    plotOut.style.display = "none";
  }
}