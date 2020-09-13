// Importa el módulo http para la creación del servidor
var http = require("http");
const axios = require("axios").default;
var fs = require("fs");
var url = require("url");

function loadJSON(url) {
  const request = axios.get(url);

  return request
    .then((result) => {
      //console.log(result);
      return result;
    })
    .catch((error) => {
      console.error(error);
      return Promise.reject(error);
    });
}

//función que llama la promesa
function pedirProveedores(res) {
  var proveedores;
  var proveedoresJson;

  loadJSON(
    "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json",
  ).then(
    function (response) {
      res.write(
        '<h2 class="display-4 text-center">Listado de proveedores</h2>',
      );
      res.write('<table class="table table-striped" id="tablaProveedor">');
      res.write("<thead>");
      res.write("<tr>");
      res.write('<th scope="col">ID</th>');
      res.write('<th scope="col">Nombre</th>');
      res.write('<th scope="col">Contacto</th>');
      res.write("</tr>");
      res.write("</thead>");
      res.write("<tbody>");
      proveedoresJson = response;
      proveedores = proveedoresJson.data;
      //console.log(proveedores[1]);
      let i = 0;

      for (proveedor in proveedores) {
        let idProve = proveedores[proveedor].idproveedor;
        let nomCompa = proveedores[proveedor].nombrecompania;
        let nomContact = proveedores[proveedor].nombrecontacto;

        res.write("<tr>");
        res.write("<td>");
        res.write(idProve);
        res.write("</td>");
        res.write("<td>");
        res.write(nomCompa);
        res.write("</td>");
        res.write("<td>");
        res.write(nomContact);
        res.write("</td>");
        res.write("</tr>");
      }
      res.write("</tbody>");
      res.write("</table>");

      return res.end();
    },
    function (Error) {
      console.log(Error);
    },
  );
}

//función que llama la promesa
function pedirClientes(res) {
  var clientes;
  var clientesJson;

  loadJSON(
    "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json",
  ).then(
    function (response) {
      res.write('<h2 class="display-4 text-center">Listado de clientes</h2>');
      res.write('<table class="table table-striped" id="tablaProveedor">');
      res.write("<thead>");
      res.write("<tr>");
      res.write('<th scope="col">ID</th>');
      res.write('<th scope="col">Nombre</th>');
      res.write('<th scope="col">Contacto</th>');
      res.write("</tr>");
      res.write("</thead>");
      res.write("<tbody>");
      clientesJson = response;
      clientes = clientesJson.data;

      let i = 0;

      for (cliente in clientes) {
        let idClient = clientes[cliente].idCliente;
        let nomCompa = clientes[cliente].NombreCompania;
        let nomContact = clientes[cliente].NombreContacto;

        res.write("<tr>");
        res.write("<td>");
        res.write(idClient);
        res.write("</td>");
        res.write("<td>");
        res.write(nomCompa);
        res.write("</td>");
        res.write("<td>");
        res.write(nomContact);
        res.write("</td>");
        res.write("</tr>");
      }
      res.write("</tbody>");
      res.write("</table>");

      return res.end();
    },
    function (Error) {
      console.log(Error);
    },
  );
}

// Crea una nueva instancia del servidor
http
  .createServer(function (req, res) {
    // Obtener la dirección url
    var q = url.parse(req.url, true);
    var filename = q.pathname;

    // Contenido de la respuesta del servidor
    fs.readFile("index.html", function (err, data) {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/html" });
        return res.end("404 Not Found");
      }
      var final;
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      if (filename == "/api/proveedores") {
        final = pedirProveedores(res);
      } else if (filename == "/api/clientes") {
        final = pedirClientes(res);
      } else {
        res.writeHead(404, { "Content-Type": "text/html" });
        return res.end("404 Not Found");
      }

      return final;
    });
  })
  .listen(8081); // Puerto que usará el servidor para escuchar las solicitudes
