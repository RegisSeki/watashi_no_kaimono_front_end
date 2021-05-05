<template>
    <div class="product-admin">
        <b-form>
            <input id="product-id" type="hidden" v-model="product.id" />
            <b-form-group v-if="mode === 'save'" 
                label="Subcategoria:" label-for="subcategoryId">
                <b-form-select id="subcategory_id"
                    :options="subcategories" v-model="product.subcategory_id" />
            </b-form-group>
            <b-form-group label="Nome:" label-for="product-name">
                <b-form-input id="product-name" type="text"
                    v-model="product.name" required
                    :readonly="mode === 'remove'"
                    placeholder="Informe o Nome do Produto..." />
            </b-form-group>
            <b-form-group label="Código:" label-for="product-code">
                <b-form-input id="product-code" type="text"
                    v-model="product.code" required
                    :readonly="mode === 'remove'"
                    placeholder="Informe o Código do Produto (Código Barras)..." />
            </b-form-group>
            <b-form-group label="Url Imagem do produto:" label-for="product-url_img">
                <b-form-input id="product-url_img" type="text"
                    v-model="product.url_img"
                    :readonly="mode === 'remove'"
                    placeholder="Informe a Url da imagem do Produto..." />
            </b-form-group>
            <b-button variant="primary" v-if="mode === 'save'"
                @click="save">Salvar</b-button>
            <b-button variant="danger" v-if="mode === 'remove'"
                @click="remove">Excluir</b-button>
            <b-button class="ml-2" @click="reset">Cancelar</b-button>
        </b-form>
        <hr>
        <b-table hover striped :items="products" :fields="fields">
            <template slot="actions" slot-scope="data">
                <b-button variant="warning" @click="loadProduct(data.item)" class="mr-2">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button variant="danger" @click="loadProduct(data.item, 'remove')">
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
    name: 'ProductsAdmin',
    data: function() {
        return {
            mode: 'save',
            product: {},
            products: [],
            subcategories: [],
            fields: [
                { key: 'id', label: 'Código', sortable: true },
                { key: 'name', label: 'Nome', sortable: true },
                { key: 'code', label: 'Código de Barras' },
                { key: 'category', label: 'Categoria', sortable: true },
                { key: 'subcategory', label: 'Subcategoria', sortable: true },
                { key: 'actions', label: 'Ações' }
            ]
        }
    },
    methods: {
        loadProducts() {
            const url = `${baseApiUrl}/api/v1/products`
            axios.get(url).then(res => {
                this.products = res.data.map(product => {
                    return { ...product, value: product.id }
                })
            })
        },
        loadSubcategories() {
            const url = `${baseApiUrl}/api/v1/subcategories`
            axios.get(url).then(res => {
                // this.subcategories = res.data
                this.subcategories = res.data.map(subcategory => {
                    return { value: subcategory.id, text: subcategory.name }
                })
            })
        },
        reset() {
            this.mode = 'save'
            this.product = {}
            this.loadProducts()
        },
        save() {
            const method = this.product.id ? 'put' : 'post'
            const id = this.product.id ? `/${this.product.id}` : ''
            axios[method](`${baseApiUrl}/api/v1/products/${id}`, this.product)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        remove() {
            const id = this.product.id
            axios.delete(`${baseApiUrl}/api/v1/products/${id}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        loadProduct(product, mode = 'save') {
            this.mode = mode
            this.product = { ...product }
        }
    },
    mounted() {
        this.loadSubcategories()
        this.loadProducts()
    }
}
</script>

<style>

</style>
