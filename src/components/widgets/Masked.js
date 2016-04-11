import React from 'react';
import PureComponent from 'react-pure-render/component';
import MaskedInput from 'react-maskedinput';

export default class Masked extends PureComponent {

  render() {
    const { onChange, ...props } = this.props;
    return <MaskedInput onChange={e => onChange(e.target.value)} {...props} />;
  }

}
