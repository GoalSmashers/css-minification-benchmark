module.exports = function(asHTML, result) {
  var styled = function(value, color, bootstrapClass) {
    return asHTML ?
      { 'class': bootstrapClass, value: value } :
      value[color];
  };

  if (isNaN(result.value.time))
    return styled('error', 'red', 'danger');
  if (typeof result == 'string')
    return result;

  var value = result.value.size + ' bytes';
  var valueStyled = value;
  var formatted = asHTML ? {} : '';

  if (result.compare.size.worst)
    valueStyled = styled(value, 'red', 'danger');
  if (result.compare.size.best)
    valueStyled = styled(value, 'green', 'success');

  if (asHTML) {
    formatted.size = valueStyled.value || value;
    formatted.sizeClass = valueStyled.class || 'default';
  }
  else
    formatted = valueStyled;

  valueStyled = value = result.value.time + ' ms';

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
