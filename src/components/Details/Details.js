import React from 'react';
import PureComponent from 'react-pure-render/component';
import Card from '../Cards/Card';
import Map from '../Widgets/Map';
import CardsCarousel from '../Cards/CardsCarousel';

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
    const mapOptions = {
      scrollWheelZoom: false,
      zoomControl: false
    };
    return (
      <main className='mdl-layout__content'>
        <div className='page-content'>
          <div className='l-detailPage'>
            <div className='l-detailPage--cardContainer'>
              <Card ref='card' className='card card--detail m-card-imgTopWide  m-card-imgBackdrop  has-map no-link'
                    data={answer.result}>
                <Map className='card--mediaDetail card--mediaDetail-do-show' options={mapOptions} setView={setMapView}/>
              </Card>
            </div>

            <div className='mdl-tabs mdl-js-tabs mdl-js-ripple-effect'>
              <div className='mdl-tabs__tab-bar'>
                <a href='#overview' className='mdl-tabs__tab is-active'>Overview</a>
                <a href='#event' className='mdl-tabs__tab'>Event</a>
              </div>
              <div className='mdl-tabs__panel is-active' id='overview'>

                <strong>TODO: HOOK TO ACTUAL DATA</strong>

                <div className='subtitle without-margin'>Upcoming events</div>
                <ul className='events-list mdl-list'>
                  <li className='mdl-list__item'>
                    <div className='mdl-list__item-primary-content'>
                      <div className='title'>Bryan Cranston</div>
                      <div className='address'>some address</div>
                      <div className='price'>From <span>$79</span></div>
                    </div>
                  </li>
                  <li className='mdl-list__item'>
                    <div className='mdl-list__item-primary-content'>
                      <div className='title'>Bryan Cranston</div>
                      <div className='address'>some address</div>
                      <div className='price'>From <span>$79</span></div>
                    </div>
                  </li>
                  <li className='mdl-list__item'>
                    <div className='mdl-list__item-primary-content'>
                      <div className='title'>Bryan Cranston</div>
                      <div className='address'>some address</div>
                      <div className='price'>From <span>$79</span></div>
                    </div>
                  </li>
                </ul>
                <div className='show-all-button-wrapper'>
                  <a href='#event' className='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect'>
                    Show all events
                  </a>
                </div>

                <div className='mdl-grid'>
                  <div className='mdl-cell mdl-cell--4-col mdl-cell--6-col-phone'>
                    <div className='subtitle'>Hours open</div>
                    <div>
                      9:00 am - 9:00 pm
                    </div>
                  </div>
                  <div className='mdl-cell mdl-cell--4-col mdl-cell--6-col-phone'>
                    <div className='subtitle'>Phone</div>
                    <div>
                      +1 212-226-3126
                    </div>
                  </div>
                </div>
                <div className='mdl-grid'>
                  <div className='mdl-cell mdl-cell--12-col'>
                    <div className='subtitle'>
                      Details
                    </div>
                    <div>
                      Apple retail store some text some text some text some text some text some text some text some text
                      some text some text some text some text some text some text some text some text some text
                    </div>
                  </div>
                </div>
                <div className='mdl-grid'>
                  <div className='mdl-cell mdl-cell--12-col'>
                    <div className='subtitle'>
                      Images
                    </div>
                    <div>

                    </div>
                  </div>
                </div>
                <div className='subtitle'>
                  Related locations
                </div>
                <div className='relatedcards--container'>
                  <div className='relatedcards--hover'>&nbsp;</div>
                  <div id='js-carouselContainer' className='relatedcards'>
                    <CardsCarousel settings={carouselSettings} question={params.question} cardsStyle={styles.sliderCard}
                                   results={answer}/>
                  </div>
                </div>
              </div>
              <div className='mdl-tabs__panel' id='event'>
                <strong >TODO: HOOK TO ACTUAL DATA</strong>

                <div className='subtitle'>Upcoming events</div>
                <ul className='events-list mdl-list'>
                  <li className='mdl-list__item'>
                    <div className='mdl-list__item-primary-content'>
                      <div className='title'>Bryan Cranston</div>
                      <div className='address'>some address</div>
                      <div className='offer'>some offer</div>
                      <div className='price'>From <span>$79</span></div>
                    </div>
                  </li>
                  <li className='mdl-list__item'>
                    <div className='mdl-list__item-primary-content'>
                      <div className='title'>Bryan Cranston</div>
                      <div className='address'>some address</div>
                      <div className='offer'>some offer</div>
                      <div className='price'>From <span>$79</span></div>
                    </div>
                  </li>
                  <li className='mdl-list__item'>
                    <div className='mdl-list__item-primary-content'>
                      <div className='title'>Bryan Cranston</div>
                      <div className='address'>some address</div>
                      <div className='offer'>some offer</div>
                      <div className='price'>From <span>$79</span></div>
                    </div>
                  </li>
                  <li className='mdl-list__item'>
                    <div className='mdl-list__item-primary-content'>
                      <div className='title'>Bryan Cranston</div>
                      <div className='address'>some address</div>
                      <div className='offer'>some offer</div>
                      <div className='price'>From <span>$79</span></div>
                    </div>
                  </li>
                  <li className='mdl-list__item'>
                    <div className='mdl-list__item-primary-content'>
                      <div className='title'>Bryan Cranston</div>
                      <div className='address'>some address</div>
                      <div className='offer'>some offer</div>
                      <div className='price'>From <span>$79</span></div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
