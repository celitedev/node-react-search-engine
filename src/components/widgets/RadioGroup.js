import React from 'react';
import ReactDOM from 'react-dom';

export default class RadioGroup extends React.Component {

  static propTypes = {
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.any,
    onChange: React.PropTypes.func
  };

  render() {
    const { children, ...props } = this.props;
    return (
      <div {...props}>
        {children}
      </div>
    );
  }

  componentDidUpdate() {
    this.setCheckedRadio();
  }

  componentDidMount() {
    const { name } = this.props;
    this.forEachRadio((radio) => {
      radio.onchange = this.handleChange.bind(this);
      radio.setAttribute('name', name);
    });

    this.setCheckedRadio();
  }

  setCheckedRadio() {
    const { value } = this.props;
    this.someRadio((radio) => {
      if (value !== null && radio.value.toString() === value.toString()) {
        radio.checked = true;
        return true;
      }
    });
  }

  someRadio(fn) {
    const radios = this.getRadios();

    return [].some.call(radios, fn, this);
  }

  forEachRadio(fn) {
    const radios = this.getRadios();

    return [].forEach.call(radios, fn, this);
  }

  getRadios() {
    return ReactDOM.findDOMNode(this).querySelectorAll('input[type="radio"]');
  }

  handleChange(event) {
    if (this.props.onChange) {
      this.props.onChange(event.target.value, event);
    }
  }
}
