module.exports = function(asHTML, result, gzip) {
  var styled = function(value, color, bootstrapClass) {
    return asHTML ?
      { 'class': bootstrapClass, value: value } :
      value[color];
  };

  if (!result.value.isValid())
    return styled('error', 'red', 'danger');
  if (typeof result == 'string')
    return result;

  var sizeKey = gzip ? 'gzip' : 'size';
  var value = result.value.format(sizeKey, 'byte');
  var valueStyled = value;
  var formatted = asHTML ? {} : '';

  if (result.compare[sizeKey].worst)
    valueStyled = styled(value, 'red', 'danger');
  if (result.compare[sizeKey].best)
    valueStyled = styled(value, 'green', 'success');

  if (asHTML) {
    formatted.size = valueStyled.value || value;
    formatted.sizeClass = valueStyled.class || 'default';
  }
  else
    formatted = valueStyled;

  valueStyled = value = result.value.format('time', 'time');

  if (result.compare.time.worst)
    valueStyled = styled(value, 'red', 'danger');
  if (result.compare.time.best)
    valueStyled = styled(value, 'green', 'success');

  if (asHTML) {
    formatted.time = valueStyled.value || value;
    formatted.timeClass = valueStyled.class || 'default';
  }
  else
    formatted += ' - ' + valueStyled;

  return formatted;
};
