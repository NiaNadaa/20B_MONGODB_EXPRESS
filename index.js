const express = require("express");
const app = express();
const mongodb = require("mongodb");

app.listen(process.env.PORT || 3000);
console.log('Servidor corriendo en puerto: 3000');

const MongoClient = mongodb.MongoClient;

MongoClient.connect("mongodb://localhost:27017", function (err, client) {
  if(err){
    console.log("Conexion a base de datos fallida")
  }else{
    app.locals.db = client.db("test")
    console.log("Conectado a la base de datos con exito");
  }
});

//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//Routes
app.get('/api/series', function(req, res){
  app.locals.db.collection('TV').find().toArray(
    function(err, data){
      if(err) {
        res.send({error: err);
      }
    else {
      res.send(data);
    }
  });
});

app.get('/api/serie', function(req, res){
  app.locals.db.collection('TV').find({"Titulo": req.query.titulo}).toArray(
    function(err, data){
      if(err) {
        res.send({error: err);
      }
      else {
        let entretenimiento=
        `<table>
          <tr>
              <th>TÍTULO de la serie</th>
              <th>PLATAFORMA(Netlix, HBO...)</th>
              <th>Nota</th>
          </tr>
          <tr>
              <th>${data[0].Titulo}</th>
              <th>${data[0].Plataforma}</th>
              <th>${data[0].Nota}</th>
          </tr>`

        entretenimiento+=`</table>`
        res.send(entretenimiento);
    }
  });
});


app.post('/api/nuevaSerie', function(req, res) {
  let titulo = req.body.titulo;
  let plataforma= req.body.plataforma;
  let nota= req.body.nota;

  let serie={
    "Titulo":titulo,
    "Plataforma":plataforma,
    "Nota":nota
  }
  app.locals.db.collection('TV').insertOne( serie,
  function(err,respuesta){
      if(err) {
        res.send({error: err);
      }
      else {
        res.send(`<h1>${titulo} añadido</h1>`);
      }
  });
});
