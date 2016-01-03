#fraudster

Simple mock injection for Node require statements

Fraudster is not a mocking framework, it just allows you to inject your mock / fakes / stubs inplace of what would usualy be loaded by require calls.

# Why

I have been using [mockery](https://github.com/mfncooper/mockery) heavily for some time.

I like how it works, but have always wanted to change a few things it seams to be not maintained any more.

The main thing I needed merged was making it instanceable so that mocks do not leak into other tests...

This module is heavily based on that code but I have simplified a few things.


## Install

    npm i fraudster


## Usage

    var Fraudster = require('fraudster'),
        fraudster = new Fraudster(),
        fakeFs = {
            exists : function(path, callback){
                // Calls to fs.exists will always return true
                callback(null, true);
            }
        };

    fraudster.registerMock('fs', fakeFs);

    var fs = require('fs'); // Real fs module

    fraudster.enable();

    var fakeFs = require('fs'); // Fake fs module

    fraudster.disable();

## Options

When constructing Fraudster you can pass an optional `options` object to enable / disable warnings and errors

    var Fraudster = require('fraudster'),
        fraudster = new Fraudster({
            warnOnUnregistered: true,
            errorOnUnregistered: true,
            warnOnReplace: true,
            errorOnReplace: true,
            cleanCacheOnDisable: true // default false
        });

If warn is enabled a warning will be logged to the console, if error is enabled an Error will be thrown

When `cleanCacheOnDisable` is true the modules that were required while fraudster was enabled
will be removed from cache on disable/deregisterAll

## Registering mocks

Register mocks to make them available when Fraudster is enabled

    var fakeFs = {
        exists : function(path, callback){
            // Calls to fs.exists will always return true
            callback(null, true);
        }
    };

    fraudster.registerMock('fs', fakeFs);


If you no longer want your mock to be used, you can deregister it:

    fraudster.deregisterMock('fs');


## Allowable modules

If you enable Fraudster load a module that has not been mocked,  Fraudster will by default log a warning to the console.
This is so that you don't inadvertently use downstream modules without being aware of them.
By registering a module as "allowable", you tell Fraudster that you know about its use, and are happy for the original module to be loaded.

The most common use case for this is your source-under-test, which obviously you'll want to load without warnings. For example:

    fraudster.registerAllowable('./my-source-under-test');

You can also register many allowables at once with `registerAllowables`

    fraudster.registerAllowables(['./my-source-under-test', './someOtherModule']);

If you later want to remove an allowable this can be done as below

    fraudster.deregisterAllowable('./my-source-under-test');

or

    fraudster.deregisterAllowables(['./my-source-under-test', './someOtherModule']);


## Deregistering everything

If you just want to destoy all the things you can use the `deregisterAll` method

    fraudster.deregisterAll();
