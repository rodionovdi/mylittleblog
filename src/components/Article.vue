<template>
  <v-container fluid class="grey lighten-4">
    <v-row class="d-flex">
      <!-- статьи -->
      <v-col v-for="(item, i) in items" :key="i" :xs="12" :sm="12" :md="6" :lg="4">
        <v-card :id="`${i}`" :color="item.color" class="card">
           <!-- вызов окна редактирования -->
          <div class="settings" @click="showEdit(item.id, item.title, item.description ,item.fullDescription)">Редактировать</div>
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="headline" v-text="item.title"></v-card-title>
              <v-card-subtitle v-text="item.description"></v-card-subtitle>
            </div>
          </div>
         <div class="d-flex justify-space-between">
           <!-- вызов окна просмотра -->
            <v-btn text @click="showArticle(i)">Читать</v-btn>
            <div class="mr-3">{{item.comments.length}} комменатрий</div>
         </div>
        </v-card>
      </v-col>
      <!--  -->
    </v-row>
        <!-- окно просмотра статьи -->
    <v-dialog v-if="items != 0" v-model="dialog" width="600px">
      <v-btn icon @click="close">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-col>
        <v-card  m-0 p-0 :color="items[currentItem].color"  pl0> 
         
          <div class="d-flex flex-no-wrap justify-space-between" >
            <div>
              <v-card-title class="headline " v-text="items[currentItem].title"></v-card-title>
              <v-card-subtitle  v-text="items[currentItem].fullDescription"></v-card-subtitle>
            </div>
          </div>
          <Comment :title="`${currentItem}`" ref="childComment" v-on:delete="getItemsArticle"></Comment>
          <!-- окно добавления коментария -->
         <v-form v-model="validComment" ref="form">
          <v-col>
            <v-card class="mx-auto" >
              <v-card-text>
                <v-list-item class="grow pl-0">
                  <v-list-item-avatar color="grey darken-3">
                    <v-img
                      class="elevation-6"
                    ></v-img>
                  </v-list-item-avatar>
                  <v-text-field
                    v-model="avtor"
                    :rules="avtorRules"
                    value=''
                    :counter="10"
                    label="Введие ваше имя"
                    required
                  ></v-text-field>
                </v-list-item>
                <v-textarea 
                  v-model="text"
                  :rules="textRules"
                  label="Введие комментарий"
                  value=''
                  :counter="100"
                  rows="1"
                  required
                ></v-textarea>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions >
                <v-spacer></v-spacer>
                <v-btn
                  :disabled="!validComment"
                  color="primary"
                  text
                  @click="addComment(items[currentItem].id)"
                >
                  Добавить
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
         </v-form>
        </v-card>
      </v-col>
    </v-dialog>
    <!--  -->
    <!-- окно редактирования статьи -->
    <v-dialog v-if="items != 0" v-model="edit" width="600px">
       <v-card>
        <v-btn icon @click="close" >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-card-title class="headline">
          Редактирование записи
        </v-card-title>
        <v-card-text >
          <v-form v-model="valid">
            <v-text-field
              v-model="title"
              :rules="titleRules"
              :counter="20"
              label="Заголовок"
              required
            ></v-text-field>
            <v-text-field
              v-model="description"
              :rules="descriptionRules"
              :counter="20"
              label="Краткое описание"
              required
            ></v-text-field>
            <v-textarea
              v-model="fullDescription"
              label="Полное описание"
              :rules="fullDescriptionRules"
              value=""
              :counter="500"
              required
            ></v-textarea>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions >
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            text
            @click="removeArticle"
          >
            Удалить
          </v-btn>
          <v-btn
            :disabled="!valid"
            color="primary"
            text
            @click="editArticle"
          >
            Ок
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--  -->
  </v-container>
</template>

<script>
import Comment from './Comment';
import CommentHelp from './Comment_help';

export default {
  components: {
    Comment,
  },
  props:['search'],
  data: () => ({
    valid: false,
    validComment: false,
    dialog: false,
    edit: false,
    title: '',
    description: '',
    color: '#FEFEFE',
    fullDescription: '',
    currentItem: '0',
    items: [],
    id: '',
    avtor: '',
    text: '',
    titleRules: [
      v => !!v || 'Заголовок обязателен',
      v => v.length <= 20 || 'Заголовок должен быть менее 20 символов',
    ],
    descriptionRules: [
      v => !!v || 'Краткое описание обязательно',
      v => v.length <= 20 || 'Краткое описание должно быть менее 20 символов',
    ],
    fullDescriptionRules: [
      v => !!v || 'Полное описание обязательно',
      v => v.length <= 500 || 'Полное описание должно быть менее 500 символов',
    ],
    avtorRules: [
      v => !!v || 'Имя обязательно',
      v => v.length <= 10 || 'Имя должно быть менее 10 символов',
    ],
    textRules: [
      v => !!v || 'Комментарий обязателен',
      v => v.length <= 100 || 'Комментарий должен быть менее 100 символов',
    ],
  }),
  watch: {
    search: function(){
      if (this.search){
        let search = this.search.toLowerCase()
        this.items = this.items.filter(function(item) {
          return item.title.toLowerCase().indexOf(search) != -1
        })
      } else{
        this.getItemsArticle()
      }
    }
  },
  mounted() {
    if (localStorage.getItem('items')) {
      try {
        this.items = JSON.parse(localStorage.getItem('items'));
      } catch(e) {
        localStorage.removeItem('items');
      }
    }
  },
  methods: {
    close(){
      this.title = '';
      this.description = '';
      this.fullDescription = '';
      this.avtor = ''
      this.text = ''
      if (!this.edit) {
        this.$refs.form.resetValidation()
      }
      this.edit = false
      this.dialog = false
      
    },
    showEdit(id, title, description, fullDescription){
      this.$emit('deletesearch')
      this.edit = !this.edit
      this.id = id;
      this.title = title;
      this.description = description;
      this.fullDescription = fullDescription;
    },
    
    addArticle(){
      this.items = JSON.parse(localStorage.getItem('items'));
    },
    editArticle(){
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].id == this.id) {
          this.items[i].title = this.title
          this.items[i].description = this.description
          this.items[i].fullDescription = this.fullDescription
        }
      }
      const parsed = JSON.stringify(this.items);
      localStorage.setItem('items', parsed);
      this.close()
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
    addComment(id){
      this.search = ''
      const newComment = new CommentHelp(
          this.id = `f${(~~(Math.random()*1e8)).toString(16)}`,
          this.article = id,
          this.avtor,
          this.text
        )
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].id == id) {
          this.items[i].comments.push(newComment)
        }
      }
      const parsed = JSON.stringify(this.items);
      localStorage.setItem('items', parsed);
      this.$refs.childComment.getItemsComment()
      this.avtor = ''
      this.text = ''
      this.$refs.form.resetValidation()
    },
    showArticle(i){
      this.currentItem = i
      this.dialog = !this.dialog
    },
    getItemsArticle(){
      this.items = JSON.parse(localStorage.getItem('items'));
    }
  }
}
</script>

<style lang="scss" scoped>
.settings{
  display: none;
  position: absolute;
  right: 1rem;
  cursor: pointer;
}
.card{
  position: relative;
  &:hover{
    .settings{
      display: block;
    }
  }
}
</style>
