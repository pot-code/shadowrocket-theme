import * as React from 'react'
import { ChromePicker, ColorResult, ColorChangeHandler } from 'react-color'
import { IoIosCheckmarkCircleOutline, IoIosHeart, IoMdClipboard, IoIosRefresh } from 'react-icons/io'

import { throttle } from './util'

import './app.less'
import qrcode from './assets/qrcode.png'

const FRAME_RATE = ~~(1000 / 60)
const EXPORT_PREFIX = 'shadowrocket://color?'
const EXPORT_SUFFIX = '&v=1.0'

interface IControlPanelProps {
  scheme: { [key: string]: string }
  setScheme: Function
  resetScheme: Function
}

interface IControlPanelState {
  currentColor: string
  currentLabel: string
  showTips: boolean
  result: string
}

export class ControlPanel extends React.PureComponent<IControlPanelProps, IControlPanelState> {
  constructor(props: IControlPanelProps) {
    super(props)

    this.state = {
      currentColor: props.scheme.NavigationBarColor,
      currentLabel: 'NavigationBarColor',
      showTips: false,
      result: ''
    }
  }

  activateColorPicker = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, defaultColor: string, label: string) => {
    this.setState({ currentColor: defaultColor, currentLabel: label })
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

    // TODO: optimize
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

  handleExportCopy = (e: React.ClipboardEvent) => {
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
          {Object.keys(scheme).map(field => (
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
          <div styleName="export">
            <a styleName="button" onClick={this.handleExport} onCopy={this.handleExportCopy}>
              <IoMdClipboard />
              <span styleName="label">导出</span>
            </a>
            <a styleName="button warning" onClick={this.props.resetScheme as React.MouseEventHandler}>
              <IoIosRefresh />
              <span styleName="label">重置</span>
            </a>
          </div>
          <p styleName={'tips' + (showTips ? ' show' : '')}>
            <IoIosCheckmarkCircleOutline />
            <span style={{ marginLeft: '8px' }}>导出到剪切板</span>
          </p>
          <div styleName="donate">
            <p
              style={{
                marginTop: '0',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#BCF8FF'
              }}
            >
              <IoIosHeart />
              <span style={{ margin: '0 8px', fontWeight: 700 }}>请随意捐赠</span>
              <IoIosHeart />
            </p>
            <img src={qrcode} style={{ width: '233px', minHeight: '233px' }} />
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
