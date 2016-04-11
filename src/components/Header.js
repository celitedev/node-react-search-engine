import React from 'react';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import AppBar from 'material-ui/lib/app-bar';
import Avatar from 'material-ui/lib/avatar';
import FontIcon from 'material-ui/lib/font-icon';

export default class Header extends PureComponent {

  render() {
    return (
        <AppBar title='Title'
            iconElementLeft={
            <Avatar icon={<FontIcon className='muidocs-icon-communication-voicemail' />} />
          }iconElementRight={
            <Avatar icon={<FontIcon className='muidocs-icon-communication-voicemail' />} />
          }
        />
    );
  }

}
