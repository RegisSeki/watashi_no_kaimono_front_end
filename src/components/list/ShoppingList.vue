<template>
    <div class="shopping-list">

        <b-modal
        id="modal-prevent-closing"
        ref="modal"
        title="Adicione a quantidade requerida:"
        @show="resetModal"
        @hidden="resetModal"
        @ok="handleOk">
            <form ref="form" @submit.stop.prevent="handleSubmit">
                <b-form-group
                    label="Quantidade"
                    label-for="quantity-input"
                    invalid-feedback="Quantidade é requirida"
                    :state="quantityState">
                    <b-form-input
                        type="number"
                        id="quantity-input"
                        v-model="quantity"
                        :state="quantityState"
                        required>
                    </b-form-input>
                </b-form-group>
            </form>
        </b-modal>

        <h4>Lista de Compras</h4>

        <b-navbar type="light" variant="light">
            <b-nav-form>
                <b-form-input class="mr-sm-2" placeholder="Nome da lista" v-model="listName"></b-form-input>
                <b-button variant="outline-success" class="my-2 my-sm-0" @click="createList()">Criar</b-button>
            </b-nav-form>
        </b-navbar>

        <div class="shopping-lists-select" v-show="shoppingLists !=''">
            <b-form-select v-model="selectedShoppingList" :options="shoppingLists" class="mb-3" @change="loadProductsList($event)">
            </b-form-select>
        </div>

        <b-navbar type="light" variant="light" v-show="shoppingLists !='' && this.selectedShoppingList != ''">
            <b-nav-form>
                <b-form-input class="mr-sm-2" placeholder="Nome do produto" v-model="productSearchable"></b-form-input>
                <b-button variant="outline-success" class="my-2 my-sm-0" @click="searchProduct()">Procurar</b-button>
            </b-nav-form>
        </b-navbar>

        <div class="product-list" v-show="products != ''">
            <b-table hover striped :items="products" :fields="fields">
                <template slot="add" slot-scope="data">
                    <b-button v-b-modal.modal-prevent-closing variant="success" @click="addProductToList(data.item)" class="mr-2">
                        <i class="fa fa-cart-plus"></i>
                    </b-button>
                </template>
            </b-table>
        </div>
        <hr>
        
        <div class="list-items" v-show="listItems != ''">
            <b-table hover striped :items="listItems" :fields="fieldsListItems">
            </b-table>
        </div>

    </div>
</template>

<script>
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'

export default {
    name: 'ShoppingList',
    data: function() {
        return {
            quantityState: null,
            quantity: '',
            productSearchable: '',
            listName: '',
            selectedShoppingList: '',
            selecteditem: '',
            shoppingList: {},
            shoppingLists: [],
            listItems: [],
            listItem: {},
            products: [],
            product: {},
            fields: [
                { key: 'name', Label: 'Nome' },
                { key: 'subcategory', label: 'Subcategoria' },
                { key: 'add', label: 'Adicionar na lista'}
            ],
            fieldsListItems: [
                { key: 'product_name', label: 'Produto' },
                { key: 'quantity', label: 'Quantidade'}
            ]
        }
    },
    methods: {
        checkFormValidity() {
            const valid = this.$refs.form.checkValidity()
            this.quantityState = valid
            return valid
        },
        resetModal() {
            this.quantity = ''
            this.quantityState = null
        },
        handleOk(bvModalEvt) {
            bvModalEvt.preventDefault()
            this.handleSubmit()
        },
        handleSubmit() {
            if (!this.checkFormValidity()) {
                return
            }
            const params = { list_item: { shopping_list_id: this.selectedShoppingList ,product_id: this.selecteditem, required_quantity: this.quantity }}
            axios.post(`${baseApiUrl}/api/v1/list_items`, params)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.loadProductsList(this.selectedShoppingList)
                })
                .catch(showError)

            this.$root.$emit('bv::hide::modal', "modal-prevent-closing")
        },
        searchProduct() {
            const url = `${baseApiUrl}/api/v1/products/search`
            axios.get(url, { params: { product: this.productSearchable }}).then(res => {
                this.products = res.data.map(product => {
                    return { ...product, value: product.id }
                })
            })
        },
        createList() {
            const params = { shopping_list: { name: this.listName }}
            axios.post(`${baseApiUrl}/api/v1/shopping_lists`, params)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        reset() {
            this.listName = '',
            this.loadShoppingLists()
        },
        loadShoppingLists() {
            const url = `${baseApiUrl}/api/v1/shopping_lists`
            axios.get(url).then(res => {
                this.shoppingLists = res.data.map(shoppingList => {
                    return { value: shoppingList.id, text: shoppingList.name }
                })
            })
        },
        addProductToList(item) {
            this.selecteditem = item.id
        },
        loadProductsList(event) {
            const url = `${baseApiUrl}/api/v1/list_items`
            axios.get(url, { params: { shopping_list_id: event }}).then(res => {
                this.listItems = res.data.map(listItem => {
                    return { ...listItem, value: listItem.id }
                })
            })        
        },
    },
    mounted() {
        this.loadShoppingLists()
    }
}
</script>

<style>

</style>