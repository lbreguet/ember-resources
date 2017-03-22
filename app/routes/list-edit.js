import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    saveList (list) {
      list.save()
      .then(() => this.transitionTo('lists'));
    },
  },
});
