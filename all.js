//declaration
const uid = "xeGhVkOgVLQdyvwREUA9qp84YDV2";
const api_path = "yzchen";
let productArray = [];
let cartArray = [];
let cartId = "";
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



//init
function init(){
    getProduct();
    getCart();
}
init();




//product
function getProduct() {
    axios.get(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/products`).
    then((response) => {
        productArray = response.data.products;
        categoryArray = getCategory();
        concatProductDisplay(productArray);
        setCategorySelect(categoryArray);
    }).then(()=>{
        addCartBtn = document.querySelector(".productWrap");
        addCartBtn.addEventListener('click',(e)=>{
                e.preventDefault();
                e.stopPropagation();
                if(e.target.getAttribute("class") !== "addCardBtn"){return;}
                console.log(e.target.getAttribute("data-id"));
                itemToCart.data.productId = e.target.getAttribute("data-id");
                itemToCart.data.quantity =1;
                addCart(itemToCart);
            }
        );
    });
}
function concatProductDisplay(productsArray){
    let content = "";
    productsArray.forEach(item =>{
        str = `<li class="productCard" data-id = ${item.id}>
            <h4 class="productType">新品</h4>
            <img src=${item.images} alt="">
            <a href="#" class="addCardBtn" data-id = ${item.id}>加入購物車</a>
            <h3>${item.title}</h3>
            <del class="originPrice">NT$${item.origin_price}</del>
            <p class="nowPrice">NT$${item.price}</p>
        </li>`
        content += str;
    })
    productDisplay.innerHTML = content;
}
function getCategory(){
    let rowCategory = [];
    productArray.forEach(item =>{rowCategory.push(item.category)});
    return Array.from(new Set(rowCategory));
}
function setCategorySelect(categoryArray){
    let content = "";
    categoryArray.forEach(function (item){
        str = `<option value=${item}>${item}</option>`;
        content += str;
    });
    const defaultOption =`<option value="全部" selected>全部</option>`
    productSelect.innerHTML = defaultOption + content;
}
productSelect.addEventListener('change',()=> {
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
        then(() =>{
            itemToCart.data.productId = "";
        }).then(()=>init());
}




//cart
function getCart(){
    axios.get(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`).
    then((response)=>{
        cartArray = response.data.carts;
        totalPrice = response.data.finalTotal;
        cartId = response.data.carts.id;
        concatCartDisplay(cartArray);
        toggleForm();
    }).then(()=>{
        const deleteAllBtn = document.querySelector(".discardAllBtn");
        deleteAllBtn.addEventListener('click', (e)=>{
            e.preventDefault();
            deleteAll();
        });
        cartDisplay.addEventListener('click', (e)=>{
            e.preventDefault();
            if(e.target.getAttribute('class') !== "material-icons"){return}
            let item = e.target.getAttribute("data-id");
            deleteCertainItem(item);
        });

    });
}
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
        str = `<tr data-id = ${item.product.id}>
                <td>
                    <div class="cardItem-title">
                        <img src=${item.product.images} alt="">
                        <p>${item.product.title}</p>
                    </div>
                </td>
                <td>NT$${item.product.price}</td>
                <td>${item.quantity}</td>
                <td>NT$${item.product.price * item.quantity}</td>
                <td class="discardBtn" data-id=${item.id}>
                    <a href="#" class="material-icons" data-id=${item.id}>
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
function deleteAll(){
    axios.delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`).
    then((response)=>{
        console.log(response)
    }).then(()=>init());
}
function deleteCertainItem(cartId){
    axios.delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts/${cartId}`).
        then(()=>init());
}





//AJAX form editing
const customerName = document.querySelector("#customerName");
const customerPhone = document.querySelector("#customerPhone");
const customerEmail = document.querySelector("#customerEmail");
const customerAddress = document.querySelector("#customerAddress");
const errorMsg = "必填";
customerName.addEventListener('blur',(e)=>{
    if(customerName.value === ""){
        document.querySelector("#orderInfo-message-name").textContent = errorMsg;
    }else{
        document.querySelector("#orderInfo-message-name").textContent ="";
    }
});
customerPhone.addEventListener('blur',(e)=>{
    if(customerPhone.value === ""){
        document.querySelector("#orderInfo-message-phone").textContent = errorMsg;
    }else{
        document.querySelector("#orderInfo-message-phone").textContent ="";
    }
});
customerEmail.addEventListener('blur',(e)=>{
    if(customerEmail.value === ""){
        document.querySelector("#orderInfo-message-mail").textContent = errorMsg;
    }else{
        document.querySelector("#orderInfo-message-mail").textContent ="";
    }
});
customerAddress.addEventListener('blur',(e)=>{
    if(customerAddress.value === ""){
        document.querySelector("#orderInfo-message-address").textContent = errorMsg;
    }else{
        document.querySelector("#orderInfo-message-address").textContent ="";
    }
});


//form submit
const form = document.querySelector("#orderInfo")
const submitBtn = document.querySelector(".orderInfo-btn");
function toggleForm(){
    if(cartArray.length === 0){
        form.style.display = "none";
    }else{
        form.style.display = "block";
    }
}
function formSubmit(newData) {
    axios.post(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/orders`, newData).
    then((response)=>{
        if(response.status === 200){
            alert("訂單成功");
            clearAllField();
            console.log(response)
        }else{
            alert("qq 訂單失敗，請重新再試");
            console.log(response)
        }
        console.log(response)
    }).then(()=>init());
}
function validation(item){
    return !(item.name === "" || item.tel === "" || item.email === "" || item.address === "" );
}
function clearAllField(){
    customerName.value = "";
    customerPhone.value = "";
    customerEmail.value = "";
    customerAddress.value = "";
}
submitBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    let name = customerName.value;
    let tel = customerPhone.value;
    let email = customerEmail.value;
    let address = customerAddress.value;
    let paymentType = document.querySelector("#tradeWay").value;
    let newData = {
        data:{
            user:{
                name : name,
                tel : tel,
                email : email,
                address : address,
                payment : paymentType
            }
        }
    }
    if(validation(newData.data.user)){
        formSubmit(newData);
    }else{
        alert("請確定填寫所有資料");
    }
});

