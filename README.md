[![General Assembly Logo](https://camo.githubusercontent.com/1a91b05b8f4d44b5bbfb83abac2b0996d8e26c92/687474703a2f2f692e696d6775722e636f6d2f6b6538555354712e706e67)](https://generalassemb.ly/education/web-development-immersive)

# Ember Resources

One of the chief advantages of having a front-end framework is being able to
store and manipulate data entirely on the front-end, without needing to
explicitly make AJAX requests. This is accomplished through a data layer, which
for Ember is a library called ember-data. In this session, we'll look at how to
use ember-data to set up front-end models and perform CRUD actions on them.

## Prerequisites

By now, you have already learned how to:

-   Create nested view states and route to them appropriately.
-   Set up resource routes.
-   Model the user interface using components.
-   Represent visual hierarchies with nested components.
-   Register actions and click handlers on component objects.
-   Pass data from routes to components, and from components to components.

## Objectives

By the end of this session, you should be able to:

-   Generate a Model to represent a resource on the front-end.
-   Extend an Adapter to connect your Model(s) to an API.
-   Make Models accessible in templates by loading them through Routes.
-   Create CRUD actions on a Route, and trigger them from Components.
-   Add behavior to Route actions to perform CRUD on the Route's model.

## Setup

1.  Fork and clone this repo.
1.  Run `npm install` and `bower install`.
1.  Clone [listr-api](https://github.com/ga-wdi-boston/listr-api) into a
    subdirectory of ~/wdi/tmp and follow the instructions to setup the API.
1.  Start the api with `bin/rails server`
1.  Start the client with `ember server`

## Ember Debugging

| Problem | Solution/ Advice |
| ---------- | -----------------|
| link not there? | Does the route exist? |
| Adding code, but not seeing changes | Restart Server |
| Are you in doubt? | Check the documentation! |
| My component disappeared! | check spelling, pluralization, capitalization |
| Template Error? | Did you remember to type `return` ? |

## Rachel's Nuggets of Advice
- Make sure everything works before you make things dynamic!
  - When you make a model and a route, put some throwaway code in handlebars and TEST IT!
  - Can we get at least one list? use the model hook to test it!
- When in doubt, check the docs! :)
- Common mistakes: forgetting to point what we're displaying the right component in template
  - e.g. forgetting `list=model` in the template
  - `{{shopping-list list=model}}`
  - `model` here is the data we're passing down
  - `list` here is the name of the component
- checklist:
  - Is there a problem with your model?
  - Is your template connected?
  - Are you on the right URL?

## ember-data and CRUD

In the past few days, you've seen a whole lot of Ember's 'view' layer - the
system governing how Ember responds to user behavior and controls what HTML gets
rendered in the browser.

While this is all very nice, it's meaningless without an API. That's where
Ember's 'data' layer comes in, as implemented by an add-on library to Ember
called `ember-data`.

`ember-data` provides several Ember Classes for handling the exchange of
information between the client and the API, most notably Models (which
represent back-end resources as Ember Objects) and Adapters (which manage the
actual interactions with the underlying API(s)).

- If you use RESTful routes, you don't have to configure them! cool
- Ember likes convention over configuration! :)
- DS stands for Data Store

## Refactor ListR

We'll start with the solution from `ember-components`.

### Move ListR to the lists route

1.  Generate a `lists` route
1.  Move ListR specifics from `index` route to `lists` route
1.  Link to `lists` route from `index` route

```sh
ember generate route lists
```

### Get and display list data from the listr-api

1.  Generate a `list` model (for now, we'll leave items off)
1.  Generate a `shopping-list/card` component as the top-level interface to lists
1.  Copy the list title display to `shopping-list/card` (without any action)
1.  Refactor the `lists` route template to use `shopping-list/card`
1.  Refactor the `lists` route `model` method to use the ActiveModelAdapter

- We just want to show the name and have people go to the individual list
- That's why we have a shopping-list/card
- Tbh it's Rachel/the developer's personal decision, and we respect that

```sh
ember generate model list title:string hidden:boolean
```

This will create a new `model.js` file inside `app/list`. The README for the API
shows us the data we can expect at [GET
/lists](https://github.com/ga-wdi-boston/listr-api#get-lists). Note that the
items returned are just ids.  We specified the properties that we want the
`ember-data` model to have. We could _all_ of the properties from the API, but
we're leaving off items because we haven't created and `item` model, yet.

`DS.attr` is how we define attributes for our models. The default types are
'number', 'string', 'boolean', and 'date', but we can define our own if we
really need to. We can also use `DS.attr` to specify a default value for a
given attribute by passing in an optional object as a second argument.

As we saw in the material on routing, each Route has a `model` method that
exposes data to the template. Each Route also has a `store` property which
refers to whatever data store our application is using (in this case,
ember-data), so to make the List model available in the `lists` route, we
reference the store and query it for all instances.

```js
export default Ember.Route.extend({
  model () {
    // now we send a GET request to lists! wild
    return this.get('store').findAll('list');
  }
});
```

### Get and display item data

1.  Generate an `item` model
1.  Add a hasMany to the `list` model
1.  Generate a route for a single list
1.  Update `app/router.js` for the single list route
1.  Add the `model` method to the `list` route
1.  Invoke the `shopping-list` component from the `list` route template
1.  Link to the `list` route from the `shopping-list/card` template

```sh
ember generate model item content:string done:boolean list:belongs-to:list
ember generate route list
```
- This generates this in app/models/item.js:
```js
export default DS.Model.extend({
  content: DS.attr('string'),
  done: DS.attr('boolean'),
  // first list is the back-end list, second list is the one from the model
  list: DS.belongsTo('list')
});
```
- Need to add the other end of the relationship in list.js! LOL #dontforget
```diff
 export default DS.Model.extend({
   title: DS.attr('string'),
   hidden: DS.attr('boolean'),
+  items: DS.hasMany('item'),
 });
```
- Generates a route for a single list!
```diff
 Router.map(function () {
   this.route('lists');
-  this.route('list');
+  this.route('list', { path: '/lists/:list_id' });
 });
```

```diff
 export default Ember.Route.extend({
+  model (params) {
+    return this.get('store').findRecord('list', params.list_id);
+  },
 });
```

Now that we've refactored ListR to use data from the API, we'll move on to
persisting changes.

## Ember CRUD - Data Down, Actions Up (DDAU)

Now that we have models loaded in our Routes, it's finally time to tie all of
this together.

Before talking about CRUD, though, we should start by talking about something
you touched on in the material on Components: 'actions'. 'Actions' are a special
class of trigger-able events that are handled by the `Ember.ActionHandler` Ember
Class. Like normal events, actions 'bubble up', moving from the leaf (i.e.
Template) to the root (i.e. the 'application' Route) until they are met by a
matching handler.

In Ember 1, action handlers inside the Controller were used to perform CRUD on
the model. This made sense, since the Controller was responsible for managing
all of the business data in our application, and since it mirrored how
responsibilities were broken out in Rails. An action could be triggered in a
Template and bubble up to a Controller, where it would cause that Controller to
manipulate the given Model.

However, with the shift towards Components in Ember 2, a lot of the
functionality of Controllers has been made redundant and moved into other
entities within the app. In this case, Components and Routes both incorporate
`Ember.ActionHandler`, so we can instead set our action handlers there. For
simplicity's sake, we'll put all handlers related to Model CRUD into the Route;
any other action handlers can be placed in either place.

Defining Action handlers in a Route is very easy. Simply open up the `route.js`
file and make the following addition:

```js
import Ember from 'ember';

export default Ember.Route.extend({
  model: function(...){
    ...
  },
  actions: {
    create () { ... },
    update () { ... },
    destroy () { ... },
    // ... etc
  }
});
```

To trigger an action, you can add an `{{action ... }}` helper to an element
(usually a button) - this will cause that element to launch the action whenever
it executes its defaults behavior (in the case of a button, being clicked).

In Ember applications that use Components (which will soon be all of them) the
generally recommended strategy is to follow a 'data down, actions up' design
pattern, which essentially means two things:

1.  All Components look to their parent element as a source of data to bind to;
    as a result, data changes propagate 'downwards' from parent to child.
1.  Implicit in the first point is that all changes to data take place in the
    parent.  In order to effect changes to the data in a parent element,
    Components trigger their parents' actions; in this fashion, action
    invocations propagate 'upwards' from child to parent.

### Persist item changes to the API

1.  In the `shopping-list/item` component
    1.  Make listItemCompleted a computed property alias of the item component
    1.  Change toggleDone to send that action up
1.  In the `shopping-list` component
    1.  Add `toggleDone='toggleItemDone'` to invoking `shopping-list/item`
    1.  Add the toggleItemDone action handler to send the action up
1.  In the `list` route
    1.  Add `toggleItemDone='toggleItemDone'` to invoking `shopping-list`
    1.  Add the toggleItemDone action to the route

```diff
 export default Ember.Component.extend({
   tagName: 'li',
   classNameBindings: ['listItemCompleted'],
-  listItemCompleted: false,
+  listItemCompleted: Ember.computed.alias('item.done'),
   actions: {
     toggleDone () {
-      return this.toggleProperty('listItemCompleted');
+      return this.sendAction('toggleDone', this.get('item'));
     },
   },
 });
```

```diff
   classNameBindings: ['listDetailHidden'],
   listDetailHidden: false,
   actions: {
+    toggleItemDone (item) {
+      return this.sendAction('toggleItemDone', item);
+    },
+
   toggleListDetail () {
     return this.toggleProperty('listDetailHidden');
   },
```

```diff
   model (params) {
     return this.get('store').findRecord('list', params.list_id);
   },
+
+  actions: {
+    toggleItemDone (item) {
+      item.toggleProperty('done');
+      item.save();
+    },
+  },
 });
```

### Lab: Delete items on the API

1.  In the `shopping-list/item` component
    1.  Add a button with text "Delete" and `{{action 'delete'}}`
    1.  Add a `delete` action to send that action up
1.  In the `shopping-list` component
    1.  Add `delete='deleteItem'` to invoking `shopping-list/item`
    1.  Add the `deleteItem` action to send the action up
1.  In the `list` route
    1.  Add `deleteItem='deleteItem'` to invoking `shopping-list`
    1.  Add the deleteItem action to the route

### Create items on the API

1.  In the `shopping-list` component
    1.  Add a form after `each` with `{{action "createItem" on="submit"}}`
    1.  Add an input to the form with `value=newItem.content`
    1.  Add a `newItem` property
    1.  Add the `createItem` action to send the action up
1.  In the `list` route
    1.  Add `createItem='createItem'` to invoking `shopping-list`
    1.  Add the createItem action to the route

Does it work?

Unfortunately, no.  The API uses a nested route for creating new list items.
This doesn't fit directly with `ember-data`'s modeling of APIs, so we have to do
some extra work.

We'll extend the default application adapter, included in `ember-template` to
handle this case.

## Additional Resources

-   [Ember API : Ember.ActionHandler](http://emberjs.com/api/classes/Ember.ActionHandler.html)
-   [Ember API : DS.store](http://emberjs.com/api/data/classes/DS.Store.html)
-   [Ember Data](https://cloud.githubusercontent.com/assets/10064043/18616616/13abe5fe-7d8d-11e6-9fe6-7cca802d4ddc.png)
-   [ember-data to ActiveRecord](https://cloud.githubusercontent.com/assets/10064043/18616633/86fe1680-7d8d-11e6-9b64-ad472163a7c5.png)
-   [Ember core concepts](https://guides.emberjs.com/v2.8.0/images/ember-core-concepts/ember-core-concepts.png)
-   [Data Flow](https://cloud.githubusercontent.com/assets/10064043/18616665/f6062c84-7d8d-11e6-8d01-60960346cf95.png)
-   [data down actions up](https://cloud.githubusercontent.com/assets/10064043/18616671/0e74c262-7d8e-11e6-8ba9-6f1e5840a741.png)

## [License](LICENSE)

1.  All content is licensed under a CC­BY­NC­SA 4.0 license.
1.  All software code is licensed under GNU GPLv3. For commercial use or
    alternative licensing, please contact legal@ga.co.
