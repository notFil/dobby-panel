var data = param.split("&");

var form = document.createElement("form");
form.setAttribute("method", "post");
form.setAttribute("action", url);

data.forEach(function(item){
  var newItem = item.split("=");
  var param = newItem[0];
  var value = newItem[1];
  var hiddenField = document.createElement("input");
  hiddenField.setAttribute("type", "hidden");
  hiddenField.setAttribute("name", param);
  hiddenField.setAttribute("value", value);
  form.appendChild(hiddenField);
  console.log(param + ":" + value)
})
document.body.appendChild(form);
form.submit();