QUnit.module('loadModels', function() {
    QUnit.test('load models', function(assert) {
        assert.equal(loadModels(), 0);
    });
});