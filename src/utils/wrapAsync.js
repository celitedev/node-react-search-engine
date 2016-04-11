/**
 * update component state according to given promise
 *
 * @example
 * this::wrapAsync(this.props.someAction());
 *
 * @param {Promise.<T>} promise
 * @param {{loading: string, error: string}=} options
 * @returns {Promise.<T>}
 * @template T
 */
export default async function wrapAsync(promise, options) {
  const loading = options && options.loading || 'loading';
  const error = options && options.error || 'error';
  try {
    this.setState({
      [loading]: true,
      [error]: null
    });
    return (await promise);
  } catch (err) {
    this.setState({
      [error]: err
    });
  } finally {
    this.setState({
      [loading]: false
    });
  }
}
