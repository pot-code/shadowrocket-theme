import React from 'react'

import styles from './TableCell.module.scss'

export const TableCell: React.FunctionComponent<{
  icon?: React.ReactElement
  color: string
  borderColor: string
}> = (props) => (
  <div className={styles['table-cell']} style={{ backgroundColor: props.color, borderColor: props.borderColor }}>
    <div className={styles.icon}>{props.icon}</div>
    <div className={styles.content} style={{ borderColor: props.borderColor }}>
      {props.children}
    </div>
  </div>
)
