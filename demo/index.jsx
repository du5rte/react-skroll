import React from 'react'
import ReactDOM from 'react-dom'

import Demo from './Demo'
import { ScrollProvider } from '../src'

ReactDOM.render(
  <ScrollProvider>
    <Demo />
  </ScrollProvider>,
  document.getElementById('render')
)
