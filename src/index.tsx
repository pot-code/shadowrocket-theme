import * as React from 'react'
import * as ReactDom from 'react-dom'
import App from './app'

import 'normalize.css'
// import 'react-toastify/dist/ReactToastify.css'
import './styles/index.css'

ReactDom.render(<App />, document.querySelector('#root'))
