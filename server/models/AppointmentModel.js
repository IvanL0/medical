import Sequelize from 'sequelize'

class AppointmentModel extends Sequelize.Model{
  static init(sequelize, DataTypes){
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true,
      },
      time_from: {
        type: DataTypes.DATE,
        field: 'time_from',
      },
      clients_id: {
        type: DataTypes.INTEGER,
        field: 'clients_id',
      },
      timetable_id: {
        type: DataTypes.INTEGER, 
        field: 'timetable_id',
      },
    },
    {
      freezeTableName: true,
      tableName: 'appointment',
      modelName: 'appointment',
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
    this.belongsTo(models.Clients, { foreignKey: 'clients_id' })
    this.belongsTo(models.TimeTable, { foreignKey: 'timetable_id' })
  }
}
        
export default AppointmentModel
