import React, { useState, useEffect } from 'react'

import { connect } from 'react-redux'
import { getDoctors, postDoctor, getDoctor, updateDoctor } from '../../actions/doctors/doctors'

import {
  Layout,
  Card,
  Button,
  Modal,
  Input,
  Form,
  Calendar,
  DatePicker,
  TimePicker,
  List,
  Tag
} from 'antd'

import {
  EditOutlined, CheckCircleFilled,
} from '@ant-design/icons'

import lodash from 'lodash'
import moment from 'moment'
import 'moment/locale/ru'
import { createClient } from '../../actions/doctors/clients'

function Doctors (props){
  const { doctors } = props
  
  const [reg, setReg] = useState({  
    time: {},
    timetable_id: '',
    client_name: '',
    client_phone: '',
    client_age: '',
    client_gender: '',
  })
  
  const [doctor, setDoctor] = useState({  
    name: '',
    age: '',
    gender: '',
    phone: '',
  })
  
  const [state, setState] = useState({
    id: 0,
    range: [],
    timetable_id: null,
    visible: false,
    visibleEdit: false,
    visibleReg: false,
    calendar: [],
    selectedTime: null,
    selectedDate: [],
    selectedTimes: [],
    selectedDates: [],
    selectedTags: []
  })
  
  const {
    name,
    age,
    gender,
    phone,
  } = doctor
  
  const { 
    id,
    range,
    timetable_id,
    visible,
    visibleEdit,
    visibleReg,
    calendar, 
    selectedTime,
    selectedDate,
    selectedTimes, 
    selectedDates,
    selectedTags,
  } = state
  
  useEffect(() => {
    if(!props.doctors.isFetching){
      props.getDoctors()
    }
    
    if(props.doctor.isFetching && Object.keys(props.doctor.items).length > 0){
      if(props.doctor.items.timetables.length > 0){
        habdleDoctorTimetable()
      }
      
      handleDoctorInfo()
    }
    
  }, [props.doctor.isFetching])
  
  const handleDoctorInfo = () => {
    setDoctor({
      ...state, 
      name: props.doctor.items.name,
      age: props.doctor.items.age,
      phone: props.doctor.items.phone,
      gender: props.doctor.items.gender,
    })
  }
  
  const habdleDoctorTimetable = () => {
    let newArr = []
    let count
    newArr.push([moment(props.doctor.items.timetables[0].time_from), moment(props.doctor.items.timetables[0].time_to)])
    newArr.map(item => {
      let from = moment(item[0]).get('hour')
      count = moment(item[1]).get('hour') - moment(item[0]).get('hour')
      for(let i = 0; i < count + 1; i++){
        let hour = moment(item[0]).set('hour', from + i)
        range.push(moment(hour).get('hour'))
      }
    })
    setState({
      ...state,
      selectedDates: newArr,
      range: range
    })
    setReg({...state, timetable_id: props.doctor.items.timetables[0].id})
  }
  
  const showModal = () => {
    setState({...state, visible: true})
  }
  
  const showEditModal = (id) => {
    props.getDoctor(id)
    setState({...state, visibleEdit: true, id: id})
  }

  const handleCreate = (e) => {
    createDoctor()
  }
  
  const handleUpdate = (e) => {
    updateDoctor()
  }

  const handleCancelCreate = (e) => {
    setState({...state, visible: false})
  }
  
  const handleCancelUpdate = (e) => {
    setState({...state, visibleEdit: false})
    props.clearDoctor()
  }

  const handleChange = (key, value) => {
    setDoctor({...doctor, [key]: value})
  }

  const handleDate = (date) => {
    checkSelectionTime(date)
  }
  
  const handleTime = (time) => {   
    let checkDate = selectedDates.filter(item => moment(item[0]._d).format('ll') === moment(selectedDate._d).format('ll'))
    if(checkDate.length > 0){
      let newArr = selectedDates.filter(item => moment(item[0]._d).format('ll') !== moment(selectedDate._d).format('ll'))
      let from = selectedDate.set({'hour': time[0].get('hour'), 'minutes': time[0].get('minutes')})
      let newObj = from.clone()
      let to = newObj.set({'hour': time[1].get('hour'), 'minutes': time[1].get('minutes')})
      newArr.push([from, to])
      setState({...state, selectedDates: newArr})
    } else {
      let from = selectedDate.set({'hour': time[0].get('hour'), 'minutes': time[0].get('minutes')})
      let newObj = from.clone()
      let to = newObj.set({'hour': time[1].get('hour'), 'minutes': time[1].get('minutes')})
      selectedDates.push([from, to])
      setState({...state, selectedDates: selectedDates, selectedTime: [from, to]})
    }
  }
  
  const checkSelectionTime = (date) => {
    let checkTimes = selectedDates.filter(item => moment(item[0]._d).format('ll') === moment(date._d).format('ll'))
    if(checkTimes.length > 0){
      setState({...state, selectedTime: checkTimes[0], selectedDate: date})
    } else {
      setState({...state, selectedTime: null, selectedDate: date})
    }
  }

  const createDoctor = () => {
    let sendObj = Object.entries(doctor).reduce((sendObj, [key, value]) => {
      if(typeof value === 'string'){
        sendObj[key] = value
      }
      return sendObj
    }, {})
    
    props.createDoctor(sendObj)
  }
  
  const updateDoctor = () => {
    let sendObj = Object.entries(doctor).reduce((sendObj, [key, value]) => {
      if(typeof value === 'string' && value !== ''){
        sendObj['info'] = {[key]: value}
      }
      
      return sendObj
    }, {})
    
    if(selectedDates.length > 0){
      if(timetable_id !== null){
        sendObj['timetable_id'] = timetable_id
      }
      sendObj['timetable'] = selectedDates
    }
    
    props.updateDoctor(id, sendObj)
  }
  
  const calendarColor = (date) => {
    if(selectedDates.length > 0){
      let check = selectedDates.filter(item => { 
        return item[0].date() === date})
      if(check.length > 0){
        return 'green'
      }
    }
    return 'red'
  }
  
  const showRegModal = (id) => {
    if(visibleReg){
      props.clearDoctor()
      setState({...state, visibleReg: !visibleReg, selectedDates: [], range: []})
    } else {
      props.getDoctor(id)
      setState({...state, visibleReg: !visibleReg})
    }
  }
  
  const updateReg = () => {
    let sendObj = Object.entries(reg).reduce((sendObj, [key, value]) => {
      if(typeof value === 'string' && value !== ''){
        sendObj[key] = value
      }
      if(typeof value === 'number'){
        sendObj[key] = value
      }
      return sendObj
    }, {})
    
    props.updateReg(sendObj)
  }  
  
  const handleClient = (key, value) => {
    setReg({...reg, [key]: value})
  }
  
  const handleTag = (tag, checked, hour) => {
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag)
    setState({...state, selectedTags: nextSelectedTags })
    setReg({...reg, time: hour.toString()})
  }
              
  return(
    <Layout style={{padding: '50px'}}>
      <Modal
        title='Записаться'
        visible={visibleReg}
        onOk={updateReg}
        onCancel={showRegModal}
        width={'fit-content'}
        style={{overflow: 'auto'}}
        okText={'Сохранить'}
        cancelText={'Отмена'}
      >
        <div style={{display: 'flex', flexDirection: 'row', overflow: 'auto'}}>
          <Form style={{width: '300px'}}>
            <Form.Item>
              <label>ФИО</label>
              <Input  
                onChange={(e) => handleClient('name', e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <label>Возраст</label>
              <Input 
                onChange={(e) => handleClient('age', e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <label>Пол</label>
              <Input 
                onChange={(e) => handleClient('gender', e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <label>Телефон</label>
              <Input 
                onChange={(e) => handleClient('phone', e.target.value)}
              />
            </Form.Item>
          </Form>
          <section 
            style={{
              width: '300px', 
              display: 'flex', 
              flexDirection: 'column',
              margin: '0 10px'
            }}
          >
            <Calendar 
              fullscreen={false} 
              onChange={(e) => handleDate(e)}
              dateCellRender={(dates) => {
                let date = moment(dates)
                let day = date.date()
                let empty = date.day()
                return(
                  <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                    <div style={{
                      width: '4px', 
                      height: '4px', 
                      borderRadius: '2px', 
                      backgroundColor: empty === 0 || empty === 6 ? null : calendarColor(day)
                    }}/>
                  </div>
                )
              }}
            />
          </section>
          <section
            style={{
              display: 'flex', 
              flexDirection: 'column',
              margin: '10px 10px'
            }}
          >
            {
              selectedTime && Object.keys(props.doctor.items).length > 0 ?
              range.map((item, i) => {
                return selectedDates.map(date => {
                  return props.doctor.items.timetables.map(a => {
                    let hour = moment(date[0]).set('hour', item)
                    if(a.appointments.filter(b => moment(b.time).get('hour') === moment(hour).get('hour')).length > 0){
                      return (
                        <Tag key={i} color='red'>{moment(hour).get('hour') + ':' + moment(hour).get('minutes')}</Tag>
                      )
                    } else {
                      return(
                        <Tag.CheckableTag 
                          key={i}
                          checked={selectedTags.indexOf(i) > -1}
                          onChange={checked => handleTag(i, checked, hour)}
                        >{moment(hour).get('hour') + ':' + moment(hour).get('minutes')}</Tag.CheckableTag>
                      )
                    }
                  })
                })
              })
              : null
            }
          </section>
        </div>
      </Modal>
      <Modal
        title='Добавить доктора'
        visible={visible}
        onOk={handleCreate}
        onCancel={handleCancelCreate}
        width={'fit-content'}
        style={{overflow: 'auto'}}
        okText={'Сохранить'}
        cancelText={'Отмена'}
      >
        <div style={{display: 'flex', flexDirection: 'row', overflow: 'auto'}}>
          <Form style={{width: '300px'}}>
            <Form.Item>
              <label>ФИО</label>
              <Input  
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <label>Возраст</label>
              <Input 
                onChange={(e) => handleChange('age', e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <label>Пол</label>
              <Input 
                onChange={(e) => handleChange('gender', e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <label>Телефон</label>
              <Input 
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
      <Modal
        title='Редактировать'
        visible={visibleEdit}
        onOk={handleUpdate}
        onCancel={handleCancelUpdate}
        width={'fit-content'}
        style={{overflow: 'auto'}}
        okText={'Сохранить'}
        cancelText={'Отмена'}
      >
        <div style={{display: 'flex', flexDirection: 'row', overflow: 'auto'}}>
          <Form style={{width: '300px'}}>
            <Form.Item>
              <label>ФИО</label>
              <Input 
                value={name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <label>Возраст</label>
              <Input 
                value={age}
                onChange={(e) => handleChange('age', e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <label>Пол</label>
              <Input 
                value={gender}
                onChange={(e) => handleChange('gender', e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <label>Телефон</label>
              <Input 
                value={phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </Form.Item>
          </Form>
          <section 
            style={{
              width: '300px', 
              display: 'flex', 
              flexDirection: 'column',
              margin: '0 10px'
            }}
          >
            <Calendar 
              fullscreen={false} 
              onChange={(e) => handleDate(e)}
              dateCellRender={(dates) => {
                let date = moment(dates)
                let day = date.date()
                let empty = date.day()
                return(
                  <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                    <div style={{
                      width: '4px', 
                      height: '4px', 
                      borderRadius: '2px', 
                      backgroundColor: empty === 0 || empty === 6 ? null : calendarColor(day)
                    }}/>
                  </div>
                )
              }
                
              }
            />
            <TimePicker.RangePicker 
              allowClear={true}
              value={selectedTime}
              onChange={handleTime}
            />
          </section>
        </div>
      </Modal>
      <Layout.Content>
        <Button 
          style={{marginBottom: '20px'}}
          type='primary'
          onClick={() => showModal()}
        >Добавить врача</Button>
        <section className='doctors_flex'>
          {
            doctors.items.map((doctor, i) => (
              <Card 
                key={i} 
                style={{width: 'fit-content'}}
              >
                <Card.Meta 
                  title={doctor.name}
                  description={doctor.phone}
                />
                <div style={{marginTop: '20px'}}>
                  <Button 
                    icon={<EditOutlined />} 
                    onClick={() => showEditModal(doctor.id)}
                  />
                  <Button 
                    style={{marginLeft: '10px'}} 
                    type='primary'
                    onClick={() => showRegModal(doctor.id)}
                  >Записаться</Button>
                </div>
              </Card>
            ))
          }
        </section>
      </Layout.Content>
    </Layout>
  )
  
}

const mapStateToProps = state => ({
  doctor: state.doctor,
  doctors: state.doctors,
  clients: state.clients,
})

const mapDispatchToProps = dispatch => ({
  getDoctor: (id) => dispatch(getDoctor(id)),
  getDoctors: () => dispatch(getDoctors()),
  updateDoctor: (id, data) => dispatch(updateDoctor(id, data)),
  updateReg: (data) => dispatch(createClient(data)),
  createDoctor: (data) => dispatch(postDoctor(data)),
  clearDoctor: () => dispatch({type: 'CLEAR_DOCTOR'})
})

export default connect(mapStateToProps, mapDispatchToProps)(Doctors)