const deleteButtonElements = document.querySelectorAll('.product-item button');

async function deleteProduct (event) {
    const buttonElement = event.target;
    const productID =buttonElement.dataset.productid;
    const csrfToken = buttonElement.dataset.csrf;
    
    const response = await fetch('/admin/products/' + productID + '?_csrf='+ csrfToken, {
        method: 'DELETE'
    } )

    if(!response.ok) {
        alert('Something went wrong!')
        return;
    }

    buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
    
}


for (const deleteButtonElement of deleteButtonElements) {
    deleteButtonElement.addEventListener('click', deleteProduct);
}