
import React from 'react';
import PureComponent from 'react-pure-render/component';
import ContentEditable from 'react-contenteditable';
import {connect} from 'redux-simple';
import { Link } from 'react-router';
import _ from 'lodash';
import classnames from 'classnames';

export default class Card extends PureComponent {
  constructor(props, context) {
    super();
  }

  render() {
    const {className, children, data, noImage} = this.props;
    const {formatted, raw} = data;
    return (
            <div className={className}>
                          <div className='js-cardAnchor'>
                            { !noImage
                              ? <div className={classnames('card--media showImageDetailClass showFallbackImageClass', styles.image)} style={{backgroundImage: `url(${raw.image[0]})`}}></div>
                              : null
                            }
                            <div className='card--inner'>
                              <div className='card--contents'>
                              <div className={classnames('card--category hideCategoryClass', styles.formatedNumber)}>
                                {formatted.number
                                  ? <span className={classnames('card--number hideNumberClass')}>{formatted.number}</span>
                                  : null
                                }
                                {formatted.category}
                              </div>
                               <div className='card--identifier'>
                                  <h2 className='card--identifier--title hideIdentifier1Class'><span>{formatted.identifiers1}</span></h2>
                                  <div className='card--identifier--subtitle hideIdentifier2Class'>{formatted.identifiers2.join(', ')}</div>
                                </div>
                                {formatted.headsup1 || formatted.headsup2
                                  ? <div className='card--headsup headsupAccentBackgroundClass hideHeadsupTotalClass'>
                                      {formatted.headsup1
                                        ? <div className='accent hideHeadsup1Class'>{formatted.headsup1}</div>
                                        : null
                                      } {formatted.headsup1
                                          ? <div className='hideHeadsup2Class'>{formatted.headsup2}</div>
                                          : null
                                      }
                                    </div>
                                  : null
                                }
                                {formatted.databits1
                                  ? <div className='card--databits hideDatabitsTotalClass'>
                                      <div className='hideDatabits1Class'>{formatted.databits1}</div>
                                      <ul className='hideDatabits2Class'>
                                        {_.map(formatted.databits2, (databit, index) => {
                                          return <li key={index}>{databit}</li>;
                                        })}
                                      </ul>
                                    </div>
                                  : null
                                }
                                <div className='card--whyshown hideWhyshownClass'>
                                  <div>{formatted.whyshown}</div>
                                </div>
                              </div>
                                  {children}
                            </div>
                        </div>

                        <div className='card--actions'>
                          <div className='js-overflowCheck'>
                            <button className='mdl-button mdl-button--colored'>Get Directions</button>
                            <button className='mdl-button mdl-button--colored'>Manage Reservation</button>
                           </div>
                        </div>
                      </div>
    );
  }
}
