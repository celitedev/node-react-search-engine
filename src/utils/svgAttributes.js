import SVGDOMPropertyConfig from 'react/lib/SVGDOMPropertyConfig';
import _ from 'lodash';

export const reactAttributesMap = {};
Object.keys(SVGDOMPropertyConfig.Properties).forEach(key => {
  reactAttributesMap[key] = key;
});
Object.keys(SVGDOMPropertyConfig.DOMAttributeNames).forEach(key => {
  reactAttributesMap[key] = SVGDOMPropertyConfig.DOMAttributeNames[key];
});

export const svgAttributesMap = _.invert(reactAttributesMap);
