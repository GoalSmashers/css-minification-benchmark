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

  return valueStyled;
};

module.exports = function(asHTML, result, gzip) {

  if (!result.value.isValid())
    return styled(asHTML, result.value.label, 'red', 'danger');
  if (typeof result == 'string')
    return result;

  var valueStyled;
  var formatted = asHTML ? {} : '';
  var sizeKey = gzip ? 'gzip' : 'size';
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
    formatted += ' - ' + valueStyled;
  }

  return formatted;
};
