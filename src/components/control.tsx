import React from 'react'
import { ChromePicker, ColorResult, ColorChangeHandler } from 'react-color'
import { IoIosCheckmarkCircleOutline, IoIosHeart, IoMdClipboard, IoIosRefresh } from 'react-icons/io'
import Image from 'next/image'
import cx from 'classnames'

import { throttle } from '../lib/util'
import presets from '../lib/preset'

import styles from './control.module.scss'

const FRAME_RATE = ~~(1000 / 60)
const EXPORT_PREFIX = 'shadowrocket://color?'
const EXPORT_SUFFIX = '&v=1.0'

interface IControlPanelProps {
  scheme: Schema
  setScheme: Function
  resetScheme: Function
}

interface IControlPanelState {
  currentColor: string
  currentLabel: string
  selectedScheme: string
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
      selectedScheme: '',
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

  handleResetScheme = () => {
    this.props.resetScheme()
    this.setState({ selectedScheme: '' })
  }

  selectPresetScheme = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const selected = e.currentTarget.dataset['scheme']

    if (selected) {
      this.props.setScheme(presets[selected])
      this.setState({ selectedScheme: selected })
    }
  }

  render() {
    const { scheme } = this.props
    const { currentColor, currentLabel, showTips, selectedScheme } = this.state

    return (
      <div className={styles.panels}>
        <div className={styles.meters}>
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
        <div className={styles.sidebar}>
          <div className={styles.pallette}>
            {Object.keys(presets).map(sc => (
              <div
                data-scheme={sc}
                key={sc}
                onClick={this.selectPresetScheme}
                title={sc}
                className={cx(styles.swatch, {
                  [styles.selected]: selectedScheme === sc
                })}
                style={{ backgroundColor: presets[sc].NavigationBarColor }}
              />
            ))}
          </div>
          <ChromePicker color={currentColor} onChange={this.onPickerColorChange} />
          <div className={styles.export}>
            <a className={styles.button} onClick={this.handleExport} onCopy={this.handleExportCopy}>
              <IoMdClipboard />
              <span className={styles.label}>导出</span>
            </a>
            <a className={cx(styles.button, styles.warning)} onClick={this.handleResetScheme}>
              <IoIosRefresh />
              <span className={styles.label}>重置</span>
            </a>
          </div>
          <p
            className={cx(styles.tips, {
              [styles.show]: showTips
            })}
          >
            <IoIosCheckmarkCircleOutline />
            <span style={{ marginLeft: '8px' }}>导出到剪切板</span>
          </p>
          <div className={styles.donate}>
            <p
              style={{
                marginTop: '0',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}
            >
              <IoIosHeart />
              <span style={{ margin: '0 8px' }}>请随意捐赠</span>
              <IoIosHeart />
            </p>
            <Image src="/images/qrcode.png" width="233" height="233" />
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
    className={cx(styles.meter, {
      [styles.selected]: props.selected
    })}
    onClick={event => {
      props.clickHandler(event, props.color, props.field)
    }}
  >
    <span className={styles.label}>{props.field}</span>
    <div className={styles.indicator}>
      <div className={styles.sample} style={{ backgroundColor: props.color }}></div>
      {/* <span styleName="hex">{props.color}</span> */}
    </div>
  </div>
)
