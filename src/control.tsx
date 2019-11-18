import * as React from 'react'
import { ChromePicker, ColorResult, ColorChangeHandler } from 'react-color'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'

import './app.less'

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

/* 
shadowrocket://color?NavigationBarColor=%232473DD&NavigationBar2Color=%234D4D4D&NavigationBarTextColor=%23FFFFFF&NavigationBar2TextColor=%23FFFFFF&TabBarColor=%23E6F5F5F5&TabBarBorderColor=%23E6E6E6&TabBarSelectedColor=%232473BD&TabBarUnselectedColor=%23808080&TableBackgroundColor=%23F5F5F5&TableCellBackgroundColor=%23FFFFFF&TableCellSelectedBackgroundColor=%23E6E6E6&TableSeparatorColor=%23E0E0E0&TextFieldTextColor=%234D4D4D&PlaceholderColor=%23AAAAAA&TextLabelTextColor=%23000000&DetailLabelTextColor=%23808080&TextLabelDeleteColor=%23ED402E&HeaderFooterTextColor=%23808080&SearchFieldBackgroundColor=%23FFFFFF&IndicatorColor=%23808080&ButtonIconColor=%232473BD&ButtonNormalColor=%23FFFFFF&ButtonNormal2Color=%23CCFFFFFF&ButtonNormal3Color=%23808080&ButtonHighlightedColor=%2399FFFFFF&ButtonHighlighted2Color=%23FFFFFF&ButtonHighlighted3Color=%23000000&ButtonDisabledColor=%2380FFFFFF&ButtonDisabled2Color=%2380FFFFFF&PingSuccessTextColor=%2345995E&PingTimeoutTextColor=%23CF5747&DefaultDotColor=%23FF9400&HUDBackgroundColor=%23FFFFFF&v=1.0
 */

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
            'ButtonlconColor',
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
