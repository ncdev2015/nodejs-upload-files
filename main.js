const http = require('http');
const formidable = require('formidable');
const fsExtra = require('fs-extra');

const server = http.createServer((req, res) => {
  if (req.url === '/upload' && req.method.toLowerCase() === 'post') {
    // Crear un nuevo formulario formidable
    const form = new formidable.IncomingForm();

    // Directorio donde se guardarán los archivos cargados
    const uploadDir = './uploads';

    // Verificar si el directorio de carga existe; si no, créalo
    if (!fsExtra.existsSync(uploadDir)) {
      fsExtra.mkdirSync(uploadDir);
    }

    // Configurar la ubicación donde se guardarán los archivos cargados
    form.uploadDir = uploadDir;

    // Analizar el formulario enviado
    form.parse(req, (err, fields, files) => {
      if (err) {
        // Manejar errores, si los hay
        console.error('Error al analizar el formulario: ', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error interno del servidor.');
        return;
      }

      // Los campos del formulario (datos)
      console.log('Campos del formulario: ', fields);

      // Los archivos cargados en el formulario
      console.log('Archivos cargados: ', files);

      // Mover el archivo cargado al directorio de destino
      const oldPath = files.file.path;
      const newPath = form.uploadDir + '/' + files.file.name;
      fsExtra.moveSync(oldPath, newPath);

      // Finalizar la respuesta
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<h2>Formulario recibido exitosamente.</h2>');
    });
  } else {
    // Enviar el formulario al cliente para su carga
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <h2>Subir archivo</h2>
      <form action="/upload" method="post" enctype="multipart/form-data">
        <input type="text" name="username" placeholder="Usuario"><br>
        <input type="file" name="file"><br>
        <input type="submit" value="Enviar">
      </form>
    `);
  }
});

const port = 8080;
server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
