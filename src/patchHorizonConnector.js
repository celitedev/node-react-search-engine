import {Connector} from 'horizon-react';

export default class PatchedHorizonConnector extends Connector {
  render() {
    return this.renderConnected();
  }
}
