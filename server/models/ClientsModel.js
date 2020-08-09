import Sequelize from 'sequelize'

class ClientsModel extends Sequelize.Model{
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
      age: {
        type: DataTypes.STRING(45),
        field: 'age',
      },
      gender: {
        type: DataTypes.STRING(45),
        field: 'gender',
      },
      phone: {
        type: DataTypes.STRING(45),
        field: 'phone',
      }
    },
    {
      freezeTableName: true,
      tableName: 'clients',
      modelName: 'clients',
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
    this.hasMany(models.Appointment, { foreignKey: 'clients_id'})
  }
}
        
export default ClientsModel
