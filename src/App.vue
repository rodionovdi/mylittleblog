<template>
  <v-app id="keep">
    <!-- шапка -->
    <v-app-bar
      app
      clipped-left
      color="amber"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <span class="title ml-3 mr-5"><span class="font-weight-light">MyLittleblog</span></span>
      <!-- <v-text-field
        v-model="search"
        solo-inverted
        flat
        hide-details
        label="Search"
      ></v-text-field> -->
      <v-spacer></v-spacer>
    </v-app-bar>
    <!-- меню добавления -->
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      color="grey lighten-4"
    >
      <v-list
        dense
        class="grey lighten-4"
      >
        <template v-for="(item, i) in itemsMenu">
          <v-row
            v-if="item.heading"
            :key="i"
            align="center"
          >
            <v-col cols="6">
              <v-subheader v-if="item.heading" >
                {{ item.heading }}
              </v-subheader >
            </v-col>
            <v-col
              cols="6"
              class="text-right"
            >
            </v-col>
          </v-row>
          <v-divider
            v-else-if="item.divider"
            :key="i"
            dark
            class="my-4"
          ></v-divider>
          <v-list-item
            v-else
            :key="i"
            link
          >
            <v-list-item-content>
              <v-list-item-title class="grey--text" @click="showAddArticle">
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <!-- статьи -->
      <Article :search="search" ref="child" v-bind:is="currentView" v-on:deletesearch="clearSearch"></Article>
      <v-container
        fluid
        class="grey lighten-4 fill-height"
      >
      </v-container>
    </v-main>
    <!-- окно добавления статьи -->
    <v-dialog v-if="itemsMenu != 0" v-model="dialog" width="600px" >
       <v-card>
        <v-btn icon @click="close" >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-card-title class="headline">
          Создание записи
        </v-card-title>
        <v-card-text >
          <v-form v-model="valid" ref="form">
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
             <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  :disabled="!valid"
                  color="primary"
                  text
                  @click="addArticle"
                >
                  Ок
                </v-btn>
              </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import Article from './components/Article';
import ArticleHelp from './components/Article_help';

export default {
  name: 'App',
  components: {
    Article,
  },
  props: {
    source: String,
  },
  data: () => ({
    currentView: 'Article',
    dialog: false,
    drawer: null,
    valid: false,
    title: '',
    description: '',
    color: '#FEFEFE',
    fullDescription: '',
    items: [],
    search: '',
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
    itemsMenu: [
      { heading: 'Редактор' },
      { text: 'Создать запись'},
      { divider: true }
    ],
  }),
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
    clearSearch(){
      this.search = ''
    },
    showAddArticle(){
      this.search = ''
      this.dialog = !this.dialog
      this.drawer = !this.drawer
    },
    addArticle(){
      this.search = ''
      const newArticle = new ArticleHelp(
          this.id = `f${(~~(Math.random()*1e8)).toString(16)}`,
          this.title,
          this.description,
          this.fullDescription,
          this.color,
          this.comments
        )
      this.items.push(newArticle)
      const parsed = JSON.stringify(this.items)
      localStorage.setItem('items', parsed)
      this.$refs.child.addArticle()
      this.close()
    },
    close(){
      this.search = ''
      this.dialog = false
      this.title = ''
      this.description = ''
      this.fullDescription = ''
      this.$refs.form.resetValidation()
    }
  }
};
</script>

<style lang="scss" scoped>
#keep .v-navigation-drawer__border {
  display: none
}
</style>