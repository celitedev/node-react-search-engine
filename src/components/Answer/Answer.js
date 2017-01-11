import React from 'react';
import {map} from 'lodash';
import Card from '../Cards/Card.js';
import classnames from 'classnames';
import {pure, compose, mapProps} from 'recompose';

import {Link} from 'react-router';

const enhance = compose(
  mapProps(
    props => {
      const {answer, params, mainTab, subTab} = props;
      return {answer, params, mainTab, subTab};
    }
  ),
  pure
);

const thumbClick = (event) => {
  _.each(event.currentTarget.parentElement.children, (child) => {
    child.style.backgroundColor = '#F5F5F5';
    child.style.color = '#808080';
  });
  event.currentTarget.style.backgroundColor = 'white';
  event.currentTarget.style.color = '#1CD580';
};

const Answer = enhance(({answer, params, mainTab, subTab}) => (
  <main className='main-layout-content'>
    <div className='page-content'>
      <div className='l-answerPage'>
        {() => {
          const cardSettings = {
            identifiers1: answer.results.find((r) => r.formatted.identifiers1),
            identifiers2: answer.results.find((r) => r.formatted.identifiers2),
            headsup1: answer.results.find((r) => r.formatted.headsup1),
            headsup2: answer.results.find((r) => r.formatted.headsup2),
            databits1: answer.results.find((r) => r.formatted.databits1),
            databits2: answer.results.find((r) => {return (r.formatted.databits2 && r.formatted.databits2.length);}),
            whyshown: answer.results.find((r) => r.formatted.whyshown)
          };
          const showMap = !(answer.typeHuman === 'creative works' || answer.typeHuman === 'performers');

          return answer.results.length > 0 && (
              <div className={styles.paginationSection}>
                <div className={classnames(styles.paginationHeader)}>
                  <div className={classnames('related-answer-text', styles.topicHeader)}>
                    <Link dangerouslySetInnerHTML={{__html: answer.answerNLP}} to={`/search/${params.question}`} query={{ filter: JSON.stringify(answer.filterContext) }}/>
                  </div>
                  <div className={classnames(styles.resultType)}>
                    <div className={classnames(styles.collectionType)}></div>
                    {(showMap) && (
                      <Link onlyActiveOnIndex={false} to={`/search/${params.question}`} query={{ filter: JSON.stringify(answer.filterContext) }}>
                        <div className={classnames(styles.mapType)}></div>
                      </Link>
                    )}
                    {(!showMap) && (
                      <div className={classnames(styles.mapType)}></div>
                    )}
                  </div>
                </div>
                <div className={classnames(styles.root)}>
                  {map(answer.results, (result, index) => (
                    <div key={index} className={styles.cardPosition}>
                        <Card className={classnames('card m-card-imgRight', styles.sliderCard)} shareBtn={true} settings={cardSettings} data={result}/>
                    </div>
                    ))}
                </div>
              </div>
            );
        }()}
      </div>
    </div>
    <div className={classnames(styles.feedbackSection)}>
      <div className={classnames('related-answer-text', styles.topicHeader)}>
        {'How satisfied were you with these search results?'}
      </div>
      <div className={classnames(styles.thumbType)}>
        <div className={classnames(styles.thumbUp)} onClick={thumbClick}><i className={classnames(styles.thumbUp, 'fa fa-thumbs-o-up')}></i></div>
        <div className={classnames(styles.thumbDown)} onClick={thumbClick}><i className={classnames(styles.thumbDown, 'fa fa-thumbs-o-down')}></i></div>
      </div>
    </div>
  </main>
));

export default Answer;
