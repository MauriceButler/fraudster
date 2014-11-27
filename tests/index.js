var test = require('tape'),
    Fraudster = require('../');

test('Fraudster is a function', function (t) {
    t.plan(1);
    t.equal(typeof Fraudster, 'function', 'Fraudster is a function');
});

test('Fraudster serves a mock', function (t) {
    t.plan(2);
    var fraudster = new Fraudster(),
        original = require('fs'),
        expectedMock = 'Loaded Mock',
        actualMock;

    fraudster.registerMock('fs', expectedMock);

    fraudster.enable();

    actualMock = require('fs');

    fraudster.disable();

    t.notEqual(original, actualMock, 'mock version was loaded');
    t.equal(actualMock, expectedMock, 'mock was correct');
});

test('Fraudster deregisters mock', function (t) {
    t.plan(2);
    var fraudster = new Fraudster();

    fraudster.registerMock('foo', 'bar');

    t.deepEqual(Object.keys(fraudster.registeredMocks), ['foo'], 'mocks set');

    fraudster.deregisterMock('foo');

    t.deepEqual(Object.keys(fraudster.registeredMocks), [], 'mocks deregistered');
});

test('Fraudster registers allowables', function (t) {
    t.plan(1);
    var fraudster = new Fraudster(),
        testAllowables = ['foo', 'bar'];

    fraudster.registerAllowables(testAllowables);

    t.deepEqual(Object.keys(fraudster.registeredAllowables), testAllowables, 'allowables set');
});

test('Fraudster deregisters allowables', function (t) {
    t.plan(2);
    var fraudster = new Fraudster(),
        testAllowables = ['foo', 'bar'];

    fraudster.registerAllowables(testAllowables);

    t.deepEqual(Object.keys(fraudster.registeredAllowables), testAllowables, 'allowables set');

    fraudster.deregisterAllowables(testAllowables);

    t.deepEqual(Object.keys(fraudster.registeredAllowables), [], 'allowables deregistered');
});

test('Fraudster deregister all clears all', function (t) {
    t.plan(5);
    var fraudster = new Fraudster(),
        testAllowables = ['foo', 'bar'],
        testMock = {};

    fraudster.registerMock('foo', testMock);

    fraudster.registerAllowables(testAllowables);

    t.deepEqual(Object.keys(fraudster.registeredAllowables), testAllowables, 'allowables set');
    t.deepEqual(Object.keys(fraudster.registeredMocks), ['foo'], 'registeredMocks set');
    t.equal(fraudster.registeredMocks.foo, testMock, 'registeredMocks set');

    fraudster.deregisterAll();

    t.deepEqual(Object.keys(fraudster.registeredAllowables), [], 'allowables destroyed');
    t.deepEqual(Object.keys(fraudster.registeredMocks), [], 'registeredMocks destroyed');
});

test('Fraudster errors on replace if configured', function (t) {
    t.plan(1);
    var fraudster = new Fraudster({errorOnReplace: true});

    fraudster.registerMock('foo', 'bar');

    t.throws(
        function(){
            fraudster.registerMock('foo', 'stuff');
        },
        'errored on replace correctly'
    );
});

test('Fraudster errors on unregistered if configured', function (t) {
    t.plan(1);
    var fraudster = new Fraudster({errorOnUnregistered: true});

    fraudster.enable();
    t.throws(
        function(){
            require('fs');
        },
        'errored on replace correctly'
    );
    fraudster.disable();
});

test('Fraudster double enable / disable is ok is ok', function (t) {
    t.plan(1);
    var fraudster = new Fraudster({errorOnUnregistered: true});

    fraudster.enable();
    fraudster.enable();
    fraudster.disable();
    fraudster.disable();

    t.pass('didnt go bang');
});