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
} from 'antd'

import {
  EditOutlined, CheckCircleFilled,
} from '@ant-design/icons'

import lodash from 'lodash'
import moment from 'moment'
import 'moment/locale/ru'

function Doctors (props){
  const { doctors } = props
  
  const [doctor, setDoctor] = useState({
    id: 0,
    name: '',
    age: '',
    gender: '',
    phone: '',
  })
  
  const [state, setState] = useState({
    visible: false,
    visibleEdit: false,
    calendar: [],
    selectedTime: null,
    selectedDate: [],
    selectedTimes: [],
    selectedDates: [],
  })
  
  const {
    id,
    name,
    age,
    gender,
    phone,
  } = doctor
  
  const { 
    visible,
    visibleEdit,
    calendar, 
    selectedTime,
    selectedDate,
    selectedTimes, 
    selectedDates,
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
    setState({
      ...state,
      selectedDates: props.doctor.items.timetables[0].dates
    })
  }
  
  const showModal = () => {
    setState({...state, visible: true})
  }
  
  const showEditModal = (id) => {
    props.getDoctor(id)
    setState({...state, visibleEdit: true})
    setDoctor({...doctor, id: id})
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
        sendObj[key] = value
      }
      
      return sendObj
    }, {})
    
    if(selectedDates.length > 0){
      sendObj['dates'] = calendar
    }
    
    props.updateDoctor(id, sendObj)
  }
  
  const calendarColor = (date) => {
    if(selectedDates.length > 0){
      let check = selectedDates.filter(item => item[0].date() === date)
      if(check.length > 0){
        return 'green'
      }
    }
    return 'red'
  }
              
  return(
    <Layout style={{padding: '50px'}}>
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
        <section className='doctors_flex'>
          <Button 
            style={{marginBottom: '20px'}}
            type='primary'
            onClick={() => showModal()}
          >Добавить врача</Button>
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
                  <Button icon={<EditOutlined />} onClick={() => showEditModal(doctor.id)}/>
                  <Button style={{marginLeft: '10px'}} type='primary'>Записаться</Button>
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
  createDoctor: (data) => dispatch(postDoctor(data)),
  clearDoctor: () => dispatch({type: 'CLEAR_DOCTOR'})
})

export default connect(mapStateToProps, mapDispatchToProps)(Doctors)