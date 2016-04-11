import React from 'react';
import PureComponent from 'react-pure-render/component';
import classnames from 'classnames';

function RadioItem({ onClick, selected, children }) {
  return (
    <div onClick={onClick} className={classnames(styles.item, selected && styles.selected)}>
      <div className={styles.icon}>
        {!!selected && <div className={styles.selectedIcon}/>}
      </div>
      {children}
    </div>
  );
}

export default class BetterRadioGroup extends PureComponent {

  render() {
    const { options, value, onChange } = this.props;

    return (
      <div className={styles.root}>
        {options.map((opt, index) =>
          <RadioItem key={index} onClick={() => onChange(opt.value)}
                     selected={value === opt.value}>
            {opt.label}
          </RadioItem>
        )}
      </div>
    );
  }
}
