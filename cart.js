const url = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'zen777';

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

const app = Vue.createApp({
  data(){
    return {
      cartData: {},
      products: [],
      productId: '',
      isLoadingItem: '',
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      cart: {},
    };
  },
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  methods: {
    getProducts() {
      axios
        .get(`${url}/api/${apiPath}/products/all`)
        .then((res) => {  
          console.log(res);
          this.products = res.data.products;
        })
    },
    openProductModal(id) {
      this.productId = id;
      this.$refs.productModal.openModal();
    },
    getCart() {
      axios
        .get(`${url}/api/${apiPath}/cart`)
        .then((res) => {  
          console.log(res);
          this.cartData = res.data.data;
        }).catch((err) => {
          alert(err.data.message);
        });
    },
    addToCart(id, qty = 1) {
      const data = {
        product_id: id,
        qty,
      };
      this.isLoadingItem = id;
      axios
        .post(`${url}/api/${apiPath}/cart`, { data })
        .then((res) => {  
          console.log(res);
          this.getCart();
          this.$refs.productModal.closeModal();
          this.isLoadingItem = '';
        }).catch((err) => {
          alert(err.data.message);
        });
    },
    removeCartItem(id) {
      this.isLoadingItem = 'id';
      axios
        .delete(`${url}/api/${apiPath}/cart/${id}`)
        .then((res) => {  
          this.getCart();
          this.isLoadingItem = '';
        }).catch((err) => {
          alert(err.data.message);
        });
    },
    updateCartItem(item) {
      const data = {
        product_id: item.id,
        qty: item.qty,
      };
      this.isLoadingItem = item.id;
      axios
        .put(`${url}/api/${apiPath}/cart/${item.id}`, { data })
        .then((res) => {  
          console.log(res);
          this.getCart();
          this.isLoadingItem = '';
        }).catch((err) => {
          alert(err.data.message);
        });
    },
    removeAllCartItem() {
      axios
        .delete(`${url}/api/${apiPath}/carts`)
        .then((res) => {  
          console.log(res);
          this.getCart();
        }).catch((err) => {
          alert(err.data.message);
        });
    },
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
})

app.component('product-modal', {
  props: ['id'],
  template: '#userProductModal',
  data() {
    return {
      modal: {},
      product: {},
      qty: 1,
    };
  },
  watch: {
    id() {
      this.getProduct();
    },
  },
  methods: {
    openModal() {
      this.modal.show();
    },
    closeModal() {
      this.modal.hide();
    },
    getProduct() {
      axios
        .get(`${url}/api/${apiPath}/product/${this.id}`)
        .then((res) => {  
          console.log(res);
          this.product = res.data.product;
        })
    },
    addToCart() {
      this.$emit('add-cart', this.product.id, this.qty);
    }
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal); 
  },
});

app.mount('#app');
