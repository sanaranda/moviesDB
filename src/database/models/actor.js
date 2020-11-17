const {sequelize, DataTypes} = require('sequelize'); // sequelize hace la conexion a la BD. Datatypes es para definir los tipos de datos

module.exports = (sequelize, DataTypes) => { // esto es equiv a leer un Json con Fs
    const Actor = sequelize.define('Actor', { // aca van los datos de las columnas y sus tipos, no se pone el id. Este nombre Movie se usa luego para hacer db.Movie.comando que es llamar al modelo
        first_name: DataTypes.STRING, // para varchar se usa String
        last_name: DataTypes.STRING, 
        rating: DataTypes.DECIMAL,
        favorite_movie_id: DataTypes.INTEGER    // aca tengo un numero que representa al genero y esta en otra tabla Genres
    },{
        //timestamps: false // para poner si no existen los time stamps para que no chille sequelize.NO anda soft delete si esta en false
        paranoid: true // esto es genial, en vez de borrar cuando pongo destroy, pone la fecha en la columna deleted_at y sigue estando, aunque no la muestra, luego puede poner resto
    }) 
    Actor.associate = models =>{ // en la carpeta models estan todos los modelos y index.js se encarga de encontrarlos
        Actor.belongsToMany(models.Movie,{ // asocio Movie con Actors de muchos a muchos pero mediante la tabla intermedia actor_movies
            as: 'peliculas',// un seudonimo para llamarlo Actor.peliculas. ?
            through: 'actor_movie' // tabla intermedia
            ,foreignKey: 'actor_id' 
            ,otherKey: 'movie_id' 
            //, timestamps: false
        })
    }

    return Actor // se usa Movie sin S en singular y con mayusculas, ya que la tabla se llama movies
}