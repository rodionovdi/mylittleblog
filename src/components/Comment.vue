<template>
  <v-col>
    <!-- окно коментария -->
    <v-card class="mx-auto comment" v-for="item in comments" :key="item.id">
      <v-card-text>
        <v-list-item class="grow pl-0">
          <v-list-item-avatar color="grey darken-3">
            <v-img
              class="elevation-6"
            ></v-img>
          </v-list-item-avatar>
          <h2 class="headline" >{{item.avtor}}</h2>
          <v-card-actions >
            <v-btn
              class="remove__button"
              color="red"
              text
              @click="removeComment(item.id)"
            >
              Удалить
            </v-btn>
          </v-card-actions>
        </v-list-item>
        <v-textarea 
          v-model="item.text"
          value="text"
          rows="1"
          readonly
        ></v-textarea>
      </v-card-text>
    </v-card>
    <!--  -->
  </v-col>
</template>

<script>
export default {
  props: ['title'],
  data: () => ({
    valid: false,
    dialog: false,
    items: [],
    comments: [],
    id: '',
    show: 'true',
  }),
  watch:{
    title: function() {
      if (this.title) {
        this.getItemsComment()
      }
    }
  },
  mounted() {
    if (localStorage.getItem('items')) {
      try {
        this.items = JSON.parse(localStorage.getItem('items'));
        this.comments = JSON.parse(localStorage.getItem('items'))[this.title].comments;
      } catch(e) {
        // localStorage.removeItem('items');
      }
    }
  },
  methods: {
    close(){
      this.edit = false
      this.title = '';
      this.description = '';
      this.fullDescription = '';
    },
    showEdit(id, title, description, fullDescription){
      this.edit = !this.edit
      this.id = id;
      this.title = title;
      this.description = description;
      this.fullDescription = fullDescription;
    },
    addArticle(){
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].id == this.id) {
          this.items[i].title = this.title
          this.items[i].description = this.description
          this.items[i].fullDescription = this.fullDescription
        }
      }
      const parsed = JSON.stringify(this.items);
      localStorage.setItem('items', parsed);
      this.title = '';
      this.description = '';
      this.fullDescription = '';
    },
    removeArticle(){
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].id == this.id) {
          var index = this.items.indexOf(this.items[i]);
          this.items.splice(index, 1);
        }
      }
      const parsed = JSON.stringify(this.items);
      localStorage.setItem('items', parsed);
      this.close()
    },
    removeComment(id){
      let comments = this.items[this.title].comments
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].id == id) {
          var index = comments.indexOf(comments[i]);
          comments.splice(index, 1);
        }
      }
      const parsed = JSON.stringify(this.items);
      localStorage.setItem('items', parsed);
      this.getItemsComment()
      this.$emit('delete')
    },
    getItemsComment(){
      this.items = JSON.parse(localStorage.getItem('items'));
      this.comments = JSON.parse(localStorage.getItem('items'))[this.title].comments;
    },
  }
}
</script>

<style lang="scss" scoped>
.remove__button{
 display: none;
 position: absolute;
 right: 0;
}
.comment{
  margin-top: 1rem;
  &:hover{
    .remove__button{
      display: block;
    }
  }
}
</style>
