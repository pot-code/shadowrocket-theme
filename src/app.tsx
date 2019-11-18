import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { ControlPanel } from './control'
import { HomeScreen } from './homescreen'
import './app.less'

function App() {
  const [scheme, setScheme] = React.useState({
    NavigationBarColor: '#1D74BE',
    NavigationBarTextColor: '#FFFFFF',
    TabBarColor: '#F6F6F6',
    TabBarBorderColor: '#EDEDED',
    TabBarSelectedColor: '#1D74BE',
    TabBarUnselectedColor: '#828282',
    TableBackgroundColor: '#F5F5F5',
    TableCellBackgroundColor: '#FFFFFF',
    TextLabelTextColor: '#000000',
    DetaillLabelTextColor: '#C9C9C9',
    ButtonIconColor: '#1D74BE',
    ButtonNormalColor: '#FFFFFF',
    PingSuccessTextColor: '#59A46F',
    PingTimeoutTextColor: '#DA7D72',
    DefaultDotColor: '#FD9502'
  })

  return (
    <div styleName="app">
      <HomeScreen scheme={scheme} />
      <ControlPanel scheme={scheme} setScheme={setScheme} />
      {/* <ToastContainer /> */}
    </div>
  )
}

export default hot(App)
