import * as React from 'react'
import { ChromePicker, ColorResult, ColorChangeHandler } from 'react-color'
import { IoIosCheckmarkCircleOutline, IoIosHeart } from 'react-icons/io'

import './app.less'
import qrcode from './assets/qrcode.png'

function throttle(fn: Function, delay: number = 500, tail: boolean = false): Function {
  let lastInvoked = +new Date()
  let tailTimeout: number | undefined

  return function(...args: any) {
    const invokingTime = +new Date()
    if (invokingTime - lastInvoked > delay) {
      fn(...args)
      lastInvoked = invokingTime
    } else if (tail) {
      clearTimeout(tailTimeout)
      tailTimeout = setTimeout(fn, Math.max(invokingTime - lastInvoked, 4), ...args)
    }
  }
}

const FRAME_RATE = ~~(1000 / 60)
const PICKER_HEIGHT = 240
const EXPORT_PREFIX = 'shadowrocket://color?'
const EXPORT_SUFFIX = '&v=1.0'

interface IControlPanelProps {
  scheme: { [key: string]: string }
  setScheme: Function
}

interface IControlPanelState {
  displayColorPicker: boolean
  currentColor: string
  currentLabel: string
  pickerX: number
  pickerY: number
  showTips: boolean
  result: string
}

export class ControlPanel extends React.PureComponent<IControlPanelProps, IControlPanelState> {
  constructor(props: IControlPanelProps) {
    super(props)

    this.state = {
      displayColorPicker: false,
      currentColor: '',
      currentLabel: '',
      pickerX: 0,
      pickerY: 0,
      showTips: false,
      result: ''
    }
  }

  hideColorPicker = () => {
    this.setState({ displayColorPicker: false })
  }

  activateColorPicker = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, defaultColor: string, label: string) => {
    const { innerHeight } = window
    const {
      clientY,
      clientX,
      currentTarget: { offsetHeight },
      nativeEvent: { offsetX, offsetY }
    } = event

    let pickerX: number, pickerY: number

    pickerX = clientX - offsetX
    pickerY = clientY - offsetY + offsetHeight + 8
    if (pickerY + PICKER_HEIGHT > innerHeight) {
      pickerY = clientY - offsetY - PICKER_HEIGHT - 8
    }

    this.setState({ displayColorPicker: true, currentColor: defaultColor, currentLabel: label, pickerX, pickerY })
  }

  onPickerColorChange = throttle(
    (color: ColorResult) => {
      this.setState({ currentColor: color.hex })
      this.props.setScheme({ ...this.props.scheme, [this.state.currentLabel]: color.hex })
    },
    FRAME_RATE,
    true
  ) as ColorChangeHandler

  handleExport = () => {
    const { scheme } = this.props

    let result = EXPORT_PREFIX
    let pairs = Object.keys(this.props.scheme).reduce((acc, field) => {
      acc.push(`${field}=${encodeURIComponent(scheme[field])}`)
      return acc
    }, [])

    result = result + pairs.join('&') + EXPORT_SUFFIX
    this.setState({ showTips: true, result }, () => {
      document.execCommand('copy')
      setTimeout(() => {
        this.setState({ showTips: false })
      }, 3000)
    })
  }

  handleExportCopy = (e: React.ClipboardEvent<HTMLDivElement>) => {
    // important
    e.preventDefault()
    const { result } = this.state

    if (result) {
      e.clipboardData.setData('text/plain', result)
    }
  }

  render() {
    const { scheme } = this.props
    const { currentColor, currentLabel, showTips } = this.state

    return (
      <div styleName="panels">
        <div styleName="meters">
          {[
            'NavigationBarColor',
            'NavigationBarTextColor',
            'TabBarColor',
            'TabBarBorderColor',
            'TabBarSelectedColor',
            'TabBarUnselectedColor',
            'TableBackgroundColor',
            'TableCellBackgroundColor',
            'TextLabelTextColor',
            'DetaillLabelTextColor',
            'ButtonIconColor',
            'ButtonNormalColor',
            'PingSuccessTextColor',
            'PingTimeoutTextColor',
            'DefaultDotColor'
          ].map(field => (
            <ColorMeter
              field={field}
              key={field}
              color={scheme[field]}
              selected={field === currentLabel}
              clickHandler={this.activateColorPicker}
            />
          ))}
        </div>
        <div styleName="sidebar">
          <ChromePicker color={currentColor} onChange={this.onPickerColorChange} />
          <div styleName="export" onClick={this.handleExport} onCopy={this.handleExportCopy}>
            <div styleName="button">导出</div>
            <p styleName={'tips' + (showTips ? ' show' : '')}>
              <IoIosCheckmarkCircleOutline />
              <span style={{ marginLeft: '8px' }}>导出到剪切板</span>
            </p>
          </div>
          <div styleName="donate">
            <p
              style={{
                marginTop: '0',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FF5722'
              }}
            >
              <IoIosHeart style={{ transform: 'rotateZ(-30deg)' }} />
              <span style={{ margin: '0 8px' }}>请随意捐赠</span>
              <IoIosHeart style={{ transform: 'rotateZ(30deg)' }} />
            </p>
            <img src={qrcode} style={{ width: '233px' }} />
          </div>
        </div>
      </div>
    )
  }
}

const ColorMeter: React.FunctionComponent<{
  color: string
  field: string
  selected: boolean
  clickHandler: Function
}> = props => (
  <div
    styleName={'meter' + (props.selected ? ' selected' : '')}
    onClick={event => {
      props.clickHandler(event, props.color, props.field)
    }}
  >
    <span styleName="label">{props.field}</span>
    <div styleName="indicator">
      <div styleName="sample" style={{ backgroundColor: props.color }}></div>
      {/* <span styleName="hex">{props.color}</span> */}
    </div>
  </div>
)
