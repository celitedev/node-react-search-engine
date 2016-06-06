import React from 'react';
import PureComponent from 'react-pure-render/component';
import Card from '../Cards/Card';
import Map from '../Widgets/Map';
import classnames from 'classnames';
import CardsCarousel from '../Cards/CardsCarousel';
import {Link} from 'react-router';

import {GridList, GridTile} from 'material-ui/GridList';
import {List, ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

export default class Details extends PureComponent {

  render() {
    const {answer, params} = this.props;
    const {raw} = answer.result;
    const {geo} = raw;
    let setMapView = [];
    if (geo) {
      const {latitude, longitude} = answer.result.raw.geo;
      setMapView = [
        latitude,
        longitude
      ];
    }
    const carouselSettings = {
      responsive: [{
        breakpoint: 4000,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }, {
          breakpoint: 1600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          },
          className: 'class'
        }, {
          breakpoint: 1200,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        }, {
          breakpoint: 800,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }]
    };

    const mapOptions = {
      scrollWheelZoom: false,
      zoomControl: false
    };
    return (
      <main className='mdl-layout__content'>
        <div className='page-content'>
          <div className='l-detailPage'>
            <div className='l-detailPage--cardContainer'>
              <Card ref='card' className={classnames('card has-map no-link', styles.detailsCard)}
                    data={answer.result}>
                <Map className='card--mediaDetail card--mediaDetail-do-show' options={mapOptions} setView={setMapView}/>
              </Card>
            </div>
            <div className={styles.sectionStyle}>
            {raw.image.length && (
              <div>
                <h4 className={styles.sectionName}>Images</h4>
                <hr/>
                <div className={styles.grid}>
                <GridList
                cellHeight={200}
                cols={3}
                className={styles.gridList}
                >
                {raw.image.map((img, index) => {
                  return (
                    <GridTile
                      key={index}
                      className={styles.gridTile}
                      >
                      <img src={img} />
                    </GridTile>);
                  })}
                  </GridList>
                  </div>
              </div>
            )}
              <div className={styles.sectionStyle}>
              <h4 className={styles.sectionName}>External Sources</h4>
              <hr/>
              <List>
                {raw.sources.map((src, index) => {
                  return <a href={`${src.url}`}><ListItem key={index} primaryText={`${src.name} - ${src.url}`}/></a>;
                })}
              </List>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
