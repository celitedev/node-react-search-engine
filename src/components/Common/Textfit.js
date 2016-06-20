import React, {PropTypes, Component, createElement} from 'react';
import {findDOMNode} from 'react-dom';
import autobind from 'autobind-decorator';
import {pure} from 'recompose';
import {throttle} from 'lodash';

const debug = require('debug')('app:components:Common:Textfit');

@pure
export default class Textfit extends Component {

  constructor(props, defaultProps) {
    super(props, defaultProps);
    this.state = {
      fontSize: props.max,
      ready: false
    };
  }

  static defaultProps = {
    component: 'div',
    min: 1,
    max: 100,
    throttle: 50,
    autoResize: true
  };

  static propTypes = {
    children: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    throttle: PropTypes.number
  };

  componentWillMount() {
    this.handleWindowResize = throttle(this.handleWindowResize, this.props.throttle);
  }

  componentDidMount() {
    const {autoResize} = this.props;
    if (autoResize) {
      window.addEventListener('resize', this.handleWindowResize);
    }

    setTimeout(() => {
      this.process();
    }, this.props.throttle);
  }

  componentDidUpdate(prevProps) {
    const {ready} = this.state;
    if (!ready) return;
    this.process();
  }

  componentWillUnmount() {
    const {autoResize} = this.props;
    if (autoResize) {
      window.removeEventListener('resize', this.handleWindowResize);
    }
  }

  @autobind
  handleWindowResize() {
    this.process();
  }

  process() {
    this.setState({ready: false});

    this.checkHeight();
  }

  getContainerHeight() {
    const el = findDOMNode(this);
    const originalHeight = el.clientHeight;
    if (originalHeight <= 0 || isNaN(originalHeight)) {
      return null;
    }

    return originalHeight;
  }

  checkHeight() {
    const originalHeight = this.getContainerHeight();

    if (!originalHeight) {
      return;
    }

    const {fontSize} = this.state;
    const {min, normalHeight} = this.props;

    if (originalHeight > normalHeight && fontSize > min) {
      this.setState({fontSize: fontSize - 1});
      this.checkHeight();
    }
  }

  render() {
    const {children, component, ...restProps} = this.props;
    const {fontSize} = this.state;
    const newProps = {
      style: {
        fontSize: fontSize,
        lineHeight: 'normal'
      },
      ...restProps
    };

    return createElement(component, newProps, children);
  }
}
