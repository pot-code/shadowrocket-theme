import React from 'react'
import { AiOutlineHome, AiOutlineFolderOpen, AiOutlineSetting } from 'react-icons/ai'
import { IoIosPulse } from 'react-icons/io'

import styles from './TabBar.module.scss'

const TabBarButton: React.FunctionComponent<{ icon: React.ReactElement; text: string; color: string }> = (props) => (
  <div className={styles.button} style={{ color: props.color }}>
    <span className={styles.icon}>{props.icon}</span>
    <span className={styles.text}>{props.text}</span>
  </div>
)

export const TabBar: React.FunctionComponent<{
  TabBarColor: string
  TabBarBorderColor: string
  TabBarSelectedColor: string
  TabBarUnselectedColor: string
}> = (props) => (
  <div
    className={styles['tab-bar']}
    style={{ borderTop: '1px solid', borderColor: props.TabBarBorderColor, backgroundColor: props.TabBarColor }}
  >
    <TabBarButton icon={<AiOutlineHome />} text="首页" color={props.TabBarSelectedColor} />
    <TabBarButton icon={<AiOutlineFolderOpen />} text="配置" color={props.TabBarUnselectedColor} />
    <TabBarButton icon={<IoIosPulse />} text="数据" color={props.TabBarUnselectedColor} />
    <TabBarButton icon={<AiOutlineSetting />} text="设置" color={props.TabBarUnselectedColor} />
  </div>
)
