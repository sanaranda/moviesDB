var express = require('express');
var router = express.Router();

const moviesController = require('../controllers/moviesControllers')

// Muestro Listado de todas las peliculas
router.get('/',moviesController.showAll); 

// Detalle de una pelicula en particular 
router.get('/detail/:id',moviesController.showOne);

// Recomendadas, tienen rating mayor a 8
router.get('/recommended',moviesController.recommended); 

// Ordenadas por las mas recientes
router.get('/new',moviesController.new); // muestra las 5 pelis mas nuevas
router.get('/newRaw',moviesController.newRaw); // muestra las 5 pelis mas nuevas usando raw queries

// Buscador de strings en el titulo
router.get('/search',moviesController.found); // busca string por Get
router.post('/search',moviesController.foundPost); // busca string por Post

// Crea Peliculas nuevas
router.get('/create',moviesController.createForm); // crea y agrega una peli a la BD, llamar al formulario
router.post('/create',moviesController.create);  //ataja los datos ingresados en el formulario

// Edito una pelicula determinada
router.get('/update/:id',moviesController.updateForm); // edita una peli a la BD, llamar al formulario
router.put('/update/:id',moviesController.update);  //ataja los datos ingresados en el formulario de edicion

// Borro una pelicula
router.delete('/delete/:id',moviesController.delete);  //borra peli <!--esto debe ir por DELETE, instalar method override -->

module.exports = router;