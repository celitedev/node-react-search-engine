import React from 'react';
import PureComponent from 'react-pure-render/component';
import classnames from 'classnames';

import CheckIcon from '../../icons/check-sm.svg';

function Checkbox({ value }) {
  if (value) {
    return (
      <div className={styles.checkedIcon}>
        <CheckIcon className={styles.checkIcon}/>
      </div>
    );
  }
  return <div className={styles.emptyIcon}/>;
}

function CheckboxLabel({ children }) {
  return (
    <div className={styles.label}>
      {children}
    </div>
  );
}

export default class BetterCheckbox extends PureComponent {

  render() {
    const { value, onChange, label, rounded, autoHeight, className } = this.props;
    return (
      <div className={classnames(styles.root, rounded && styles.rounded, autoHeight && styles.autoHeight, className)}
           onClick={() => onChange(!value)}>
        <Checkbox value={value}/>
        {label &&
        <CheckboxLabel>{label}</CheckboxLabel>
        }
      </div>
    );
  }

}
