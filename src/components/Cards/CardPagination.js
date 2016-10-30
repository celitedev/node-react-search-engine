import React from 'react';
import PureComponent from 'react-pure-render/component';
import {connect} from 'redux-simple';
import {Link} from 'react-router';
import classnames from 'classnames';
import Card from './Card';
import {map} from 'lodash';
import {redirect} from '../../actions';
import RaisedButton from 'material-ui/RaisedButton';

const debug = require('debug')('app:CardsCarousel');

if (!process.env.SERVER_RENDERING) {
  require('../../../modernizr');
}

@connect(null, {redirect})
export default class CardPagination extends PureComponent {
  constructor(props, context) {
    super(props, context);
  }

  beforeChange(e) {
    debug('beforeChange: ', e);
  }

  render() {
    const {settings, sliderStyle, cardsStyle, results, question, showAll, filterContext, miniMap, afterChange, answer} = this.props;
    const f = JSON.stringify(filterContext);
    const cardSettings = {
      identifiers1: results.find((r) => r.formatted.identifiers1),
      identifiers2: results.find((r) => r.formatted.identifiers2),
      headsup1: results.find((r) => r.formatted.headsup1),
      headsup2: results.find((r) => r.formatted.headsup2),
      databits1: results.find((r) => r.formatted.databits1),
      databits2: results.find((r) => {return (r.formatted.databits2 && r.formatted.databits2.length);}),
      whyshown: results.find((r) => r.formatted.whyshown)
    };
    return (
        <div className={classnames(styles.root)}>
          {map(results, (result, index) => (
            <div key={index} className={styles.cardPosition}>
                <Card className={classnames('card m-card-imgRight', cardsStyle)} shareBtn={true} settings={cardSettings} data={result}/>
            </div>
            ))}
        </div>
    );
  }
}
