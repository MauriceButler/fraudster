var test = require('tape'),
    Fraudster = require('../');

test('Fraudster is a function', function (t) {
    t.plan(1);
    t.equal(typeof Fraudster, 'function', 'Fraudster is a function');
});

test('Fraudster serves a mock', function (t) {
    t.plan(2);
    var fraudster = new Fraudster(),
        original = require('./testFile'),
        expectedMock = 'Loaded Mock',
        actualMock;

    fraudster.registerMock('./testFile', expectedMock);

    fraudster.enable();

    actualMock = require('./testFile');

    fraudster.disable();

    t.notEqual(original, actualMock, 'mock version was loaded');
    t.equal(actualMock, expectedMock, 'mock was correct');
});