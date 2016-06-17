import React from 'react';
import {map} from 'lodash';
import classnames from 'classnames';
import {pure, compose, mapProps} from 'recompose';

const encance = compose(
  mapProps(
    props => {
      const {answer} = props;
      return {answer};
    }
  ),
  pure
);

const AnswerWarning = encance(({answer}) => (
  <main>
    <div className='page-content'>
      <div className='l-answerPage'>
                <div className={classnames('related-answer-text', styles.topicHeader)}>
                  <ul>
                    <li dangerouslySetInnerHTML={{__html: answer}}/>
                  </ul>
                </div>
        </div>
    </div>
  </main>
));

export default AnswerWarning;
