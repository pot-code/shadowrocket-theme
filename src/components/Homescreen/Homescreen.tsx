import React from 'react'

import { Navigation } from './Navigation'
import { Actions } from './Actions'
import { Server } from './Server'

import styles from './Homescreen.module.scss'
import { TabBar } from './TabBar'

const SERVERS = [
  ['Timeout', '超时'],
  ['JMS-79372', '266ms'],
  ['Bandwagon', '279ms'],
  ['Vultr', '23ms']
]

export const HomeScreen: React.FunctionComponent<{ scheme: Schema }> = (props) => {
  const {
    NavigationBarColor,
    NavigationBarTextColor,
    TabBarColor,
    TabBarBorderColor,
    TabBarSelectedColor,
    TabBarUnselectedColor,
    TableSeparatorColor,
    TableBackgroundColor,
    TableCellBackgroundColor,
    TextLabelTextColor,
    DetailLabelTextColor,
    ButtonIconColor,
    ButtonNormalColor,
    PingSuccessTextColor,
    PingTimeoutTextColor,
    DefaultDotColor
  } = props.scheme

  return (
    <div className={styles.homescreen}>
      <div className={styles.screen} style={{ backgroundColor: TableBackgroundColor }}>
        <Navigation
          {...{
            NavigationBarColor,
            NavigationBarTextColor,
            ButtonNormalColor
          }}
        />
        <div className={styles.main}>
          <Actions
            {...{
              ButtonIconColor,
              TextLabelTextColor,
              DetailLabelTextColor,
              TableCellBackgroundColor,
              TableSeparatorColor
            }}
          />
          <div className={styles.section}>
            <div className={styles.label}>
              <span>服务器节点</span>
            </div>
            <div className={styles.servers}>
              {SERVERS.map((val, index) => (
                <Server
                  delay={val[1]}
                  key={val[0]}
                  {...{
                    ButtonIconColor,
                    TextLabelTextColor,
                    DetailLabelTextColor,
                    TableCellBackgroundColor,
                    TableSeparatorColor,
                    DefaultDotColor
                  }}
                  PingColor={val[1] === '超时' ? PingTimeoutTextColor : PingSuccessTextColor}
                  address={val[0]}
                  selected={index == 0}
                />
              ))}
            </div>
          </div>
          <p className={styles.tip}>圆点代表默认节点</p>
        </div>
        <div className={styles.footer}>
          <TabBar
            {...{
              TabBarColor,
              TabBarBorderColor,
              TabBarSelectedColor,
              TabBarUnselectedColor
            }}
          />
        </div>
      </div>
    </div>
  )
}
