import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import shallowEqual from '../utils/shallowEqual'
import DatumForm from '../Datum/Form'
import { Provider } from './formContext'

class Block extends PureComponent {
  constructor(props) {
    super(props)
    const { value, error, formDatum } = props

    this.datum = new DatumForm({
      onChange: this.handleChange.bind(this),
      error,
    })

    if (value) this.datum.setValue(value)

    this.reset = this.reset.bind(this)
    this.validate = this.validate.bind(this)

    if (formDatum) {
      formDatum.subscribe('reset', this.reset)
      formDatum.subscribe('validate', this.validate)
    }
  }

  componentDidUpdate(prevProps) {
    const { value, error } = this.props
    if (!shallowEqual(value, this.prevValues)) {
      this.datum.setValue(value)
      this.prevValues = value
    }
    if (error !== prevProps.error) {
      this.datum.setError(error)
    }
  }

  componentWillUnmount() {
    const { formDatum } = this.props
    if (formDatum) {
      formDatum.unsubscribe('reset', this.reset)
      formDatum.unsubscribe('validate', this.validate)
    }
  }

  handleChange(value) {
    this.props.onChange(value)
  }

  reset() {
    // wait cDU setValue completed
    setTimeout(() => {
      this.datum.validateClear()
    })
  }

  validate() {
    // return this.datum.validate().then(e => e, e => e)
    return this.datum.validate()
  }

  render() {
    const {
      children, labelAlign, labelWidth, rules,
    } = this.props

    if (rules && this.datum.rules !== rules) {
      this.datum.rules = Array.isArray(rules) ? {} : rules
    }

    return (
      <Provider value={{ formDatum: this.datum, labelWidth, labelAlign }}>
        {children}
      </Provider>
    )
  }
}

Block.propTypes = {
  children: PropTypes.any,
  error: PropTypes.object,
  formDatum: PropTypes.object,
  labelAlign: PropTypes.string,
  labelWidth: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func.isRequired,
  rules: PropTypes.array,
  value: PropTypes.any,
}

export default Block
