import React from 'react';
import {find} from 'lodash';
import {Link} from 'react-router';
import {pure, compose, mapProps} from 'recompose';
import {tiles} from '../componentsConfig/tiles';

const enhance = compose(
  mapProps(
    props => {
      const {items} = props;
      return {items};
    }
  ),
  pure
);

const Tiles = enhance(({items}) => (
    <ul>
      {items.map((el, index) => (
        <li key={index} className='quicklaunch--item'>
          <Link onlyActiveOnIndex={false} to={`answer/${el.question}`}>
            <div className={find(tiles, ['name', el.question]).tileClass}>
              <p>{find(tiles, ['name', el.question]).title}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
));

export default Tiles;
