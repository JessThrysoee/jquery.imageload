
var container = $('#container');


var deferredImage = $.ImageLoader('http://flickholdr.com/300/200/nature/');


deferredImage.done(function () {

   container.append(this);
   console.log('hoho');
});


deferredImage.load();
