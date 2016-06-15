import React, {Component} from 'react';
import {pure} from 'recompose';

const Footer = pure(() => (
  <div className={styles.textMuted}>
    Copyright 2016 Kwhen Inc.
  </div>
));

export default Footer;
