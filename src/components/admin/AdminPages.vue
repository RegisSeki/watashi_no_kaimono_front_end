<template>
    <div class="admim-pages">
        <PageTitle icon="fa fa-cogs" main="Administração Sistema"
            sub="Cadastros" />
        <div class="admin-pages-tab">
            <b-card no-body>
                <b-tabs card>
                    <b-tab title="Categorias" active>
                        <CategoryAdmin />
                    </b-tab>
                    <b-tab title="Subcategorias" active>
                        <SubcategoryAdmin />
                    </b-tab>
                    <b-tab title="Produtos" active>
                        <ProductAdmin />
                    </b-tab>
                    <b-tab title="Usuários" active>
                        <UserAdmin />
                    </b-tab>
                </b-tabs>
            </b-card>
        </div>
    </div>
</template>

<script>
import PageTitle from '@/components/template/PageTitle'
import CategoryAdmin from './CategoryAdmin'
import SubcategoryAdmin from './SubcategoryAdmin'
import ProductAdmin from './ProductAdmin'
import UserAdmin from './UserAdmin'

export default {
    name: 'AdminPages',
    components: { PageTitle, CategoryAdmin, SubcategoryAdmin, ProductAdmin, UserAdmin },

}
</script>

<style>
    
</style>