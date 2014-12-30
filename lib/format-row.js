var formats = {
  'time': 'time',
  'size': 'byte',
  'gzip': 'byte'
};

var styled = function(asHTML, value, color, bootstrapClass) {
  return asHTML ?
    { 'class': bootstrapClass, value: value } :
    value[color];
};

var formatValue = function (asHTML, result, key) {
  var value = result.value.format(key, formats[key]);
  var valueStyled = value;

  if (result.compare[key].worst)
    valueStyled = styled(asHTML, value, 'red', 'danger');
  if (result.compare[key].best)
    valueStyled = styled(asHTML, value, 'green', 'success');
  if (asHTML) {
    if (typeof valueStyled == 'string')
      valueStyled = {value: valueStyled};
    valueStyled.differential = result.compare[key].differential;
    if (formats[key] === 'byte') {
      valueStyled.value += ' (' + Math.round(result.value[key] / result.value['original-' + key] * 100) + '%)';
    }
  }

  return valueStyled;
};

var formatPercentages = function (value) {
  if (isNaN(value))
    return '';

  if (value === 0)
    return {
      value: 'baseline',
      valueClass: 'success'
    };

  var sign = value > 0 ? '+' : '-';
  return {
    value: sign + value + '%',
    valueClass: value > 5 ? 'danger' : 'success'
  };
};

module.exports = function(asHTML, result, gzip, filter) {
  if (!result.value.isValid())
    return styled(asHTML, 'error', 'red', 'danger');
  if (typeof result == 'string')
    return result;

  var valueStyled;
  var formatted = asHTML ? {} : '';

  if (!filter) {
    var sizeKey = gzip ? 'gzip' : 'size';
    valueStyled = formatValue(asHTML, result, sizeKey);

    if (asHTML) {
      formatted.size = valueStyled.value || valueStyled;
      formatted.sizeClass = valueStyled.class || 'default';
    }
    else
      formatted = valueStyled;

    valueStyled = formatValue(asHTML, result, 'time');

    if (asHTML) {
      formatted.time = valueStyled.value || valueStyled;
      formatted.timeClass = valueStyled.class || 'default';
    }
    else
      formatted += ' - ' + valueStyled;

  } else {
    valueStyled = formatValue(asHTML, result, filter);

    if (asHTML) {
      formatted.size = valueStyled.value || valueStyled;
      formatted.sizeClass = valueStyled.class || 'default';
      formatted.differential = formatPercentages(valueStyled.differential);
    }
    else
      formatted = valueStyled;
  }

  return formatted;
};
