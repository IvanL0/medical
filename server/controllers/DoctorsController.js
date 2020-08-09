import db from '../dbconfig.js'
import Sequelize from 'sequelize'
import moment from 'moment'

const Op = Sequelize.Op

class DoctorController{
  constructor(model){    
    this.getAll = this.getAll.bind(this)
    this.getOne = this.getOne.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
  }
  
  getOne = async(req, res, next) => {
    try{
      const doctor = await db.Doctors.findOne({
        where: {id: req.params.id},
        include: [{
            model: db.TimeTable, 
            required: false,
            include: [{
              model: db.Appointment,
              required: false
            }]
          }]
      })
      res.status(200).send({data: doctor})
    } catch(e){
      console.log('ERR', e)
    }
  }
  
  getAll = async(req, res, next) => {
    try{
      const doctors = await db.Doctors.findAll()
      res.status(200).send({data: doctors})
    } catch(e){
      console.log('ERR', e)
    }
  }
  
  create = async(req, res, next) => {
    const doctor = req.body
    
    try{
      await db.Doctors.create({
        name: doctor.name,
        age: doctor.age,
        gender: doctor.gender,
        phone: doctor.phone,
      })
      
      res.status(201).send()
      
    }catch(e){
      console.log('ERR', e)
    }
  }

  update = async(req, res, next) => {
    const data = req.body
    
    try{
      const doctor = await db.Doctors.findOne({
        where: {id: req.params.id}
      })
      
      if(data.info){
        await doctor.update(data.info)
      }
      
      if(data.timetable){
        let years = data.timetable.map(item => moment(item[0]).get('year'))
        let months = data.timetable.map(item => moment(item[0]).get('month'))
        let dates = data.timetable.map(item => moment(item[0]).get('date'))
        
        const timetable = await db.TimeTable.findAll({
          where: {
            [Op.and]: [{year: years, month: months, date: dates}, {doctors_id: doctor.dataValues.id}]
          }
        })
        
        console.log('TIMETABLE', timetable)
        
        if(timetable.length > 0){
          for(let i = 0; i < data.timetable.length; i++){
            let year = moment(data.timetable[i][0]).year()
            console.log('YEAR', year)
            await db.TimeTable.update({
              year: moment(data.timetable[i][0]).get('year'),
              month: moment(data.timetable[i][0]).get('month'),
              date: moment(data.timetable[i][0]).get('date'),
              time_from: data.timetable[i][0],
              time_to: data.timetable[i][1],
            }, 
            {
              where: {
                [Op.and]: [{year: years, month: months, date: dates}, {doctors_id: doctor.dataValues.id}]
              }
            })
          }
        } else {
          for(let i = 0; i < data.timetable.length; i++){
            let year = moment(data.timetable[i][0]).format('YYYY')
            console.log('YEAR', year)
            await db.TimeTable.create({
              year: moment(data.timetable[i][0]).get('year'),
              month: moment(data.timetable[i][0]).get('month'),
              date: moment(data.timetable[i][0]).get('date'),
              time_from: data.timetable[i][0],
              time_to: data.timetable[i][1],
              doctors_id: doctor.dataValues.id,
            })
          }
        }
      }
      res.status(201).send()
    } catch(e){
      console.log('ERR', e)
    }
  }
}

export default DoctorController