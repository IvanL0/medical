import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import './index.css'
import 'antd/dist/antd.css'
// import configureStore from './configureStore'
import { createBrowserHistory } from 'history'
import store from './configureStore'

import AppContainer from './AppContainer'

import '../src/styles/index.scss'

export const history = createBrowserHistory()

ReactDOM.render(
  <Provider store={store}>
    <AppContainer/>
  </Provider>, document.getElementById('root')
)
