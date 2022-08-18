const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
class Category extends Model { }

Category.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        workout_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Workout',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        modelname: 'Category'
    }
);

module.exports = Category;