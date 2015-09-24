/* globals Ember */
import TagUtils from '../lib/tags';
import PageableController from './pageable';
import QuickText from '../mixins/quickt';


export default PageableController.extend(QuickText, {

  queryOptions: Ember.inject.service(), // template needs this
  application: Ember.inject.controller('application'),
  
  matchAnyTags: false,  
  
  selectedTags: [ ],
  
  tagQueryString: function() {
    return TagUtils.create( { source: this.get('selectedTags').mapBy( 'id' ) } ).toString();
  }.property('selectedTags.[]'),
  
  catNames: ['genre', 'instr', 'mood'],
  
  categories: null,
  
  title: function() {
    return this.qt( 'queryOptions.deep' );
  }.property(),
  
  enoughForMatchAny: function() {
    return this.get('selectedTags.length') > 1;
  }.property('selectedTags.[]'),
  
  setupCategories: function() {
    if( this.categories === null ) {
      var tagStore = this.container.lookup('store:tags');
      tagStore.query( { categories: this.catNames, details: true } )
        .then( tags => this.set('categories',tags) );
    }
  },

  actions: {
  
    remove: function(tag) {
      tag.set('isSelected',false);
      this.selectedTags.removeObject(tag);
    },

    clear: function() {
      this.selectedTags.forEach( t => t.set('isSelected',false) );
      this.set('selectedTags',[ ]);
    }

  },  
});
