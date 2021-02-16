import React from 'react'
import cx from 'classnames'

import styles from './ColorMeter.module.scss'

export const ColorMeter: React.FunctionComponent<{
  color: string
  field: string
  selected: boolean
  clickHandler: Function
}> = (props) => (
  <div
    className={cx(styles.meter, {
      [styles.selected]: props.selected
    })}
    onClick={(event) => {
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
