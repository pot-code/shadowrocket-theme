import React from 'react'
import { GiInfo } from 'react-icons/gi'

import { TableCell } from './TableCell'

import styles from './Server.module.scss'

export const Server: React.FunctionComponent<{
  delay: string
  ButtonIconColor: string
  TextLabelTextColor: string
  DetailLabelTextColor: string
  PingColor: string
  TableCellBackgroundColor: string
  TableSeparatorColor: string
  DefaultDotColor: string
  address: string
  selected?: boolean
}> = (props) => {
  let icon = <div style={{ backgroundColor: '#E7E7E9', borderRadius: '50%', height: '100%' }} />

  if (props.selected) {
    icon = (
      <div className={styles.selected}>
        <div
          className={styles.dot}
          style={{
            backgroundColor: props.DefaultDotColor
          }}
        />
        <div
          style={{ backgroundColor: '#E7E7E9', borderRadius: '50%', width: '100%', height: '100%', flexShrink: 0 }}
        />
      </div>
    )
  }
  return (
    <TableCell icon={icon} color={props.TableCellBackgroundColor} borderColor={props.TableSeparatorColor}>
      <div className={styles.server}>
        <div className={styles.host}>
          <p className={styles.address} style={{ color: props.TextLabelTextColor }}>
            {props.address}
          </p>
          <p className={styles.type} style={{ color: props.DetailLabelTextColor }}>
            shadowsocks
          </p>
        </div>
        <div className={styles.status}>
          <span className={styles.delay} style={{ color: props.PingColor }}>
            {props.delay}
          </span>
          <GiInfo color={props.ButtonIconColor} fontSize="24px" />
        </div>
      </div>
    </TableCell>
  )
}
