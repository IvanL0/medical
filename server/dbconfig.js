'use strict'

import Sequelize from 'sequelize'
import ClientsModel from './models/ClientsModel.js'
import DoctorsModel from './models/DoctorsModel.js'
import TimeTableModel from './models/TimeTableModel.js'
import AppointmentModel from './models/AppointmentModel.js'

const connection = new Sequelize(
  process.env.DATABASE_NAME, 
  process.env.DATABASE_USERNAME, 
  process.env.DATABASE_PASSWORD, 
    {
      host: process.env.HOSTNAME,
      dialect: 'mysql',
      logging: false,
    }
)

const models = {
  Clients: ClientsModel.init(connection, Sequelize),
  Doctors: DoctorsModel.init(connection, Sequelize),
  TimeTable: TimeTableModel.init(connection, Sequelize),
  Appointment: AppointmentModel.init(connection, Sequelize),
}

Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models))

const db = {
  ...models,
  connection,
}

export default db