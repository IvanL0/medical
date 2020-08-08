import Sequelize from 'sequelize'

class TimeTableModel extends Sequelize.Model{
  static init(sequelize, DataTypes){
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true,
      },
      doctors_id: {
        type: DataTypes.INTEGER,
        field: 'doctors_id',
      },
      date: {
        type: DataTypes.DATE, 
        field: 'date',
      },
      time_from: {
        type: DataTypes.DATE,
        field: 'time_from',
      },
      time_to: {
        type: DataTypes.DATE,
        field: 'time_to',
      },
    },
    {
      freezeTableName: true,
      tableName: 'timetable',
      modelName: 'timetable',
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
    this.belongsTo(models.Doctors, { foreignKey: 'doctors_id' })
    this.hasMany(models.Appointment, { foreignKey: 'timetable_id' })
  }
}
        
export default TimeTableModel
