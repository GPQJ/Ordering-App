import menuArray from "/data.js";
const orderSummary = document.querySelector(".order-summary")
const orderList = orderSummary.querySelector(".order-list")
const orderTotalEl = orderSummary.querySelector(".summary-price")
const paymentForm = document.getElementById("payment-method-container")


//Create and render the menu
const menuElements = menuArray.map( item => `
	<article class="menu-item-container flex-space">
        <p class="item-emoji">${item.emoji}</p>
        <div class="item-description">
            <h2 class="item-name">${item.name}</h2>
            <p class="item-ingredients">${item.ingredients.join(", ")}</p>
            <p class="item-price padding">$${item.price}</p>
        </div>
        <button class="add-btn" data-action="add-item" data-id="${item.id}"aria-label="Add ${item.name} to order">+</button>
        </article>
`).join('')
 document.querySelector(".menu-container").innerHTML= menuElements

 let orderTotal = 0

 //Helper funcitons

 function clearOrder(element) { 
	element.remove()
		orderSummary.classList.add("invisible")
		orderTotal = 0
		orderList.innerHTML = ""
}


function sanitizeInput(input) {
	const div = document.createElement("div")
	div.textContent = input
	return div.innerHTML
}

 //Button functions 

function addItem(item){
	const ThankMsg = document.querySelector(".thanks-msg")
	ThankMsg && clearOrder(ThankMsg)

	orderSummary.classList.contains("invisible") && orderSummary.classList.remove("invisible")

	const listItemEl = `
        <li class="flex-space">
            <h2 class="item-name">${item.name}</h2>
            <button class="remove-btn" data-id="${item.id}" data-action="remove-item" aria-label>remove</button>
            <p class="summary-price">$${item.price}</p>
        </li>		
	`
	orderList.insertAdjacentHTML("beforeend", listItemEl)
	orderTotal += item.price 
	orderTotalEl.textContent = `$${orderTotal}`
}

function removeItem(itemEl, item) {
	itemEl.remove()
	orderTotal -= item.price
	orderTotalEl.textContent = `$${orderTotal}`

	orderList.children.length === 0 && orderSummary.classList.add("invisible")
}

function submitOrder(){
	paymentForm.classList.remove("invisible")
}

function submitPayment() {
	const cardName = document.getElementById("card-name").value
	const cardNumber = document.getElementById("card-number").value
	const cardCVV = document.getElementById("card-cvv").value
	const cardNumberPattern = /^\d{14,16}$/
	const cardCVVPattern = /^\d{3,4}$/

	if (!cardName || !cardNumber || !cardCVV) {
		alert("please fill out all required fields.")
		return
		}

	if (!cardNumberPattern.test(cardNumber) ){
		alert("Please enter a valid card number (14-16 digits).")
		return
	}

	if (!cardCVVPattern.test(cardCVV)) {
		alert("Please enter a valid CVV (3 or 4 digits).")
		return
	}

	paymentForm.classList.add("invisible")
	orderSummary.classList.add("invisible")

	const user = sanitizeInput(cardName)
	paymentForm.insertAdjacentHTML("beforebegin", 
		`<div class="thanks-msg centered" aria-live="polite">
        	Thanks, ${user} Your order is on its way!
    	</div>`)
}

// Event listeners

document.getElementById("payment-method-form").addEventListener("submit", function(event){event.preventDefault()})

document.addEventListener("click", function(event){
	const eventEl = event.target

	if(event.target.matches("button")) {
		const action = eventEl.getAttribute("data-action")
		const menuItem = menuArray.find(menuItem =>
			 menuItem.id === parseInt(eventEl.getAttribute("data-id")))

		switch (action){
			case "add-item":
				addItem(menuItem)
				break
			case "remove-item":
				const listEl = eventEl.closest("li")
				removeItem(listEl, menuItem)
				break
			case "submit-order":
				submitOrder()
				break
			case "submit-payment":
				submitPayment()
				break
		}
	}
})
