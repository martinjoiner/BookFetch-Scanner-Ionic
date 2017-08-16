
# BookFetch Scanner App

A native app enabling users to submit stock item data to BookFetch.co.uk using the device's camera as a barcode scanner.

# To run it

## In browser

Note: A lot of the things that leverage native device features will not work in browser but it is useful for debugging certain things.

```bash
$ ionic serve
```

## On a device

cd into root of project and run:

```bash
$ ionic cordova run ios
```

Substitute ios for android if not on a Mac.

# References

The core app code was generated based on the Ionic 3 "tabs" template by running `ionic start myApp tabs`.

The components were added by reading through https://ionicframework.com/docs/components/#overview and having a play following best practice.

Inspiration for the barcode scanner was taken from https://www.techiediaries.com/barcode-qr-code-scanner-encoder-ionic-3/ 

Inspiration for the REST provider that hits the API was taken from https://www.djamware.com/post/58e657b680aca764ec903c2d/ionic-3-and-angular-4-mobile-app-example 
