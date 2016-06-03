import React from 'react';
import PureComponent from 'react-pure-render/component';
import Card from '../Cards/Card';
import Map from '../Widgets/Map';
import classnames from 'classnames';
import CardsCarousel from '../Cards/CardsCarousel';

import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

export default class Details extends PureComponent {

  render() {
    const {answer, params} = this.props;
    const {geo} = answer.result.raw;
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

    const style = {
      root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
      },
      gridList: {
        width: 500,
        height: 500,
        overflowY: 'auto',
        marginBottom: 24,
      },
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
            <div style={style.root}>
              <GridList
                cellHeight={200}
                style={style.gridList}
              >
                <Subheader>December</Subheader>
                  <GridTile
                    key={1}
                    title='sdsdsds'
                    subtitle={<span>by <b>dsdsdsdssds</b></span>}
                    actionIcon={<IconButton><StarBorder color='white' /></IconButton>}
                  >
                    <img src='https://www.google.pl/imgres?imgurl=https%3A%2F%2Fpbs.twimg.com%2Fprofile_images%2F638751551457103872%2FKN-NzuRl.png&imgrefurl=https%3A%2F%2Ftwitter.com%2Fgoogle&docid=dh3x9yWZ_LBfwM&tbnid=d17bslxLqp9bOM%3A&w=512&h=512&bih=962&biw=1920&ved=0ahUKEwjUm5z3p4zNAhUC_SwKHSXzBs8QMwgyKAEwAQ&iact=mrc&uact=8' />
                  </GridTile>
                ))}
              </GridList>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
