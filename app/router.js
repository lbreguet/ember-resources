import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('lists');
  this.route('list', { path: '/lists/:list_id'}, function() {

  });
  this.route('list-edit', { path: 'lists/:list_id/edit' });
  // Ember trivia! dots are for nested routes! use a dash!
  // this path is incidental! the entire point is to map the url to an end-view-state
  // line 14 is a route definition
  // the first argument is the url of the route definition
  // the second argument is the path for the url of the route definition
});

export default Router;
