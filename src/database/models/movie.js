const {sequelize, DataTypes} = require('sequelize'); // sequelize hace la conexion a la BD. Datatypes es para definir los tipos de datos

module.exports = (sequelize, DataTypes) => { // esto es equiv a leer un Json con Fs
    const Movie = sequelize.define('Movie', { // aca van los datos de las columnas y sus tipos, no se pone el id. Este nombre Movie se usa luego para hacer db.Movie.comando que es llamar al modelo
        title: DataTypes.STRING, // para varchar se usa String
        rating: DataTypes.DECIMAL, // para decimal usamos decimal
        awards: DataTypes.INTEGER, // para int uso INTEGER
        release_date: DataTypes.DATEONLY, //para datetime uso DATEONLY para no usar hora    
        length: DataTypes.INTEGER,
        genre_id: DataTypes.INTEGER    // aca tengo un numero que representa al genero y esta en otra tabla Genres
    },{
        //timestamps: false // para poner si no existen los time stamps para que no chille sequelize.NO anda soft delete si esta en false
        paranoid: true // esto es genial, en vez de borrar cuando pongo destroy, pone la fecha en la columna deleted_at y sigue estando, aunque no la muestra, luego puede poner resto
    }) 
    Movie.associate = models =>{ // en la carpeta models estan todos los modelos y index.js se encarga de encontrarlos
        Movie.belongsTo(models.Genre,{
            as:'generos', // ASI SE LLAMA LA RELACION DE AHORA EN MAS
            foreignKey: "genre_id" // esta asi en playground SIN ESTO NO ANDA NO DA EL NOMBRE DEL GENERO!!!!!!!!!!!!!
        }); // asocio Movie con Genre, uso belongsTo ya que cada pelicula tiene 1 solo genero
            
        Movie.belongsToMany(models.Actor,{ // asocio Movie con Actors de muchos a muchos pero mediante la tabla intermedia actor_movies
            as:'actores', // un seudonimo para llamarlo Movie.actores. ?
            through: 'actor_movie' // tabla intermedia
            ,foreignKey: 'movie_id'  // en el playground estaba foreignKey: "genre_id", otherKey: "actor_id", timestamp: false pero Gonza no lo puso
            ,otherKey: 'actor_id' // esto daba error en la terminal
            //, timestamps: false
               
        })
    }
    return Movie // se usa Movie sin S en singular y con mayusculas, ya que la tabla se llama movies
}