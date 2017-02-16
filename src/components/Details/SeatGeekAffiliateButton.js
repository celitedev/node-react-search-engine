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
    const {name, startDate, root} = this.props.result;
    let seatGeekResult;
    if (root === 'Event') {
      seatGeekResult = await SeatGeekApi.findEvent(name, startDate);
    } else if (root === 'PlaceWithOpeninghours') {
      seatGeekResult = await SeatGeekApi.findVenue(name);
    } else if (root === 'OrganizationAndPerson') {
      seatGeekResult = await SeatGeekApi.findPerformer(name);
    }


    if (seatGeekResult) {
      this.setState({ loaded: true, url: seatGeekResult });
    } else {
      console.log('No SeatGeek Result Found');
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
        <a style={{cursor: 'pointer'}} onClick={this.onClick}>Get Tickets Now!</a>
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
