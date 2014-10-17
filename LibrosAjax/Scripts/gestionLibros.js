var url = "https://alumnos-mcsd2014.azure-mobile.net/tables/libros";
function borrarTabla() {
    $("#datos").find("tr:gt(0)").remove();
}

function addFila(datos) {

   
  
    var capa1 = "<tr><td><div class='datos'>" + datos.isbn + "</div>";
    capa1 += "<div class='formulario'><input type='text' value='" +
        datos.isbn + "' /></div> </td>";
   
    

    var capa2 = "<td><div class='datos'>" + datos.titulo + "</div>";
    capa2 += "<div class='formulario'><input type='text' value='" +
        datos.titulo + "' /></div> </td>";
   
   

    var capa3 = "<td><div class='datos'>" + datos.paginas + "</div>";
    capa3 += "<div class='formulario'><input type='text' value='" +
        datos.paginas + "' /></div></td>";
   

    var capa4 = "<td><div class='datos'>" + datos.unidades + "</div>";
    capa4 += "<div class='formulario'><input type='text' value='" +
        datos.unidades + "' /></div> </td>";
   

    var capa5 = "<td><a href='#' onclick='editar(this)' id='edit+"
        + datos.id + "' >Editar</a>" +
        "<a href='#' onclick='borrar(this)' id='borrar+"
        + datos.id + "'>Borrar</a>" +
        "</td></tr>";

   
   var fin=capa1+capa2+capa3+capa4 + capa5;
    $("#datos").append(fin);

}
function editar(obj) {
    var id = obj.getAttribute("id");
    var fila = obj.parentNode.parentNode;

    var elem = fila.cells;
    $("#txtIsbn").val(elem[0].childNodes[0].innerText);
    $("#txtTitulo").val(elem[1].childNodes[0].innerText);
    $("#txtPaginas").val(elem[2].childNodes[0].innerText);
    $("#txtUnidades").val(elem[3].childNodes[0].innerText);
    $("#hdnEditando").val(id);


}

function guardarDatos() {
    var obj = {
        isbn: $("#txtIsbn").val(),
        titulo: $("#txtTitulo").val(),
        paginas: $("#txtPaginas").val(),
        unidades: $("#txtUnidades").val()

    };
    var id = $("#hdnEditando").val();

    if (id == "-1") {
        var txt = JSON.stringify(obj);
        $.ajax(url, {
            method: "POST",
            data: txt,
            contentType: "application/json",
            dataType: "json",
            success:leerTodo
        });

    }
    else {
        obj.id = id.split("+")[1];
        var txt = JSON.stringify(obj);
        $.ajax(url+"/"+obj.id, {
            method: "PATCH",
            data: txt,
            contentType: "application/json",
            dataType: "json",
            success: leerTodo
        });


    }
    $("#hdnEditando").val("-1");
    $("#txtIsbn").val("");
    $("#txtTitulo").val("");
    $("#txtPaginas").val("");
    $("#txtUnidades").val("");
}

function borrar(obj) {
    var id = obj.getAttribute("id").split("+")[1];

    var r = confirm("Estas seguro?");

    if (r) {

        $.ajax(url + "/" + id, {
            method: "DELETE",
            contentType: "application/json",
            dataType: "json",
            success: leerTodo
        });


    }

}

function buscar() {
    var contenido = $("#txtBuscar").val();
    var tipo = $("#ddlBuscar").val();
    var urlFinal = url;

    if (tipo == 2) {
        urlFinal += "?$filter=substringof('"+contenido+"',isbn)";

    }
    if (tipo == 1) {
        urlFinal += "?$filter=substringof('" + contenido + "',titulo)";

    }
    if (tipo == 3) {
        urlFinal += "?$filter=paginas ge "+contenido;

    }
    if (tipo == 4) {
        urlFinal += "?$filter=unidades ge " + contenido;

    }

    $.getJSON(urlFinal, crearTabla);
}


/*function editar(obj) {
    var fila = obj.parentNode.parentNode;

    var elem = fila.cells;


    for (var i = 0; i < 4; i++) {

        elem[i].childNodes[0].style.display = "none";
        elem[i].childNodes[1].style.display = "block";
    }


}*/

function crearTabla(datos) {
    borrarTabla();
    $.each(datos, function(i,obj) {

        addFila(obj);


    });


}

function leerTodo() {
    
    $.getJSON(url, crearTabla);

}

function pintarCanvas(datos) {
    var canvas = document.querySelector("#ventas");
    var ctx = canvas.getContext("2d");
    var estilos = ['italic 40pt Arial', 'italic 30pt Arial', 'italic 20pt Arial'];
    var posY = 60;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < datos.length; i++) {
        ctx.font = estilos[i];
        
        ctx.fillText(datos[i].titulo, 10, posY);
        posY += 50;
    }
}

function MasVendidos() {

    var urlFinal = url + "?$top=3&$orderby=unidades desc";

    $.getJSON(urlFinal, pintarCanvas);

}

$(document).ready(function() {

    leerTodo();
        $("#btnGuardar").click(guardarDatos);
        $("#btnBuscar").click(buscar);
        $("#btnVentas").click(MasVendidos);
    }
);