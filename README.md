jquery.imageload - reliable image load event 
============================================

Address the [caveats of the load event when used with images](http://api.jquery.com/load-event/).



Inline html image 

       $('img').imageLoad(function (e) {
          if (e.type === 'error') {
             // handle error
          } else {
             // handle success
          }
       });

or create a image dynamically

       var img = new Image();
       img.src = 'image.png';
       $(img).imageLoad(function (e) {
          if (e.type === 'error') {
             // handle error
          } else {
             // handle success
          }
       }

or more advanced

       var images = ['image1.png', 'image2.png', 'image3.png', 'image4.png'];
       
       // stage a bunch of images to be loaded later
       var imageLoaders = $.map(images, function (image) {
          return $.ImageLoader(image);
       }
       // at this point no image downloads have been initiated
       
       // now start all image downloads and collect the deferreds in an array
       var imageDeferreds = $.map(imageLoaders, function (imageLoader) {
          // load() starts the image download
          var deferred = imageLoader.load();
       
          deferred.done(function (e) {
             // handle single image loaded successfully
          });
       
          deferred.fail(function (e) {
             // handle single image failed to load
          });
       
          return deferred;
       });
       
       $.when.apply($, imageDeferreds).done(function () {
          // handle all images are loaded
       });
