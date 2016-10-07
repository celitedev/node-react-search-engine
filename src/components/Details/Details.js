import React, {Component} from 'react';
import {pure} from 'recompose';
import PureComponent from 'react-pure-render/component';
import Card from '../Cards/Card';
import Slider from 'react-slick';
import Map from '../Widgets/Map';
import classnames from 'classnames';
import {GridList, GridTile} from 'material-ui/GridList';
import {Card as DefaultCard, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Footer from '../Footer/Footer.js';

class NextArrow extends PureComponent {
  render() {
    const aProps = Object.assign({}, this.props);
    const {onClick, show} = aProps;

    return (
      true && (
        <a href='#' {...aProps}
           className={classnames('js-rowcontrol js-rowcontrol-next fa fa-angle-right', styles.arrows, styles.rightArrowsStyle)}>&gt;</a>
      ) || null
    );
  }
}

class PrevArrow extends PureComponent {
  render() {
    const aProps = Object.assign({}, this.props);
    const {onClick, show} = aProps;

    return (
      true && (
        <a href='#' {...aProps}
         className={classnames('js-rowcontrol js-rowcontrol-prev fa fa-angle-left', styles.arrows, styles.leftArrowsStyle)}>&lt;</a>
       ) || null
    );
  }
}

class SNextArrow extends PureComponent {
  render() {
    const aProps = Object.assign({}, this.props);
    const {onClick, show} = aProps;

    return (
      true && (
        <a href='#' {...aProps}
           className={classnames('js-rowcontrol js-rowcontrol-next fa fa-angle-right', styles.arrows, styles.sRightArrowsStyle)}>&gt;</a>
      ) || null
    );
  }
}

class SPrevArrow extends PureComponent {
  render() {
    const aProps = Object.assign({}, this.props);
    const {onClick, show} = aProps;

    return (
      true && (
        <a href='#' {...aProps}
         className={classnames('js-rowcontrol js-rowcontrol-prev fa fa-angle-left', styles.arrows, styles.sLeftArrowsStyle)}>&lt;</a>
       ) || null
    );
  }
}

@pure
export default class Details extends Component {

  render() {
    const {answer} = this.props;
    const {raw, formatted} = answer.result;
    const suggestions = answer.suggestions;
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
      type: 'detail-card',
      geo: geo,
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

    const sliderSettings = {
      dots: false,
      infinite: false,
      speed: 500,
      variableWidth: true,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      // responsive: [{
      //   breakpoint: 1024,
      //   settings: {
      //     dots: false,
      //     infinite: true,
      //     slidesToShow: 3,
      //     slidesToScroll: 1
      //   }
      // },
      // {
      //   breakpoint: 600,
      //   settings: {
      //     dots: false,
      //     infinite: true,
      //     slidesToShow: 3,
      //     slidesToScroll: 1
      //   }
      // },
      // {
      //   breakpoint: 480,
      //   settings: {
      //     dots: false,
      //     infinite: true,
      //     slidesToShow: 3,
      //     slidesToScroll: 1
      //   }
      // }]
    };

    return (
      <main className='mdl-layout__content'>
        <div className='page-content'>
          <div className='l-detailPage'>
            <div className='l-detailPage--cardContainer'>
              <Card ref='card' className={classnames('card m-card-imgRight has-map no-link', styles.detailsCard)}
                    data={answer.result} shareBtn={true} settings={cardSettings}>
                {geo && (
                  <Map className='card--mediaDetail card--mediaDetail-do-show' options={mapOptions} setView={setMapView}/>
                )}
              </Card>
            </div>
            <div className={styles.sectionStyle}>
              <div className={styles.innerSection}>
                <DefaultCard>
                  <CardHeader
                    title='Learn More'
                    titleColor='white'
                    titleStyle={{'fontSize': '20px'}}
                    actAsExpander={false}
                    showExpandableButton={false}
                    style={{'padding-left': '27px', background: '#08bb6e', 'border-top-left-radius': '4px', 'border-top-right-radius': '4px'}}
                  />
                  <CardText style={{'padding-top': '24px'}}>
                    <ul className={styles.sourcesList}>
                      {raw.sources.map((src, index) => {
                        return <li key={index}><a href={`${src.url}`}><img src={this.getExternalImage(src.name)} /></a></li>;
                      })}
                    </ul>
                  </CardText>
                </DefaultCard>
              </div>
              {(raw.image && raw.image.length > 1) && (
                <div className={styles.innerSection}>
                  <DefaultCard style={{'border-top': '5px solid #08bb6e', 'border-top-left-radius': '4px', 'border-top-right-radius': '4px'}}>
                    <Slider {...sliderSettings} className={classnames(styles.sliderStyle)}>
                      {raw.image.map((img, index) => {
                        return (
                            <img src={img} className={styles.imgStyle} />
                          );
                        })}
                    </Slider>
                    <CardText style={{'border-top': '1px solid #F1F1F1', color: '#919191'}}>
                      1 of {raw.image.length} images
                    </CardText>
                  </DefaultCard>
                </div>
              )}
              {(formatted.details) && (formatted.details.map((detail, index) => {
                return (
                  <div style={{'display': 'flex'}}>
                    <img src={require('../../images/logo-icon.png')} className={classnames(styles.logoStyle)} />
                    <div className={classnames(styles.detailContent)}>
                      <img src={require('../../images/arrow-left.png')}/>
                      <DefaultCard style={{'flex': '1'}} initiallyExpanded={true}>
                        <CardHeader
                          title={detail.title}
                          titleColor='white'
                          titleStyle={{'fontSize': '20px'}}
                          actAsExpander={true}
                          showExpandableButton={true}
                          style={{'padding-left': '27px', background: '#08bb6e', 'border-top-left-radius': '4px', 'border-top-right-radius': '4px'}}
                        />
                        <CardText style={{'padding-top': '24px', 'font-size': '16px'}} color='#525252' expandable={true}>
                          {detail.detail}
                        </CardText>
                      </DefaultCard>
                    </div>
                  </div>
                );
              }))}
            </div>

            <div>
              {suggestions.map((data, index) => {
                const {title, result} = data;
                const suggestionCardSettings = {
                  identifiers1: result.find((r) => r.formatted.identifiers1),
                  identifiers2: result.find((r) => r.formatted.identifiers2),
                  headsup1: result.find((r) => r.formatted.headsup1),
                  headsup2: result.find((r) => r.formatted.headsup2),
                  databits1: result.find((r) => r.formatted.databits1),
                  databits2: result.find((r) => {return (r.formatted.databits2 && r.formatted.databits2.length);}),
                  whyshown: result.find((r) => r.formatted.whyshown)
                };

                const suggestionSliderSettings = {
                  dots: false,
                  infinite: false,
                  speed: 500,
                  variableWidth: true,
                  nextArrow: <SNextArrow />,
                  prevArrow: <SPrevArrow />
                };
                return (
                  <div className={styles.innerSection}>
                    <h4 style={{'color': '#00cd75', 'margin-left': '10px'}}>{title}</h4>
                    <Slider {...suggestionSliderSettings} className={classnames(styles.sliderStyle)}>
                      {result.map((result, index) => {
                        return (
                          <div key={index} className={classnames(styles.sliderPosition)}>
                              <Card className={classnames('card m-card-imgRight')} shareBtn={true} settings={suggestionCardSettings} data={result}/>
                          </div>
                        );
                      })}
                    </Slider>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  getExternalImage(source) {
    switch (source) {
      case 'Evenbrite':
        return require('../../images/evenbrite.png');
      case 'Eventful':
        return require('../../images/eventful.png');
      case 'Wikipedia':
        return require('../../images/eventful.png');
      case 'Seatgeek':
        return require('../../images/eventful.png');
      case 'Fandango':
        return require('../../images/eventful.png');
      case 'Coursehorse':
        return require('../../images/coursehorse.png');
      case 'NYC':
        return require('../../images/nyc.jpeg');
      case '1iota':
        return require('../../images/1iota.jpg');
      default:
        return require('../../images/eventful.png');
    }
  }
}
