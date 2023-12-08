$(document).ready(() => {

    /**
     * Declare global variables
     */
    let products = [];
    let currentProduct;


    /**
     * Open the products.json file
     */

    $.ajax({
        url: "products.json?t=" + Date.now(),
        type: "GET",
        success: function(result){
            products = result;

            if(products.length >= 1) {
                fillTable(0);
                if(products.length > 1) {
                    $(".rightArrow").css("pointer-events","auto");
                    $(".rightArrow").css("background-color", "rgb(35, 61, 77)");
                }
            }else {
                $(".listedTable td, .tableHeader").text("N/A");
            }
        },
        error: function(error){
            console.log(`Error: ${error}`)
        }
    })


    /**
     * Set default settings
     */
    $(".arrow").css("pointer-events", "none");
    $(".arrow").css("background-color", "grey");

    $(".editProduct, .deleteProduct").css("pointer-events", "none");
    $(".editProduct, .deleteProduct").css("background-color", "grey");


    /** 
     * Make the form, description and the listing field appear/disappear
     */
    $(".addProductsMenuItem").click((e) => {
        e.preventDefault();

        let currentVisibility = $(".addProductsForm").css("visibility")
        if(currentVisibility === 'hidden'){
            $(".addProductsForm").css("visibility", "visible")

            //If the description field is active
            let descriptionVisibility = $(".descriptionField").css("visibility")
            if(descriptionVisibility === 'visible')
                $(".descriptionField").css("visibility", "hidden")

            //If the listing field is active
            let listingVisibility = $(".listProductsField").css("visibility")
            if(listingVisibility === 'visible')
                $(".listProductsField").css("visibility", "hidden")

        }else{
            $(".addProductsForm").css("visibility", "hidden")
        }
    });
    
    $(".listProductsMenuItem").click((e) => {
        e.preventDefault();

        let currentVisibility = $(".listProductsField").css("visibility")
        if(currentVisibility === 'hidden'){
            $(".listProductsField").css("visibility", "visible")

            //If the description field is active
            let descriptionVisibility = $(".descriptionField").css("visibility")
            if(descriptionVisibility === 'visible')
                $(".descriptionField").css("visibility", "hidden")

            //If the add form is active
            let addVisibility = $(".addProductsForm").css("visibility")
            if(addVisibility === 'visible')
                $(".addProductsForm").css("visibility", "hidden")
        }else{ 
            $(".listProductsField").css("visibility", "hidden")    
            
        }
    });

    $(".descriptionMenuItem").click((e) => {
        e.preventDefault();

        let currentVisibility = $(".descriptionField").css("visibility")
        if(currentVisibility === 'hidden'){
            $(".descriptionField").css("visibility", "visible")
            
            //If the listing field is active
            let listingVisibility = $(".listProductsField").css("visibility")
            if(listingVisibility === 'visible')
                $(".listProductsField").css("visibility", "hidden")

            //If the add form is active
            let addVisibility = $(".addProductsForm").css("visibility")
            if(addVisibility === 'visible')
                $(".addProductsForm").css("visibility", "hidden")
        }else 
            $(".descriptionField").css("visibility", "hidden")
    });


    /**
     * Add product to the list
     */
    $("#form").submit((e) => {
        e.preventDefault();

        let formData = {
            productID: products.length + 1,
            productName: $("#productName").val(),
            productManufacturer: $("#productManufacturer").val(),
            productType: $("#productType").val(),
            productExpiryDate: $("#productExpiryDate").val(),
            productQuantity: $("#productQuantity").val(),
            productPrice: $("#productPrice").val(),
            productSalePrice: $("#productSalePrice").val(),
        };


        $.ajax({
            type: "POST",
            url: "process.php",
            dataType: "json",
            data: formData
        }).done((data) => {
            if (data['success']) {
                products.push(formData);
                if (products.length === 1) {
                    fillTable(0);
                } else if (products.length > 1) {
                    $(".rightArrow").css("pointer-events", "auto");
                    $(".rightArrow").css("background-color", "rgb(35, 61, 77)");
                }

                $.post('modify.php',
                    { products: JSON.stringify(products) },
                    (result) => {
                        console.log(result);
                    },
                    'json');
            }
        });



    });


    /**
     * Fill table with the first product
     */
    function fillTable(index) {
        currentProduct = index;

        if(products.length > 0){
            $(".productNameRow td").text(products[currentProduct]['productName']);
            $(".productManufacturerRow td").text(products[currentProduct]['productManufacturer']);
            $(".productTypeRow td").text(products[currentProduct]['productType']);
            $(".productExpiryRow td").text(products[currentProduct]['productExpiryDate']);
            $(".productQuantityRow td").text(products[currentProduct]['productQuantity']);
            $(".productPriceRow td").text(products[currentProduct]['productPrice']);
            $(".productSalePriceRow td").text(products[currentProduct]['productSalePrice']);
            $(".tableHeader").text(`${currentProduct+1}. termék`);

            if(currentProduct === products.length-1) {
                $(".rightArrow").css("pointer-events","none");
                $(".rightArrow").css("background-color", "grey");
            }
            if(currentProduct === 0) {
                $(".leftArrow").css("pointer-events", "none");
                $(".leftArrow").css("background-color", "grey");
            }

            if(products.length === 0) {
                $(".editProduct, .deleteProduct").css("pointer-events", "none");
                $(".editProduct, .deleteProduct").css("background-color", "grey");

                $(".listedTable tr td").attr("contenteditable", "false");
                $(".listedTable tr td").removeClass("tdHighlight");
            }else {
                $(".editProduct, .deleteProduct").css("pointer-events", "auto");
                $(".editProduct, .deleteProduct").css("background-color", "rgb(35, 61, 77)");
            }
        }
    }



    /**
     * If left arrow is clicked
     */
    $(".leftArrow").click(() => {
        if(currentProduct > 0 ){
            currentProduct -= 1;
            fillTable(currentProduct);

            if(currentProduct < products.length-1) {
                $(".rightArrow").css("pointer-events", "auto");
                $(".rightArrow").css("background-color", "rgb(35, 61, 77)");
            } else if(currentProduct === 0){
                $(".leftArrow").css("pointer-events", "none");
                $(".leftArrow").css("background-color", "grey");
            }
        }
    });


    /**
     * If right arrow is clicked
     */
    $(".rightArrow").click(() => {
        if(products.length > currentProduct+1 ){
            currentProduct += 1;
            $(".productNameRow td").text(products[currentProduct]['productName']);
            $(".productManufacturerRow td").text(products[currentProduct]['productManufacturer']);
            $(".productTypeRow td").text(products[currentProduct]['productType']);
            $(".productExpiryRow td").text(products[currentProduct]['productExpiryDate']);
            $(".productQuantityRow td").text(products[currentProduct]['productQuantity']);
            $(".productPriceRow td").text(products[currentProduct]['productPrice']);
            $(".productSalePriceRow td").text(products[currentProduct]['productSalePrice']);

            if(currentProduct > 0) {
                $(".leftArrow").css("pointer-events","auto");
                $(".leftArrow").css("background-color", "rgb(35, 61, 77)");
                if(currentProduct+1 === products.length) {
                    $(".rightArrow").css("pointer-events","none");
                    $(".rightArrow").css("background-color", "grey");
                }
            }
        }
    });

    /*

     * If edit is clicked
     */

    $(".editProduct").click((editButton) => {

        const tdElements = $(".listedTable tr td");

        if($(editButton.target).text() === "Módosítás"){

            $(editButton.target).text("Mentés");

            tdElements.attr("contenteditable", "true");
            tdElements.addClass("tdHighlight");

        }else {

            tdElements.attr("contenteditable", "false");
            tdElements.removeClass("tdHighlight");

            $(editButton.target).text("Módosítás");

            products[currentProduct]['productName'] = $(".productNameRow td").text();
            products[currentProduct]['productManufacturer'] = $(".productManufacturerRow td").text();
            products[currentProduct]['productTypeRow'] = $(".productTypeRow td").text();
            products[currentProduct]['productExpiryDate'] = $(".productExpiryRow td").text();
            products[currentProduct]['productQuantity'] = $(".productQuantityRow td").text();
            products[currentProduct]['productPrice'] = $(".productPriceRow td").text();
            products[currentProduct]['productSalePrice'] = $(".productSalePriceRow td").text();


            $.post('modify.php',
                { products: JSON.stringify(products) },
                (result) => {
                    console.log(result);
                },
                'json');

        }

    });


    /**
     * If delete is clicked
     */

    $(".deleteProduct").click(() => {

        products.splice(currentProduct, 1);

        for (let i = currentProduct; i < products.length; i++) {
            products[i]['productID'] = products[i]['productID'] - 1;
        }
        if(products.length === 0){
            $(".listedTable td").text("N/A");

            $(".editProduct, .deleteProduct").css("pointer-events", "none");
            $(".editProduct, .deleteProduct").css("background-color", "grey");

            $(".listedTable tr td").attr("contenteditable", "false");
            $(".listedTable tr td").removeClass("tdHighlight");

            $(".listedTable tr").find("i").remove();
        }else if(currentProduct === products.length){
            fillTable(currentProduct-1);
        }else if(currentProduct < products.length){
            fillTable(currentProduct);
        }

        $.post('modify.php',
            { products: JSON.stringify(products) },
            (result) => {
                console.log(result);
            },
            'json');

    });

});
