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
        include: [
          {model: db.TimeTable, required: false,}
        ]
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
      
      if(data.dates && data.times){
        let datesArr = [], timesArr = []
        let startDate = moment(data.dates[0])
        let endDate = moment(data.dates[1])
        
        let startTime = moment(data.times[0])
        let endTime = moment(data.times[1])
        
        for (let dates = moment(startDate); m.isBefore(endDate); m.add(1, 'days')) {
          datesArr.push(m.format())
        }
        
        for (var times = moment(startTime); m.isBefore(endTime); m.add(1, 'days')) {
          timesArr.push(m.format())
        }
        
        for(let i = 0; i < datesArr.length; i++){
          // await db.TimeTable.create({
          //   year: 
          // })
        } 
      }
    } catch(e){
      console.log('ERR', e)
    }
  }
}

export default DoctorController