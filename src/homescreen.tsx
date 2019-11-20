import * as React from 'react'
import { AiOutlineScan, AiOutlinePlus, AiOutlineHome, AiOutlineSetting, AiOutlineFolderOpen } from 'react-icons/ai'
import { IoIosPulse, IoIosRocket } from 'react-icons/io'
import { GiShipWheel, GiSpeedometer, GiInfo } from 'react-icons/gi'
import { FiChevronRight } from 'react-icons/fi'

import './app.less'

const SERVERS = [
  ['Timeout', '超时'],
  ['JMS-79372', '266ms'],
  ['Bandwagon', '279ms'],
  ['Vultr', '23ms']
]

export const HomeScreen: React.FunctionComponent<{ scheme: { [key: string]: string } }> = props => {
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
    DetaillLabelTextColor,
    ButtonIconColor,
    ButtonNormalColor,
    PingSuccessTextColor,
    PingTimeoutTextColor,
    DefaultDotColor
  } = props.scheme

  return (
    <div styleName="homescreen">
      <div styleName="screen" style={{ backgroundColor: TableBackgroundColor }}>
        <Navigation
          {...{
            NavigationBarColor,
            NavigationBarTextColor,
            ButtonNormalColor
          }}
        />
        <div styleName="main">
          <Actions
            {...{
              ButtonIconColor,
              TextLabelTextColor,
              DetaillLabelTextColor,
              TableCellBackgroundColor,
              TableSeparatorColor
            }}
          />
          <div styleName="section">
            <div styleName="label">
              <span>服务器节点</span>
            </div>
            <div styleName="servers">
              {SERVERS.map((val, index) => (
                <Server
                  delay={val[1]}
                  key={val[0]}
                  {...{
                    ButtonIconColor,
                    TextLabelTextColor,
                    DetaillLabelTextColor,
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
          <p styleName="tip">圆点代表默认节点</p>
        </div>
        <div styleName="footer">
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

const Navigation: React.FunctionComponent<{
  NavigationBarColor: string
  NavigationBarTextColor: string
  ButtonNormalColor: string
}> = props => (
  <div styleName="navigation" style={{ backgroundColor: props.NavigationBarColor }}>
    <div styleName="status-bar"></div>
    <div styleName="title" style={{ color: props.NavigationBarTextColor }}>
      <AiOutlineScan fontSize="26px" color={props.ButtonNormalColor} />
      <span style={{ fontSize: '18px', fontWeight: 400 }}>Shadowrocket</span>
      <AiOutlinePlus fontSize="26px" color={props.ButtonNormalColor} />
    </div>
  </div>
)

const Actions: React.FunctionComponent<{
  ButtonIconColor: string
  TextLabelTextColor: string
  DetaillLabelTextColor: string
  TableSeparatorColor: string
  TableCellBackgroundColor: string
}> = props => (
  <div styleName="actions">
    <TableCell
      icon={<IoIosRocket color={props.ButtonIconColor} />}
      color={props.TableCellBackgroundColor}
      borderColor={props.TableSeparatorColor}
    >
      <div styleName="connection">
        <span style={{ color: props.TextLabelTextColor }}>已连接</span>
        <div styleName="toggle" style={{ backgroundColor: props.ButtonIconColor }}></div>
      </div>
    </TableCell>
    <TableCell
      icon={<GiShipWheel color={props.ButtonIconColor} />}
      color={props.TableCellBackgroundColor}
      borderColor={props.TableSeparatorColor}
    >
      <div styleName="router">
        <span style={{ color: props.TextLabelTextColor }}>全局路由</span>
        <div styleName="config" style={{ color: props.DetaillLabelTextColor }}>
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

const Server: React.FunctionComponent<{
  delay: string
  ButtonIconColor: string
  TextLabelTextColor: string
  DetaillLabelTextColor: string
  PingColor: string
  TableCellBackgroundColor: string
  TableSeparatorColor: string
  DefaultDotColor: string
  address: string
  selected?: boolean
}> = props => {
  let icon = <div style={{ backgroundColor: '#E7E7E9', borderRadius: '50%', height: '100%' }} />

  if (props.selected) {
    icon = (
      <div styleName="selected">
        <div
          styleName="dot"
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
      <div styleName="server">
        <div styleName="host">
          <p styleName="address" style={{ color: props.TextLabelTextColor }}>
            {props.address}
          </p>
          <p styleName="type" style={{ color: props.DetaillLabelTextColor }}>
            shadowsocks
          </p>
        </div>
        <div styleName="status">
          <span styleName="delay" style={{ color: props.PingColor }}>
            {props.delay}
          </span>
          <GiInfo color={props.ButtonIconColor} fontSize="24px" />
        </div>
      </div>
    </TableCell>
  )
}

const TabBar: React.FunctionComponent<{
  TabBarColor: string
  TabBarBorderColor: string
  TabBarSelectedColor: string
  TabBarUnselectedColor: string
}> = props => (
  <div
    styleName="tab-bar"
    style={{ borderTop: '1px solid', borderColor: props.TabBarBorderColor, backgroundColor: props.TabBarColor }}
  >
    <TabBarButton icon={<AiOutlineHome />} text="首页" color={props.TabBarSelectedColor} />
    <TabBarButton icon={<AiOutlineFolderOpen />} text="配置" color={props.TabBarUnselectedColor} />
    <TabBarButton icon={<IoIosPulse />} text="数据" color={props.TabBarUnselectedColor} />
    <TabBarButton icon={<AiOutlineSetting />} text="设置" color={props.TabBarUnselectedColor} />
  </div>
)

const TabBarButton: React.FunctionComponent<{ icon: React.ReactElement; text: string; color: string }> = props => (
  <div styleName="button" style={{ color: props.color }}>
    <span styleName="icon">{props.icon}</span>
    <span styleName="text">{props.text}</span>
  </div>
)

const TableCell: React.FunctionComponent<{
  icon?: React.ReactElement
  color: string
  borderColor: string
}> = props => (
  <div styleName="table-cell" style={{ backgroundColor: props.color, borderColor: props.borderColor }}>
    <div styleName="icon">{props.icon}</div>
    <div styleName="content" style={{ borderColor: props.borderColor }}>
      {props.children}
    </div>
  </div>
)
