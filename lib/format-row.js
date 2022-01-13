'use strict';

const picocolors = require('picocolors');

const formats = {
  'time': 'time',
  'size': 'byte',
  'gzip': 'byte'
};

const styled = (asHTML, value, color, bootstrapClass) => {
  return asHTML ?
    { 'class': bootstrapClass, value } :
    picocolors[color](value);
};

const formatValue = (asHTML, result, key) => {
  const value = result.value.format(key, formats[key]);
  let valueStyled = value;

  if (result.compare[key].worst) {
    valueStyled = styled(asHTML, value, 'red', 'danger');
  }

  if (result.compare[key].best) {
    valueStyled = styled(asHTML, value, 'green', 'success');
  }

  return valueStyled;
};

const formatRow = (asHTML, result, gzip) => {
  if (!result.value.isValid()) {
    return styled(asHTML, result.value.label, 'red', 'danger');
  }

  if (typeof result === 'string') {
    return result;
  }

  let valueStyled;
  let formatted = asHTML ? {} : '';
  const sizeKey = gzip ? 'gzip' : 'size';
  valueStyled = formatValue(asHTML, result, sizeKey);

  if (asHTML) {
    formatted.size = valueStyled.value || valueStyled;
    formatted.sizeClass = valueStyled.class || 'secondary';
  } else {
    formatted = valueStyled;
  }

  valueStyled = formatValue(asHTML, result, 'time');

  if (asHTML) {
    formatted.time = valueStyled.value || valueStyled;
    formatted.timeClass = valueStyled.class || 'secondary';
  } else {
    formatted += ` - ${valueStyled}`;
  }

  return formatted;
};

module.exports = { formatRow };
