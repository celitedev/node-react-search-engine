import React from 'react';
import PureComponent from 'react-pure-render/component';

export default class Footer extends PureComponent {

  render() {
    const currentYear = new Date().getFullYear();
    return (
      <div>
        <div>Copyright &copy; {currentYear}</div>
      </div>
    );
  }

}
