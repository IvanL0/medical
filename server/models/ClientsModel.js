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
        field: 'login',
      },
    },
    {
      freezeTableName: true,
      tableName: 'user',
      modelName: 'user',
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
    this.belongsTo(models.Doctors, { foreignKey: 'client_id'})
  }
}
        
export default ClientsModel
