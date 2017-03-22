import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  createRecord (store, type, record) {
    let api = this.get('host');
    // serialized method to create a new id
    // it takes the whole list and tells us we need something called listId
    let serialized = this.serialize(record, { includeId: true });
    let listId = serialized.list_id;
    let url = `${api}/lists/${listId}/items`;
    let data = { item: serialized };

    return this.ajax(url, 'POST', { data });
  }
});

// @Louis-- we're doing this because the API expects us to POST lists/:list_id/items
// but like, Ember doesn't get there by itself
// it kind of wants to create an item without a list, but there's no straight path to items
// you can't just be like POST items/ LOL
// we're not overriding Ember, we're just assigning the right path
// Ember will take care of turning the item into JSON
// we just need to point it in the right direction and give it the data
// I'm pretty sure the serialized method just adds a list_id attribute to the item
// so the JSON would be
// {
// content: (whatever the content is),
// done: true,
// list_id: (whatever the list id is)
// }
