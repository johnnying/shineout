import React from 'react'
import PropTypes from 'prop-types'
import { PureComponent } from '../component'
import { treeClass } from '../styles'
import Spin from '../Spin'
import Checkbox from './Checkbox'

const loading = (
  <span className={treeClass('icon-loading')}>
    <Spin name="ring" size={12} />
  </span>
)

class Content extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      fetching: false,
    }

    this.handleNodeClick = this.handleNodeClick.bind(this)
    this.handleIndicatorClick = this.handleIndicatorClick.bind(this)
  }

  handleNodeClick() {
    const { data, id, parentClickExpand, childrenKey } = this.props
    const children = data[childrenKey]
    const hasChildren = children && children.length > 0
    if (hasChildren && parentClickExpand) {
      this.handleIndicatorClick()
    } else {
      this.props.onNodeClick(data, id)
    }
  }

  handleIndicatorClick() {
    const { id, data, onToggle, loader, childrenKey } = this.props

    onToggle()

    if (data[childrenKey] !== undefined) return

    this.setState({ fetching: true })
    loader(id, data)
  }

  renderNode() {
    const { id, active, data, renderItem, expanded } = this.props
    const render = typeof renderItem === 'function' ? renderItem : d => d[renderItem]
    return render(data, expanded, active, id)
  }

  renderIndicator() {
    const { data, expanded, expandIcons, loader, childrenKey } = this.props
    const children = data[childrenKey]
    const icon = expandIcons ? expandIcons[expanded + 0] : <span className={treeClass('default-icon')} />
    const indicator = (
      <a onClick={this.handleIndicatorClick} className={treeClass(`icon-${expanded ? 'sub' : 'plus'}`)}>
        {icon}
      </a>
    )

    if (children && children.length > 0) return indicator
    if (Array.isArray(children) || children === null) return null

    if (this.state.fetching && !children) return loading
    if (loader && !this.state.fetching) return indicator

    return null
  }

  render() {
    const { data, onToggle, onChange, expanded, draggable, onDragOver, onDrop, ...other } = this.props

    return (
      <div onDragOver={onDragOver}>
        {this.renderIndicator()}
        <div className={treeClass('content')}>
          {onChange && <Checkbox {...other} onChange={onChange} />}
          <div className={treeClass('text')} onClick={this.handleNodeClick}>
            {this.renderNode()}
          </div>
        </div>
      </div>
    )
  }
}

Content.propTypes = {
  active: PropTypes.bool,
  data: PropTypes.object,
  draggable: PropTypes.bool,
  expanded: PropTypes.bool,
  loader: PropTypes.func,
  id: PropTypes.any,
  onChange: PropTypes.func,
  onToggle: PropTypes.func,
  onDragOver: PropTypes.func,
  onDrop: PropTypes.func,
  onNodeClick: PropTypes.func,
  renderItem: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  parentClickExpand: PropTypes.bool,
  childrenKey: PropTypes.string,
  expandIcons: PropTypes.array,
}

export default Content
