const db = require('../database/models');
const {Movie, Genre, Actor} = require('../database/models'); // llamo asi para tener los nombres de los modelos. index se encarga. ASi no pongo db.Movie o db.Genre esta es otra forma sin usar db. Pero para los comandos tengo que escribir await Movie.comando sin db. si poner sequelize dentro de las llaves tambien anda...const {Movie, sequelize},
//en el playground ponen const db = require('../database/models'), y luego se usa db.Movie.findAll() o la funcion que sea ya que en esa var esta la BD mia
const {Op} = require('sequelize'); // para poder usar operadores logicos como OR
const path = require('path'); // lo puse Santi P, ver para que


module.exports = {
       showAll: async (req, res) => { //pongo async si tengo adentro cosas que tarden
        try {
            const movies = await Movie.findAll({
                include:['generos','actores'] }); //include all true dice que traiga todas las relaciones con otra tablas, // si no necesito todas las relaciones lo pongo asi findAll({include:['Genre']})            
            //res.json(movies) //manda al browser y se ve bastante ordenado
            movies.forEach(element => {   
              element.release_date = element.release_date.toLocaleDateString();                                                // le convierto el formato a cada uno de los elementos encontrados                
            });  
            
            res.render('moviesList', {movies});                                             
                    
            } catch (error){
            res.send(error.message);
            }
        },
        showOne: async (req, res) => { //pongo async si tengo adentro cosas que tarden
            try {
                const oneMovie = await Movie.findByPk(req.params.id, {include:['generos','actores']}); 
                //res.json(oneMovie)
                //oneMovie.release_date = oneMovie.release_date.toISOString().split('T')[0]; 
                oneMovie.release_date = oneMovie.release_date.toLocaleDateString();                                                // le convierto el formato a cada uno de los elementos encontrados                  
                res.render('oneMovie', {oneMovie}); // Lucas puso await adelante de res.render, no se si hace falta
                                
            } catch (error){
            res.send(error.message);
            }
        },
        recommended: async (req, res) => { // pelis con rating mayor a 8
            try {
                const recMovies = await Movie.findAll({
                    include:['generos','actores'],
                    where: {
                        rating: {[Op.gt] : 8} // antes tenia db.Sequelize.Op.gt pero como puse const {Op} = require('sequelize') arriba entonces anda asi
                    },
                    order: [
                        ["rating", "DESC"]
                    ],
                    limit: 21
                }
                ); 
                recMovies.forEach(element => {   
                    element.release_date = element.release_date.toLocaleDateString();                                                // le convierto el formato a cada uno de los elementos encontrados                
                });  
                            
                res.render('recMovies', {recMovies}); 
                                
            } catch (error){
                res.send(error.message);
            }
        },
        found: async (req, res) => {
            try {                              
                let foundMovies = await Movie.findAll({
                    where: {
                        title: {[Op.like] : "%" + req.query.keywords + "%"} // 
                    },
                    order: [
                        ["rating", "DESC"]
                    ],
                    limit: 21
                }
                ); 
                foundMovies.forEach(element => {   
                    element.release_date = element.release_date.toLocaleDateString();                                                // le convierto el formato a cada uno de los elementos encontrados                
                  });         
                res.render('foundMovies', {foundMovies}); 
                                    
                } catch (error){
                    res.send(error.message);
                }
            },
        foundPost: async (req, res) => {
                try {                                                
                    let foundMoviesPost = await Movie.findAll({
                        
                        where: {
                            title: {[Op.like] : "%" + req.body.keywordsPost + "%"} //  
                        },
                        order: [
                            [req.body.orden , req.body.asc_desc]
                            
                        ],
                        //limit: 21
                    }
                    ); 
                    foundMoviesPost.forEach(element => {   
                        element.release_date = element.release_date.toLocaleDateString();                                                // le convierto el formato a cada uno de los elementos encontrados                
                      });          
                    res.render('foundMoviesPost', {foundMoviesPost}); 
                                        
                    } catch (error){
                        res.send(error.message);
                    }
                },                    
        new: async (req, res) => { // pelis mas nuevas
            try {
                let newMovies = await Movie.findAll( {
                    include:['generos','actores'],
                    order: [
                     ["release_date", "DESC"]
                    ],
                    limit: 5
                }); 
                newMovies.forEach(element => {   
                    element.release_date = element.release_date.toLocaleDateString();                                                // le convierto el formato a cada uno de los elementos encontrados                
                });     
                res.render('newMovies', {newMovies}); 
                                    
            } catch (error){
                res.send(error.message);
            }
        }
        ,        

        newRaw: async (req, res) => { 
            try {
                const rat = '0';
                let newMoviesR = await db.sequelize.query(
                    "select * from movies where rating > " + rat + " and awards > 0 order by release_date desc limit 5"
                    );
                    newMoviesR.forEach(element => {   
                     element.release_date = element.release_date.toLocaleDateString();                                                // le convierto el formato a cada uno de los elementos encontrados                
                    });  
                res.render('newMoviesR', {newMoviesR: newMoviesR[0]});
                                                
            } catch (error){
                res.send(error.message);
            }
        },
        createForm: async (req, res) => { // vista de creacion de peli nueva a mano
            try {
                const generos = await  Genre.findAll(); //traigo generos de la bd para mostrarlos en la vista
                const actores = await Actor.findAll(); // traigo actores de la bd para mostrarlos en la vista
                res.render('create_movie', {generos, actores}); // mando generos y actores para que los pueda elegir cuando creo peli

            } catch (error){
                res.send(error.message);
            }
        },

        create: async (req, res) => { // recibo datos del form de creacion de peli
            try {
                //console.log(req.body)  //  para ver que llega
                const newMovie = await Movie.create(req.body) // para usar esto en el form deben estar los mismos nombres que en la BD
                await newMovie.addActores(req.body.actores)  // en el modelo movie pusimos abajo de todo el alias actores a esta relacion, pero se usa mayuscula luego del add. OJO en req.body.actores este actores es lo que viene del form definido en el controlador create de arriba
                res.redirect('/movies')    

            } catch (error){
                 res.send(error.message);
            }
        },
        updateForm: async (req, res) => { //
            try {   
                          
             const movieId = req.params.id; //capturo el numero de la peli a editar
             const toEdit = await Movie.findByPk(movieId, {include:['generos', 'actores']}); // include es para que me traiga esas asociaciones con generos y actores que defini en la vista de movies.js Si le hubiera puesto as: generos en el modelo en vez de Genre hubiero include generos,actores
             const generos = await  Genre.findAll(); //traigo generos de la bd
             const actores = await Actor.findAll(); //traigo actores de la bd
             toEdit.release_date = toEdit.release_date.toLocaleDateString()                 // las opciones de abajo no andan
                 //'es-AR'//,
                //  {
                //      year: 'numeric',
                //      month: 'numeric',                    
                //      day: 'numeric'
                //  }
                // );
             //console.log(toEdit.release_date) // puedo ver los datos de la peli que busque
             //console.log(dateToEditF)
             res.render('update_movie',{toEdit, generos, actores}) // paso generos para mostrarlos en el form
              
            } catch (error){
                res.send(error.message);
            }
        },
        
        update: async (req, res) => { //
            try {
                //console.log(req.body)  
                //res.send(req.body)       // para ver que llega desde el form y si esta todo ok
                const movieId = req.params.id; // obtendo el id que viene por formulario
                const changedMovie = await Movie.findByPk(movieId, {include:['generos', 'actores']}); //traigo la pelicula a editar con su genero y actores originales
                await changedMovie.removeActores(changedMovie.actores) // le saco los actores que ya tenia en el bd
                await changedMovie.addActores(req.body.actores) // le agrego los actores que vinieron por el form
                
                await changedMovie.update(req.body) // cambio en la BD con la info que viene del form por body, solo modifica la tabla movies, para actores y genero...
                
                res.redirect('/movies') 
                

            } catch (error){
                res.send(error.message); 

            }
        },
        delete: async (req, res) => { // recibo datos del form de creacion de peli
            try {                                                              
                const delMovie = await Movie.findByPk(req.params.id, {include:['generos', 'actores']}); //traigo la pelicula a editar con su genero y actores originales
                await delMovie.removeActores(delMovie.actores) // si no borro actores me da error 
                //await delMovie.removeGeneros(delMovie.generos)      // da error: delMovie.removeGeneros is not a function           
                await Movie.destroy({
                    where: {
                    id: req.params.id
                    }
                    });
                res.redirect('/movies')                
            } catch (error){
                 res.send(error.message);
            }
        }

};

// const moviesJson = await Movie.findOne({
//     attributes:['title', 'length'], //le digo que columnas traer
//     where: {title: 'Avatar'} // elijo un filtro
// }) // busco la info y queda en formato json
// // const moviesJs = await moviesJson.json() // convierto json a Js
// res.json(moviesJson) // aca renderizo la vista X mandando la info en formato Js