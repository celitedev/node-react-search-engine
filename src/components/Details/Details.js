import React, {Component} from 'react';
import {pure} from 'recompose';
import Card from '../Cards/Card';
import Map from '../Widgets/Map';
import classnames from 'classnames';
import {GridList, GridTile} from 'material-ui/GridList';
import Footer from '../Footer/Footer.js';

@pure
export default class Details extends Component {

  render() {
    const {answer} = this.props;
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

    const cardSettings = {
      identifiers1: answer.result.formatted.identifiers1,
      identifiers2: answer.result.formatted.identifiers2,
      headsup1: answer.result.formatted.headsup1,
      headsup2: answer.result.formatted.headsup2,
      databits1: answer.result.formatted.databits1,
      databits2: answer.result.formatted.databits2 && answer.result.formatted.databits2.length,
      whyshown: answer.result.formatted.whyshown
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
                    data={answer.result} shareBtn={true} settings={cardSettings}>
                {geo && (
                  <Map className='card--mediaDetail card--mediaDetail-do-show' options={mapOptions} setView={setMapView}/>
                )}
              </Card>
            </div>
            <div className={styles.sectionStyle}>
            {(raw.image && raw.image.length) && (
              <div>
                <h4 className={styles.sectionName}>Images</h4>
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
              <div>
              <h4 className={styles.sectionName}>External Sources</h4>
                <ul className={styles.sourcesList}>
                  {raw.sources.map((src, index) => {
                    return <li key={index}><a href={`${src.url}`}>{src.name}</a></li>;
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }
}
