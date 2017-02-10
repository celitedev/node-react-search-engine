import React, {Component, PropTypes} from 'react';
import {pure} from 'recompose';
import _ from 'lodash';
import SeatGeekApi from '../../utils/seatGeekApi';
@pure
class SeatGeekAffiliateButton extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      loaded: false,
      url: null
    };

    this.onClick = this.onClick.bind(this);
  }

  componentWillMount() {
    const seatGeekResult = this.isSeatGeek();
    if (seatGeekResult) {
      this.setState({ loaded: true, url: seatGeekResult.url });
    } else {
      this.loadFromApi();
    }
  }

  async loadFromApi() {
    const {name, startDate} = this.props.result;
    const result = await SeatGeekApi.findByTitleAndDate(name, startDate);
    if (result) {
      this.setState({ loaded: true, url: result });
    } else {
      console.log('No SeatGeek Event Found');
    }
  }

  isSeatGeek() {
    const {sources} = this.props.result;
    return _.find(sources, { name: 'Seatgeek'});
  }

  onClick() {
    const { onClickCallback, result } = this.props;
    const seatGeekResult = this.isSeatGeek();
    let linkData;
    if (seatGeekResult) {
      linkData = seatGeekResult;
      linkData.url = SeatGeekApi.addAffiliateCode(linkData.url);
    } else {
      const { url } = this.state;
      linkData = {
        url: url,
        name: result.name
      };
    }
    onClickCallback(linkData);
  }

  render() {
    return (
      <div>
      {(this.state.loaded) && (
        <a onClick={this.onClick}>Get Tickets Now!</a>
      )}
      </div>
    );
  }
}

SeatGeekAffiliateButton.propTypes = {
  result: PropTypes.object.isRequired,
  onClickCallback: PropTypes.func.isRequired
};

export default SeatGeekAffiliateButton;
