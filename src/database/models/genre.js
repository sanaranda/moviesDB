const {sequelize, DataTypes} = require('sequelize'); // sequelize hace la conexion a la BD. Datatypes es para definir los tipos de datos

module.exports = (sequelize, DataTypes) => { // esto es equiv a leer un Json con Fs
    const Genre = sequelize.define('Genre', { // aca van los datos de las columnas y sus tipos, no se pone el id. Este nombre Movie se usa luego para hacer db.Movie.comando que es llamar al modelo
        // sequelize presupone que hay una columna id que es pk y autoincremental, por eso no se pone aca
        name: DataTypes.STRING, // para varchar se usa String
        ranking: DataTypes.INTEGER, //  para int uso INTEGER
        active: DataTypes.INTEGER 
        // sequlize tambien presupone los dos campos de timestamp created at y updated at
    },{
        //timestamps: false // para poner si no existen los time stamps para que no chille sequelize.NO anda soft delete si esta en false
        paranoid: true // esto es genial, en vez de borrar cuando pongo destroy, pone la fecha en la columna deleted_at y sigue estando, aunque no la muestra, luego puede poner resto
    }
    );
    Genre.associate = models =>{ // en la carpeta models estan todos los modelos y index.js se encarga de encontrarlos
        Genre.hasMany(models.Movie); // asocio Genre con Movie, uso hasMany ya que un genero puede tener muchas peliculas
        // en el playground pone as:"peliculas" y foreignKey: "genre_id"
    }
   
    return Genre
}