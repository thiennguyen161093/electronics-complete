var product = product || {};


product.productList = function(){
    $.ajax({
        url: page.urls.selectAllProduct,
        method:'GET',
        success: function(response){
            $('.table-product tbody').empty();
            response = response.sort(function(pdt1, pdt2){
                return pdt2.id - pdt1.id;
            })
            $.each(response, function(index, item){
                $('.table-product tbody').append(`
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.productName}</td>
                        <td>${item.serialNumber}</td>
                        <td>${item.serviceTag}</td>
                        <td>${item.purchaseDay}</td>
                        <td>${item.customer.customerFullName}</td>
                        <td>
                            <a href='javascript:;' class='btn btn-success btn-sm'
                                title='Add Bill'
                                onclick="customer.addBill(${item.id})">
                                <i class="fa fa-plus"></i>
                            </a>
                        </td>
                    </tr>
                    `);
            });
            $('.table-product').DataTable({
                // columnDefs: [
                //     { orderable: false, targets: [6,7] },
                //     { searchable: false, targets: [0,6,7] }
                // ],
                // order: [[0, 'desc']]
            });

        }
    })
}

product.showModal = function(){
    product.reset();
    $('#productModal').modal('show');
}

product.save = function(){
    if($('#productForm').valid()){
        let productId = parseInt($('input[name="productId"]').val());
        if(productId == 0){
            let createObj = {};
            createObj.productName = $('input[name="productName"]').val();
            createObj.productDescription = $('input[name="productDescription"]').val();
            createObj.serviceTag = $('input[name="serviceTag"]').val();
            createObj.serialNumber = $('input[name="serialNumber"]').val();
            createObj.customer = {"id": $("#customerId").val()};
            let numberMonth = $('input[name="numberMonth"]').val();
            $.ajax({
                url:page.urls.saveNewProduct + "/" + numberMonth,
                method: "POST",
                contentType:"application/json",
                datatype :"json",
                data: JSON.stringify(createObj),
                success: function(){
                    $('#productModal').modal('hide');
                    product.reset();
                    $.notify("S???n Ph???m ???? ???????c t???o th??nh c??ng!", "success");
                },
                error: function () {
                    $.notify("S???n ph???m ???? b??? tr??ng Serial Number, xin nh???p l???i", "error");
                },
                fail: function (){
                    $.notify("S???n Ph???m t???o th???t b???i!", "error");
                }
            })
        }
    }
}
product.search = function () {
    let serialNumber = $('#search-keyword').val();
    if (serialNumber === "") {
        App.showErrorAlert("Kh??ng T??m Th???y S???n Ph???m!");
    } else {
        $.ajax({
            url: page.urls.searchProductBySerialNumber + serialNumber,
            method: 'GET',
            success: function (data) {
                console.log(data);
                if (data.length === 0) {
                    App.showSuccessAlert("Kh??ng T??m Th???y S???n Ph???m!");
                } else {
                    if (data[0].status === 0) {
                        let content = "";
                        $.ajax({
                            url: page.urls.getRemainingDay + serialNumber,
                            method: 'GET',
                            success: function (dataCSKH) {
                                console.log(dataCSKH[0].remainingDay);
                                for (let i = 0; i < data.length; i++) {
                                    $('#customerFullName').text(data[i].customer.customerFullName);
                                    content += `<tr>
                                <td id="serialNumber">${data[i].serialNumber}</td>
                                <td>${data[i].productName}</td>
                                <td>${data[i].serviceTag}</td>
                                <td>${data[i].purchaseDay}</td>
                                <td>${dataCSKH[0].remainingDay}</td>
                                <td>${data[i].productDescription}</td>
                                <td><a href='javascript:;' class='btn btn-success btn-sm'
                                        title='Add Bill'
                                        onclick="bill.getProductHome(${data[0].id})">
                                        <i class="fa fa-plus"></i>
                                    </a>
                                </td>
                            </tr>`
                                }
                                $('#table-search-product tbody').html(content); // show d??? li???u khi tr??? v???
                                console.log(data[0].status);
                                $('#viewSearchProductModal').modal('show');
                            }
                        })
                    } else {
                        let content = "";
                        $.ajax({
                            url: page.urls.getRemainingDay + serialNumber,
                            method: 'GET',
                            success: function (dataCSKH) {
                                for (let i = 0; i < data.length; i++) {
                                    $('#customer-full-name').text(data[i].customer.customerFullName);
                                    content += `<tr>
                                        <td id="serialNumber">${data[i].serialNumber}</td>
                                        <td>${data[i].productName}</td>
                                        <td>${data[i].serviceTag}</td>
                                        <td>${data[i].purchaseDay}</td>
                                        <td>${dataCSKH[0].remainingDay}</td>
                                        <td>${data[i].productDescription}</td>
                                    </tr>`
                                }
                                $('#table-search tbody').html(content); // show d??? li???u khi tr??? v???
                                console.log(data[0].status);
                                $('#viewSearchModal').modal('show');
                            }
                        })
                    }
                }
            }
        });
    }
}

product.isUndefined = function (value) {
    return value === undefined || value === null
}
product.showModalSearchInput = function () {
    product.resetSearchInput();
    // $('#viewSearchProductModal').modal('show');
}

product.resetSearchInput = function(){
    $(':reset').wrap('<input type="text" name="search" id="search-keyword" class="search search-common-input" placeholder=\' Nh???p M?? S???n Ph???m ho???c T??? Kh??a\' title=\'Nh???p Model c???a b???n # ho???c T??m ki???m th??ng tin. G???i ?? t??m ki???m s??? ???????c m???.\'  maxlength="100" />')
    // $('#reset-search-keyword':reset)[0].reset;
}

product.reset = function(){
    $('#productForm').validate().resetForm();
    $('#productForm')[0].reset();
}

product.init = function(){
    product.productList();
}

$(document).ready(function(){
    product.init();
});