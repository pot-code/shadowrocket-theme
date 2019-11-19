import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { GiInfo } from 'react-icons/gi'

import { ControlPanel } from './control'
import { HomeScreen } from './homescreen'
import { throttle } from './util'

import './app.less'

const STORAGE_KEY = 'sr_scheme'
const SAVE_INTERVAL = 1e3 * 10 // 10s

const defaultScheme = {
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
}

const saveSchemeToLocalStorage = throttle(
  (scheme: { [key: string]: string }) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scheme))
  },
  SAVE_INTERVAL,
  true
)

function MobileTip() {
  return (
    <p styleName="mobile-tip">
      <GiInfo />
      <span style={{ verticalAlign: 'top' }}>
        虽然本页面提供了手机端适配，但是功能可能不正常，建议您切换到 PC 端使用
      </span>
    </p>
  )
}

function App() {
  const [scheme, setScheme] = React.useState(defaultScheme)
  const [first, invalidate] = React.useState(true)

  React.useEffect(() => {
    const savedScheme = localStorage.getItem(STORAGE_KEY)

    if (savedScheme && first) {
      setTimeout(() => {
        setScheme(JSON.parse(savedScheme))
        invalidate(false)
      }, 0)
    } else {
      saveSchemeToLocalStorage(scheme)
    }
  })

  return (
    <div styleName="app">
      <MobileTip />
      <HomeScreen scheme={scheme} />
      <ControlPanel scheme={scheme} setScheme={setScheme} resetScheme={() => setScheme(defaultScheme)} />
      {/* <ToastContainer /> */}
    </div>
  )
}

export default hot(App)
