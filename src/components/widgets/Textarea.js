import React from 'react';
import PureComponent from 'react-pure-render/component';
import TextareaAutosize from 'react-textarea-autosize';
import classnames from 'classnames';

export default class Textarea extends PureComponent {

  render() {
    const { onChange, className, ...props } = this.props;
    return (
      <TextareaAutosize className={classnames(styles.root, className)}
                        onChange={e => onChange(e.target.value)} {...props} />
    );
  }

}
