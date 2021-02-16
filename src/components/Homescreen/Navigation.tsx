import { AiOutlineScan, AiOutlinePlus } from 'react-icons/ai'

import styles from './Navigation.module.scss'

export const Navigation: React.FunctionComponent<{
  NavigationBarColor: string
  NavigationBarTextColor: string
  ButtonNormalColor: string
}> = (props) => (
  <div className={styles.navigation} style={{ backgroundColor: props.NavigationBarColor }}>
    <div className={styles['status-bar']}></div>
    <div className={styles.title} style={{ color: props.NavigationBarTextColor }}>
      <AiOutlineScan fontSize="26px" color={props.ButtonNormalColor} />
      <span style={{ fontSize: '18px', fontWeight: 400 }}>Shadowrocket</span>
      <AiOutlinePlus fontSize="26px" color={props.ButtonNormalColor} />
    </div>
  </div>
)
