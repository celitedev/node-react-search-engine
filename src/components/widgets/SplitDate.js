import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import moment from 'moment';
import _ from 'lodash';
import classnames from 'classnames';

import Selectize from './Selectize';

const FORMAT = 'MM.YYYY';

export default class SplitDate extends PureComponent {

  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    onChange: PropTypes.func,
    minYear: PropTypes.number.isRequired,
    maxYear: PropTypes.number.isRequired
  };

  hasFullValue() {
    const { value } = this.props;
    return _.isString(value);
  }

  getPartialValue() {
    const { value } = this.props;
    if (_.isString(value)) {
      const date = moment(value, FORMAT);
      return {
        year: date.format('YYYY'),
        month: date.format('MM')
      };
    }
    return value || {};
  }

  setValue(pos, val) {
    const { onChange } = this.props;
    if (!onChange) {
      return;
    }
    const value = this.getPartialValue();
    const newValue = _.pick({
      ...value,
      [pos]: val
    }, _.identity);
    if (!_.isEmpty(newValue.year) && !_.isEmpty(newValue.month)) {
      const date = moment(`${newValue.year}-${newValue.month}-01`);
      onChange(date.format(FORMAT));
    } else {
      onChange(_.isEmpty(newValue) ? null : newValue);
    }
  }

  setYear(year) {
    this.setValue('year', year);
  }

  setMonth(month) {
    this.setValue('month', month);
  }

  render() {
    const { value, minYear, maxYear, className, errorClass } = this.props;
    let year = '';
    let month = '';
    if (_.isString(value)) {
      const date = moment(value, FORMAT);
      year = date.format('YYYY');
      month = date.format('MM');
    } else if (value) {
      year = value.year || '';
      month = value.month || '';
    }
    const years = _(_.range(minYear, maxYear + 1).map(x => x.toString())).reverse().value();
    const months = _.range(1, 13).map(x => x < 10 ? `0${x}` : x.toString());
    const hasError = className && errorClass && className.indexOf(errorClass) !== -1;
    return (
      <div className={styles.root}>
        <Selectize plain className={classnames(styles.month, hasError && Selectize.errorClass)}
                   onChange={::this.setMonth} options={months} value={month} placeholder='MM'/>
        <Selectize plain className={classnames(styles.year, hasError && Selectize.errorClass)}
                   onChange={::this.setYear} options={years} value={year} placeholder='YYYY'/>
      </div>
    );
  }

}
