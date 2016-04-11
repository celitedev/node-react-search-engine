import React from 'react';
import PureComponent from 'react-pure-render/component';
import _ from 'lodash';
import classnames from 'classnames';
import { SimpleSelect } from 'react-selectize';
import 'react-selectize/src/index.css';

import selectizeStyles from './Selectize.scss';
import api from '../../api';

function filterOptions(options, search) {
  return options.filter(option => _.any([option.label].concat(option.aliases || []),
    label => label.toLowerCase().indexOf(search.toLowerCase().trim()) !== -1));
}

export default class Suggest extends PureComponent {

  static propTypes = {
    model: React.PropTypes.string.isRequired
  };

  static defaultProps = {
    labelKey: 'name',
    valueKey: 'id'
  };

  state = {
    query: '',
    options: []
  };

  constructor(props, context) {
    super(props, context);
    this.searchCache = {};
  }

  componentWillUnmount() {
    this.isUnmounting = true;
  }

  onSearchChange(dirtyQuery, callback) {
    const { model } = this.props;
    const query = _.trimLeft(dirtyQuery);
    this.setState({ query }, callback);
    if (_.isEmpty(query)) {
      return;
    }

    const cacheKey = `${model}-${query}`;
    if (this.searchCache[cacheKey]) {
      this.setState({
        options: this.searchCache[cacheKey]
      });
    } else {
      const promise = api.get('/suggestions/', { model, query }).then(res => {
        const options = res.objects.map(item => ({
          value: item.pk, label: item.suggest, aliases: item.aliases
        }));
        this.searchCache[cacheKey] = options;
        if (promise === this.searchPromise && !this.isUnmounting) {
          this.setState({
            options
          });
        }
      });

      this.searchPromise = promise;
    }
  }

  render() {
    const { onChange, value, labelKey, valueKey, className, searchHint, ...restProps } = this.props;
    const { query, options } = this.state;

    const onValueChange = (option, callback) => {
      let val = null;
      if (option) {
        val = {
          [valueKey]: option.value,
          [labelKey]: option.label
        };
      }
      onChange(val);
      callback();
    };

    let selectValue = null;
    if (value) {
      selectValue = {
        label: value[labelKey],
        value: value[valueKey]
      };
    }

    const renderNoResultsFound = () => (
      <div className='no-results-found'>
        {(_.isEmpty(query) && searchHint) ? searchHint : this.props.emptyResults || 'No results found'}
      </div>
    );

    return (
      <div className={classnames(selectizeStyles.root, className)}>
        <SimpleSelect
          value={selectValue}
          onSearchChange={this.onSearchChange.bind(this)}
          onValueChange={onValueChange}
          search={query}
          options={options}
          filterOptions={filterOptions}
          renderNoResultsFound={renderNoResultsFound}
          {...restProps}
        />
      </div>
    );
  }

}
