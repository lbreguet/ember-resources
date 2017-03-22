import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('shopping-list/edit', 'Integration | Component | shopping list/edit', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{shopping-list/edit}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#shopping-list/edit}}
      template block text
    {{/shopping-list/edit}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
