import React from 'react'
import { FiChevronRight } from 'react-icons/fi'
import { GiShipWheel, GiSpeedometer } from 'react-icons/gi'
import { IoIosRocket } from 'react-icons/io'

import { TableCell } from './TableCell'

import styles from './Actions.module.scss'

export const Actions: React.FunctionComponent<{
  ButtonIconColor: string
  TextLabelTextColor: string
  DetailLabelTextColor: string
  TableSeparatorColor: string
  TableCellBackgroundColor: string
}> = (props) => (
  <div className={styles.actions}>
    <TableCell
      icon={<IoIosRocket color={props.ButtonIconColor} />}
      color={props.TableCellBackgroundColor}
      borderColor={props.TableSeparatorColor}
    >
      <div className={styles.connection}>
        <span style={{ color: props.TextLabelTextColor }}>已连接</span>
        <div className={styles.toggle} style={{ backgroundColor: props.ButtonIconColor }}></div>
      </div>
    </TableCell>
    <TableCell
      icon={<GiShipWheel color={props.ButtonIconColor} />}
      color={props.TableCellBackgroundColor}
      borderColor={props.TableSeparatorColor}
    >
      <div className={styles.router}>
        <span style={{ color: props.TextLabelTextColor }}>全局路由</span>
        <div className={styles.config} style={{ color: props.DetailLabelTextColor }}>
          <span style={{ marginRight: '4px' }}>配置</span>
          <FiChevronRight />
        </div>
      </div>
    </TableCell>
    <TableCell
      icon={<GiSpeedometer color={props.ButtonIconColor} />}
      color={props.TableCellBackgroundColor}
      borderColor={props.TableSeparatorColor}
    >
      <span style={{ color: props.TextLabelTextColor }}>延迟测试</span>
    </TableCell>
  </div>
)
