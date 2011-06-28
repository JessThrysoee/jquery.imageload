/*
 * jquery.imageload -  reliable image load event 
 *
 * Copyright (c) 2011 Jess Thrysoee (jess@thrysoee.dk)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */

/*global asyncTest,test,ok,start,raises*/
/*jshint jquery:true, devel:true*/

function successMsg(img) {
   return 'image loaded successfully: src:' + img.src + ' width:' + img.width + ' height:' + img.height;
}

function errorMsg(img) {
   console.log('failed to load image: ' + img.src);
}

function flickholdr(offset) {
   return 'http://flickholdr.com/300/200/nature/' + offset;
}

function runTests() {

   var cachebuster = new Date().getTime();

   // after window.load #inline-ok imgage is oaded in #qunit-fixture
   asyncTest('HTML inline normal img tag', 1, function () {
      $('#inline-ok').imageLoad(function (e) {
         ok(e.type !== 'error', 'inline-ok image was loaded');
         start();
      });
   });

   asyncTest('HTML inline img.src points to non existing image', 1, function () {
      $('#inline-fail').imageLoad(function (e) {
         ok(e.type === 'error', 'inline-fail image report error');
         start();
      });
   });

   asyncTest('Dynamic Image.src pointing already cached image', 1, function () {
      var img = new Image();
      img.src = flickholdr(1);
      $(img).imageLoad(function (e) {
         ok(e.type !== 'error', 'dynamic cached image was loaded');
         start();
      });
   });

   asyncTest('Dynamic Image.src pointing uncached image', 1, function () {
      var img = new Image();
      img.src = flickholdr(++cachebuster);
      $(img).imageLoad(function (e) {
         ok(e.type !== 'error', 'dynamic uncached image was loaded');
         start();
      });
   });

   test('Image without src attribute must fail', 1, function () {
      var img = new Image();
      raises(function () {
         $(img).imageLoad(function (e) {});
      }, 'undefined src attribute');
   });


   asyncTest('ImageLoader test', 2, function () {
      var loader = $.ImageLoader(flickholdr(1));
      loader.done(function (e) {
         ok(true);
      });
      loader.load();
      loader.done(function (e) {
         ok(true);
         start();
      });
   });

   asyncTest('ImageLoader test2', 2, function () {
      var loader = $.ImageLoader(flickholdr(++cachebuster));
      loader.done(function (e) {
         ok(true);
      });
      loader.load();
      loader.done(function (e) {
         ok(true);
         start();
      });
   });

   asyncTest('ImageLoader array om images test', 5, function () {
      var images, imageLoaders, imageDeferreds;

      images = [flickholdr(1), flickholdr(2), flickholdr(++cachebuster), flickholdr(++cachebuster)];

      // stage a bunch of images to be loaded later
      imageLoaders = $.map(images, function (image) {
         var loader = $.ImageLoader(image);

         // on success
         loader.done(function (e) {
            ok(true, successMsg(this));
         });

         // on error
         loader.fail(function (e) {
            errorMsg(this);
         });

         return loader;

      });
      // at this point no image downloads have been initiated

      // now start image downloads
      $.each(imageLoaders, function () {
         this.load();
      });

      // ... when all images are loaded
      $.when.apply($, imageLoaders).done(function () {
         ok(true, 'All ' + imageLoaders.length + ' images are loaded');
         start();
      });
   });
}

$(window).load(runTests);
