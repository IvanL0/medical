import Sequelize from 'sequelize'

class UserModel extends Sequelize.Model{
  static init(sequelize, DataTypes){
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(45), 
        field: 'name',
      },
      position: {
        type: DataTypes.STRING(45),
        field: 'position',
      },
    },
    {
      freezeTableName: true,
      tableName: 'doctors',
      modelName: 'doctors',
      sequelize,
    }
    )
  }
  
  static getId(where) {
    return this.findOne({
      where,
      attributes: ["id"],
      order: [["createdAt", "DESC"]]
    })
  }
  
  static associate(models) {
    this.hasMany(models.Clients, {foreignKey: 'doctor_id'})
  }
}
        
export default UserModel
