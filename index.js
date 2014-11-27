var Module = require('module'),
    fakeLoader = require('./fakeLoader');

function Fraudster(){
    this.registeredMocks = {};
    this.registeredAllowables = {};
    this.originalLoader = null;
    this.originalCache = null;
    this.options = {
        useCleanCache: false,
        warnOnReplace: true,
        warnOnUnregistered: true
    };
}

Fraudster.prototype.enable = function (options) {
    if (this.originalLoader) {
        return;
    }

    for (var key in options){
        this.options[key] = options[key];
    }

    if (this.options.useCleanCache) {
        this.originalCache = Module._cache;
        Module._cache = {};
    }

    this.originalLoader = Module._load;
    Module._load = fakeLoader.bind(this);
};

Fraudster.prototype.disable = function () {
    if (!this.originalLoader) {
        // Not hooked
        return;
    }

    if (this.options.useCleanCache) {
        Module._cache = this.originalCache;
        this.originalCache = null;
    }

    Module._load = this.originalLoader;
    this.originalLoader = null;
};


Fraudster.prototype.registerMock = function (key, mock) {
    if (this.registeredMocks.hasOwnProperty(key)) {
        if(this.options.warnOnReplace){
            console.warn('WARNING: Replacing existing mock for module: ' + key);
        }

        if(this.options.errorOnReplace){
            throw 'ERROR: Replacing existing mock for module: ' + key;
        }
    }
    this.registeredMocks[key] = mock;
};

Fraudster.prototype.deregisterMock = function (key) {
    if (this.registeredMocks.hasOwnProperty(key)) {
        delete this.registeredMocks[key];
    }
};

Fraudster.prototype.registerAllowable = function (key, unhook) {
    this.registeredAllowables[key] = {
        unhook: !!unhook,
        paths: []
    };
};


Fraudster.prototype.registerAllowables = function (keys, unhook) {
    var fraudster = this;

    keys.forEach(function (key) {
        fraudster.registerAllowable(key, unhook);
    });
};


Fraudster.prototype.deregisterAllowable = function (key) {
    var fraudster = this;

    if (this.registeredAllowables.hasOwnProperty(key)) {
        var allow = this.registeredAllowables[key];
        if (allow.unhook) {
            allow.paths.forEach(function (p) {
                delete fraudster.m._cache[p];
            });
        }
        delete this.registeredAllowables[key];
    }
};

Fraudster.prototype.deregisterAllowables = function (keys) {
    var fraudster = this;

    keys.forEach(function (key) {
        fraudster.deregisterAllowable(key);
    });
};

Fraudster.prototype.deregisterAll = function (){
    var fraudster = this;

    Object.keys(this.registeredAllowables).forEach(function (mod) {
        var allow = fraudster.registeredAllowables[mod];
        if (allow.unhook) {
            allow.paths.forEach(function (p) {
                delete fraudster.m._cache[p];
            });
        }
    });

    this.registeredMocks = {};
    this.registeredSubstitutes = {};
    this.registeredAllowables = {};
};

module.exports = Fraudster;


