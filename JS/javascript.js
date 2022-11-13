//------------------------------------------------------------------------------------------------------
//Bond: the cost for a courtesy phone (and charger) only if the customer is a “consumer” type.
//      If customer is "business", no bond is required.
//------------------------------------------------------------------------------------------------------
//Assume there is a list of courtesy items as below:
let courtesyList = [{item: 'iPhone', bond: 275},
					{item: 'otherPhone', bond: 100},
					{item: 'charger', bond: 30}
				   ];
				   
//We will use "appState" object to track the form change when users interact with the app			   
let appState = {customerType: 'consumer',
				courtesyPhone: {item: 'none', bond: 0 },//Allow to borrow ONLY 1 phone
				courtesyCharger: {item: 'none', bond: 0},//Allow to borrow ONLY 1 charger
				cost: {bond: 0 , serviceFee: 85.00, totalFee: 0, gst: 0, totalAndGstFee: 0},
				date: {datePurchase: new Date(1, 0, 2020), dateRepair: new Date()}
			  };	

//------------------------------------------------------------------------------------------------------
//Date Validation
//------------------------------------------------------------------------------------------------------
//Setup date variable
let dateToday = new Date();
//Validate purchase date
$("#purchaseDate").change(function(){
	appState.date.datePurchase = new Date($(this).val());
	//alert(appState.date.datePurchase.getTime()); //To test that I am getting the right timestamp
	if (appState.date.datePurchase.getTime() > dateToday.getTime()){
		alert("You cannot purchase the item after today."); //To alert user that purchase date cannot be in the future
		$(this).val("");
	}else if (appState.date.datePurchase.getTime() > appState.date.dateRepair.getTime()){
		alert("Purchase date needs to before repair date, try setting repair date first.");
		$(this).val("");
	}else {
		//alert("Valid date inputted.");
	}
	//Disable and set warranty button to false if purchase over 2 years ago
	if (dateToday.getTime() - appState.date.datePurchase.getTime() > 63113852000){
		$('#warranty').prop("checked", false);
		$('#warranty').attr("disabled", true);
		//alert("warranty disabled")
	}else {
		alert("Please select the checkbox below if the item is still under warranty")
		$('#warranty').removeAttr("disabled");
	}
});

//Validate repair date
$("#repairDate").change(function(){
	appState.date.dateRepair = new Date($(this).val());
	//alert(appState.date.dateRepair); //To test that I am getting the right timestamp
	if (appState.date.dateRepair.getTime() > dateToday.getTime()){
		alert("You cannot repair the item after today."); //To alert user that purchase date cannot be in the future
		$(this).val("");
	}else if (appState.date.dateRepair.getTime() < appState.date.datePurchase.getTime()){
		alert("Repair date needs to be after the purchase date.");
		$(this).val("");
	}else {
		alert("Valid date inputted.")
	}
});
//------------------------------------------------------------------------------------------------------
//Service Fee: $85 if the customer’s phone is "not warranty", else $0.00
//------------------------------------------------------------------------------------------------------
$('#warranty').change(
    function(){
        if (this.checked) {
            $("#serviceFee").val(0.00);
			appState.cost.serviceFee = 0;
        }else {
            $("#serviceFee").val(85.00);
			appState.cost.serviceFee = 85.00;
        }
		//Update total appStates
		appState.cost.totalFee = appState.cost.bond + appState.cost.serviceFee;
		appState.cost.gst = appState.cost.totalFee*0.15;
		appState.cost.totalAndGstFee = appState.cost.totalFee + appState.cost.gst;
		//Update total elements
		$("#totalFee").val(appState.cost.totalFee);
		$("#gst").val(appState.cost.gst);	
		$("#totalAndGstFee").val(appState.cost.totalAndGstFee);
    });
			  
//Click "Add" button Event
$("#addBtn").click(function(e){
	e.preventDefault();
	//Get the selected item
	let selectedItemText = $("#itemList").find(":selected").text();
	let selectedItemValue = $("#itemList").find(":selected").val();
	let selectedItemBond = courtesyList.find(foundItem => foundItem.item.toLowerCase() == selectedItemValue.toLowerCase()).bond;
	
	//Build HTML code of this item
	let newRow = `
				<tr class="newSelectedItem">
					<td>${selectedItemText}</td>
					<td>${selectedItemBond}</td>
				</tr>
	`;
	
	//Check if item being added has already been added and add if it hasn't already
	if(appState.courtesyPhone.item == "none" && selectedItemValue.toLowerCase().includes("phone")) {
		$("#borrowItems").append(newRow);
		//Update appState
		appState.courtesyPhone.item = selectedItemValue;
		appState.courtesyPhone.bond = selectedItemBond;
		appState.cost.bond = appState.courtesyPhone.bond + appState.courtesyCharger.bond;
		//Update the "bond" element
		if($("#customerType").is(":checked")){
			$("#bond").val(appState.cost.bond);
		} else {
			$("#bond").val(0);
		}
	} else if(appState.courtesyCharger.item == "none" && selectedItemValue.toLowerCase().includes("charger")) {
		$("#borrowItems").append(newRow);
		//Update appState
		appState.courtesyCharger.item = selectedItemValue;
		appState.courtesyCharger.bond = selectedItemBond;
		appState.cost.bond = appState.courtesyPhone.bond + appState.courtesyCharger.bond;
		//Update the "bond" element
		if($("#customerType").is(":checked")){
			$("#bond").val(appState.cost.bond);
		} else {
			$("#bond").val(0);
		}
	} else {
		alert("The selected item was already added")
	}
	//Update total appStates
	appState.cost.totalFee = appState.cost.bond + appState.cost.serviceFee;
	appState.cost.gst = appState.cost.totalFee*0.15;
	appState.cost.totalAndGstFee = appState.cost.totalFee + appState.cost.gst;
	//Update total elements
	$("#totalFee").val(appState.cost.totalFee);
	$("#gst").val(appState.cost.gst);	
	$("#totalAndGstFee").val(appState.cost.totalAndGstFee);
});

//Click "Remove" button Event
$("#removeBtn").click(function(e){
	//Prevent all default actions attaced to this button
	e.preventDefault();
	
	//Remove all added rows
	$(".newSelectedItem").remove();
	
	//Update the appState
	appState.courtesyPhone = {item: 'none', bond: 0};
	appState.courtesyCharger = {item: 'none', bond: 0};
	appState.cost.bond = 0
	
	//Update bond
	$("#bond").val(appState.cost.bond);
	
	//Update total appStates
	appState.cost.totalFee = appState.cost.bond + appState.cost.serviceFee;
	appState.cost.gst = appState.cost.totalFee*0.15;
	appState.cost.totalAndGstFee = appState.cost.totalFee + appState.cost.gst;
	//Update total elements
	$("#totalFee").val(appState.cost.totalFee);
	$("#gst").val(appState.cost.gst);	
	$("#totalAndGstFee").val(appState.cost.totalAndGstFee);
});

//Change "customer type" Event
$("#customerType").click(function(){
	appState.customerType = "customer";
	appState.cost.bond = appState.courtesyPhone.bond + appState.courtesyCharger.bond;
	$("#bond").val(appState.cost.bond);
	
	//Update total appStates
	appState.cost.totalFee = appState.cost.bond + appState.cost.serviceFee;
	appState.cost.gst = appState.cost.totalFee*0.15;
	appState.cost.totalAndGstFee = appState.cost.totalFee + appState.cost.gst;
	//Update total elements
	$("#totalFee").val(appState.cost.totalFee);
	$("#gst").val(appState.cost.gst);	
	$("#totalAndGstFee").val(appState.cost.totalAndGstFee);
});

$("#businessType").click(function(){
	appState.customerType = "business";
	appState.cost.bond = 0
	$("#bond").val(appState.cost.bond);

	//Update total appStates
	appState.cost.totalFee = appState.cost.bond + appState.cost.serviceFee;
	appState.cost.gst = appState.cost.totalFee*0.15;
	appState.cost.totalAndGstFee = appState.cost.totalFee + appState.cost.gst;
	//Update total elements
	$("#totalFee").val(appState.cost.totalFee);
	$("#gst").val(appState.cost.gst);	
	$("#totalAndGstFee").val(appState.cost.totalAndGstFee);
});

//Click Reset button Event
$("#reset").click(function(){
	//Remove all added rows
	$(".newSelectedItem").remove();
	
	//Update the appState
	appState.courtesyPhone = {item: 'none', bond: 0};
	appState.courtesyCharger = {item: 'none', bond: 0};
	appState.cost.bond = 0
});




//------------------------------------------------------------------------------------------------
//Advanced JS Section
//------------------------------------------------------------------------------------------------

//Collapsing Boxes
//Hide all content area when loading webpage
$(".content-demo-area div").hide();

//Loop through all buttons and add "click" event to each of them
//and also the logic: hide all the content sections and show only the according area
//highlight baackground and the clicked button
$(".btn-demo-area button").on("click", function(){
	//Set all button backgrounds to white
	$(".btn-demo-area button").css("background-color", "white")
	
	//Set the clicked button background to "orange" colour
	$(this).css("background-color", "orange")
	
	//Hide all the content areas
	$(".content-demo-area div").hide();
	
	//Show only the content area matching the clicked button
	$(".content-demo-area div").eq($(this).index()).show(1000);
});




//------------------------------------------------------------------------------------------------
//FAQ Section
//------------------------------------------------------------------------------------------------
let proxy = "https://cors-anywhere.herokuapp.com/";
let url = "http://danieldangs.com/itwd6408/json/faqs.json";

//User Jquery function "getJSON" to query this json file
$.getJSON(
	proxy + url,//send request to this url to get Json file	
	function(data){
		//Loop through all questions and extract them and display them on webpage
		$.each(data, function(i, question){//i: index, question
			//Extract question and answer
			let content = `
				<div class = "col-12 p-2 card ms-3 mt-2 p-3" style = "background: BlanchedAlmond">
					<h6>${question.question}</h6>
					<p>${question.answer}</p>
				</div>
			`;
			//append this question to the list
			$('#questions').append(content);
		});
		
	}//json file will be returned in "data"
);

//Search FAQ
$("#search-box").on("keyup", function(){
	//Get entered keywords
	let keywords = $(this).val().toLowerCase();
	//Loop through all questions/answers and find if this question/answer 
	//contains the keyword/s. If yes, show it, if not, hide it.
	
	$("#questions div").filter(function(){
		$(this).toggle($(this).html().toLowerCase().indexOf(keywords) > -1);
	});
});

