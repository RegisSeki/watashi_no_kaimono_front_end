<template>
    <div class="subcategory-admin">
        <b-form>
            <input id="subcategory-id" type="hidden" v-model="subcategory.id" />
            <b-form-group v-if="mode === 'save'" 
                label="Categoria:" label-for="categoryId">
                <b-form-select id="category_id"
                    :options="categories" v-model="subcategory.category_id" />
            </b-form-group>
            <b-form-group label="Nome:" label-for="subcategory-name">
                <b-form-input id="subcategory-name" type="text"
                    v-model="subcategory.name" required
                    :readonly="mode === 'remove'"
                    placeholder="Informe o Nome da Subcategoria..." />
            </b-form-group>
            <b-form-group label="Descrição:" label-for="subcategory-description">
                <b-form-input id="subcategory-description" type="text"
                    v-model="subcategory.description" required
                    :readonly="mode === 'remove'"
                    placeholder="Informe uma Descrição para a Subcategoria..." />
            </b-form-group>
            <b-button variant="primary" v-if="mode === 'save'"
                @click="save">Salvar</b-button>
            <b-button variant="danger" v-if="mode === 'remove'"
                @click="remove">Excluir</b-button>
            <b-button class="ml-2" @click="reset">Cancelar</b-button>
        </b-form>
        <hr>
        <b-table hover striped :items="subcategories" :fields="fields">
            <template slot="actions" slot-scope="data">
                <b-button variant="warning" @click="loadSubcategory(data.item)" class="mr-2">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button variant="danger" @click="loadSubcategory(data.item, 'remove')">
                    <i class="fa fa-trash"></i>
                </b-button>
            </template>
        </b-table>
    </div>
</template>

<script>
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'
export default {
    name: 'SubcategoryAdmin',
    data: function() {
        return {
            mode: 'save',
            subcategory: {},
            categories: [],
            subcategories: [],
            fields: [
                { key: 'id', label: 'Código', sortable: true },
                { key: 'name', label: 'Nome', sortable: true },
                { key: 'description', label: 'Descrição', sortable: true },
                { key: 'category', label: 'Categoria', sortable: true },
                { key: 'actions', label: 'Ações' }
            ]
        }
    },
    methods: {
        loadCategories() {
            const url = `${baseApiUrl}/api/v1/categories`
            axios.get(url).then(res => {
                this.categories = res.data.map(category => {
                    return { value: category.id, text: category.name }
                })
            })
        },
        loadSubcategories() {
            const url = `${baseApiUrl}/api/v1/subcategories`
            axios.get(url).then(res => {
                // this.subcategories = res.data
                this.subcategories = res.data.map(subcategory => {
                    return { ...subcategory, value: subcategory.id }
                })
            })
        },
        reset() {
            this.mode = 'save'
            this.subcategory = {}
            this.loadSubcategories()
        },
        save() {
            const method = this.subcategory.id ? 'put' : 'post'
            const id = this.subcategory.id ? `/${this.subcategory.id}` : ''
            axios[method](`${baseApiUrl}/api/v1/subcategories/${id}`, this.subcategory)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        remove() {
            const id = this.subcategory.id
            axios.delete(`${baseApiUrl}/api/v1/subcategories/${id}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        loadSubcategory(subcategory, mode = 'save') {
            this.mode = mode
            this.subcategory = { ...subcategory }
        }
    },
    mounted() {
        this.loadSubcategories()
        this.loadCategories()
    }
}
</script>

<style>

</style>
