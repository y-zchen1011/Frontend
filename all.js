console.log("qqq");
const uid = "xeGhVkOgVLQdyvwREUA9qp84YDV2";
const api_path = "yzchen";
let productArray = [];
let cartArray = [];
let totalPrice = 0;
let categoryArray = [];
let str = "";
const productDisplay = document.querySelector(".productWrap");
const cartDisplay = document.querySelector(".shoppingCart-table");
const productSelect = document.querySelector(".productSelect");
let addCartBtn;
let itemToCart = {
    data:{
        productId: "",
        quantity: 0
    }
}

//const deleteAllBtn = document.querySelector(".discardAllBtn");
function init(){
    getProduct();
    getCart();
}
init();

//get Product
function getProduct() {
    axios.get(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/products`).
    then((response) => {
        console.log(response.data.products);
        productArray = response.data.products;
        categoryArray = getCategory();
        concatProductDisplay(productArray);
        setCategorySelect(categoryArray);
    }).then(()=>{
        addCartBtn = document.querySelector(".productWrap");
        addCartBtn.addEventListener('click',(e)=>{
            e.preventDefault();
            if(e.target.getAttribute("id") !== "addCardBtn"){
                console.log("No");
                return}
                console.log(e.target.getAttribute("data-id"));
                itemToCart.data.productId = e.target.getAttribute("data-id");
                itemToCart.data.quantity =1;
                addCart(itemToCart);
                getCart();
            }
        );
    });
}


//ProductDisplay V
function concatProductDisplay(productsArray){
    let content = "";
    productsArray.forEach(item =>{
        str = `<li class="productCard" data-id = ${item.id}>
            <h4 class="productType">新品</h4>
            <img src=${item.images} alt="">
            <a href="#" id="addCardBtn" data-id = ${item.id}>加入購物車</a>
            <h3>${item.title}</h3>
            <del class="originPrice">NT$${item.origin_price}</del>
            <p class="nowPrice">NT$${item.price}</p>
        </li>`
        content += str;
    })
    productDisplay.innerHTML = content;
}
//get Category
function getCategory(){
    let rowCategory = [];
    productArray.forEach(item =>{rowCategory.push(item.category)});
    return Array.from(new Set(rowCategory));
}
//set Category
function setCategorySelect(categoryArray){
    let content = "";
    categoryArray.forEach(function (item){
        str = `<option value=${item}>${item}</option>`;
        content += str;
    });
    const defaultOption =`<option value="全部" selected>全部</option>`
    productSelect.innerHTML = defaultOption + content;
}
/*selector action*/
productSelect.addEventListener('change',()=> {
    console.log(productSelect.value);
    if(productSelect.value === "全部"){
        init();
        getProduct();
    }else{
        productDisplay.innerHTML = "";
        concatProductDisplay(productArray.filter(item => item.category === productSelect.value))
    }
});

function addCart(item){
    axios.post(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`,item).
        then(response =>{
            console.log(response)
    })
}


//get Cart
function getCart(){
    axios.get(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`).
    then((response)=>{
        cartArray = response.data.carts;
        totalPrice = response.data.finalTotal;
        concatCartDisplay(cartArray);
        console.log("aktiv")
    });
}
//CartDisplay V
function concatCartDisplay(CartArray){
    let defaultHeaderText = `
               
                <tr>
                <th width="40%">品項</th>
                <th width="15%">單價</th>
                <th width="15%">數量</th>
                <th width="15%">金額</th>
                <th width="15%"></th>
                </tr>`;
    let content = "";
    CartArray.forEach(item =>{
        str = `<tr data-id = ${item.id}>
                <td>
                    <div class="cardItem-title">
                        <img src=${item.product.images} alt="">
                        <p>${item.product.title}</p>
                    </div>
                </td>
                <td>NT$${item.product.price}</td>
                <td>${item.quantity}</td>
                <td>NT$${item.product.price * item.quantity}</td>
                <td class="discardBtn">
                    <a href="#" class="material-icons">
                        clear
                    </a>
                </td>
                </tr>`
        content += str;
    })
    let defaultFooterText = `
                <tr>
                <td>
                    <a href="#" class="discardAllBtn">刪除所有品項</a>
                </td>
                <td></td>
                <td></td>
                <td>
                    <p>總金額</p>
                </td>
                <td>NT$${totalPrice}</td>
                </tr>
                `;
    cartDisplay.innerHTML = defaultHeaderText + content + defaultFooterText;
}

//delete All
function deleteAll(){
    axios.delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`).
    then((response)=>{
        console.log(response)
    });
    init();
}
//deleteAll();
//deleteAllBtn.addEventListener('click', deleteAll);
//deleteAllBtn.addEventListener('click', deleteAll);








