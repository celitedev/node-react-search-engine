import React from 'react';
import PureComponent from 'react-pure-render/component';
import classnames from 'classnames';
import _ from 'lodash';
import { SimpleSelect } from 'react-selectize';
import 'react-selectize/src/index.css';

class SelectizePlain extends PureComponent {
  render() {
    const { onChange, options, value, className, ...restProps } = this.props;
    const selectOptions = options.map(opt => ({ label: opt.toString(), value: opt }));
    const selectValue = value ? { label: value.toString(), value } : null;
    const onValueChange = (option, callback) => {
      const val = option ? option.value : null;
      onChange(val);
      callback();
    };

    return (
      <div className={classnames(styles.root, className)}>
        <SimpleSelect options={selectOptions} onValueChange={onValueChange}
                      value={selectValue} {...restProps} />
      </div>
    );
  }
}

export default class Selectize extends PureComponent {

  static errorClass = styles.hasError;

  static defaultProps = {
    valueKey: 'value',
    labelKey: 'label',
    plainValue: false
  };

  render() {
    const { plain, ...props } = this.props;
    if (plain) {
      return <SelectizePlain {...props} />;
    }

    const { onChange, options, value, labelKey, valueKey, className, plainValue, ...restProps } = props;

    let selectOptions = options;
    if (valueKey !== 'value' || labelKey !== 'label') {
      selectOptions = options.map(opt => ({
        label: opt[labelKey],
        value: opt[valueKey]
      }));
    }

    const onValueChange = (option, callback) => {
      let val = null;
      if (option) {
        if (plainValue) {
          val = option.value;
        } else {
          val = {
            [valueKey]: option.value,
            [labelKey]: option.label
          };
        }
      }
      onChange(val);
      callback();
    };

    let selectValue = null;
    if (value) {
      if (plainValue) {
        selectValue = _.find(options, opt => opt.value === value);
      } else {
        selectValue = {
          label: value[labelKey],
          value: value[valueKey]
        };
      }
    }

    return (
      <div className={classnames(styles.root, className)}>
        <SimpleSelect options={selectOptions} onValueChange={onValueChange}
                      value={selectValue} {...restProps} />
      </div>
    );
  }

}
