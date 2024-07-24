let inputSellPrice = IMask(
    document.getElementById('sell_price'),
    {
        mask: 'Rp num',
        blocks: {
            num: {
                mask: Number,
                thousandsSeparator: '.',
                scale: 3,
                radix: ',',
                mapToRadix: ['.'],
                padFractionalZeros: false,
                signed: false
            }
        }
    }
)

let inputBuyPrice = IMask(
    document.getElementById('buy_price'),
    {
        mask: 'Rp num',
        blocks: {
            num: {
                mask: Number,
                thousandsSeparator: '.',
                scale: 3,
                radix: ',',
                mapToRadix: ['.'],
                padFractionalZeros: false,
                signed: false
            }
        }
    }
)

function loadProduct() {
    let query = `select * from produk`
    db.serialize( ()=> {
        db.all(query, (err, rows) => {
            if(err) throw err
            let tr = ''
            if(rows < 1 ) {
                tr += ''
            } else{
                rows.forEach( (row) => {
                    tr += `<tr data-id=${row.id}>
                        <td data-colname="Id">
                            <input type="checkbox" style="visibility:hidden" id="${row.id}" class="data-checkbox">
                        </td>
                        <td>${row.tanggal_input_edit}</td>
                        <td>${row.kode_produk}</td>
                        <td>${row.nama_produk}</td>
                        <td>${row.kategori}</td>
                        <td>${row.satuan}</td>
                        <td>${row.harga_beli}</td>
                        <td>${row.harga_jual}</td>
                        <td>${row.lokasi}</td>
                        <td>${row.stok_awal}</td>
                        <td>${row.produk_masuk}</td>
                        <td>${row.penjualan}</td>
                        <td>${row.stok_akhir}</td>
                        <td>
                            <button class="btn btn-sm btn-light btn-light-bordered" onclick="editRecord(${row.id})" id="edit-data" ><i class="fa fa-edit"></i></button>
                            <button class="btn btn-sm btn-danger" onclick="deleteAction(${row.id}, '${row.nama_produk}')" id="delete-data"><i class="fa fa-trash"></i></button>
                        </td>
                    </tr>`
                })
                
            }
            $('tbody#data').html(tr)
        })
    })
}

blankForm = () => {
    $('#product_name').val("")
    $('#product_code').val("")
    $('#product_category').val("")
    $('#product_unit').val("")
    $('#location').val("")
    $('#buy_price').val("")
    $('#sell_price').val("")
    $('#product_initial_stock').val("")
}

insertProduct = () => {
    let nama_produk = $('#product_name').val()
    let kode_produk = $('#product_code').val()
    let kategori = $('#product_category').val()
    let satuan = $('#product_unit').val()
    let lokasi = $('#location').val()
    let harga_beli = inputBuyPrice.unmaskedValue
    let harga_jual = inputSellPrice.unmaskedValue
    let stok_awal = $('#product_initial_stock').val()

    let required = $('[required]')
    let required_array = []
    required.each(function() {
        if($(this).val() != ""){
            required_array.push($(this).val())
        }
    })

    if(required_array.length < 7){
        dialog.showMessageBoxSync({
            title: 'Alert',
            type: 'info',
            message: 'Nama Produk, Harga Jual, dan Stok awal harus di isi'
        })

    } else {
        db.serialize(() => {
            db.each(`select count(*) as row_number from produk where nama_produk = '${nama_produk}'`, (err, res) => {
                if(err) throw err
                if(res.row_number < 1){
                    db.run(`insert into produk(nama_produk, kode_produk, kategori, satuan, lokasi, harga_jual, harga_beli, stok_awal, produk_masuk, penjualan, stok_akhir) values('${nama_produk}','${kode_produk}','${kategori}','${satuan}','${lokasi}','${harga_jual}','${harga_beli}','${stok_awal}',0,0,'${stok_awal}');`, err => {
                        if(err) throw err
                        // generate kode produk
                        // db.each(`select id from produk where nama_produk = '${nama_produk}'`, (err, row) => {
                        //     if(err) throw err
                        //     db.run(`update produk set kode_produk = 'PR'||substr('000000'||${row.id},-6,6) where nama_produk = '${nama_produk}'`, err => {
                        //         if(err) throw err
                        //         blankForm()
                        //         $('#product_name').focus()
                        //         load_data()
                        //     })
                        // })
                        blankForm()
                        $('#product_name').focus()
                        load_data()
                    })
                }
                else{
                    dialog.showMessageBoxSync({
                        title: 'Alert',
                        type: 'info',
                        message: 'Nama Produk sudah ada dalam database'
                    })
                    blankForm()
                }
            })
            
        })
    }
}

loadCategoryOption = () => {
    db.all(`select * from kategori order by id desc`, (err,rows) => {
        if(err) throw err
        let option = '<option value="">Kategori</option>'
        rows.map( (row) => {
            option+=`<option value="${row.kategori}">${row.kategori}</option>`
        })
        $('#product_category').html(option)
    })
}

loadUnitOption = () => {
    db.all(`select * from satuan order by id desc`, (err,rows) => {
        if(err) throw err
        let option = '<option value="">Satuan</option>'
        rows.map( (row) => {
            option+=`<option value="${row.satuan}">${row.satuan}</option>`
        })
        $('#product_unit').html(option)
    })
}

loadLocationOption = () => {
    db.all(`select * from lokasi order by id asc`, (err,rows) => {
        if(err) throw err
        let option = '<option value="">Lokasi</option>'
        rows.map( (row) => {
            option+=`<option value="${row.lokasi}">${row.lokasi}</option>`
        })
        $('#location').html(option)
    })
}

function selectUnitOption(unitOpt, unit) {
    let options = unitOpt.replace(`value="${unit}">`, `value="${unit}" selected>`)
    return options
}

function selectCategoryOption(categoryOpt, category) {
    let options = categoryOpt.replace(`value="${category}">`, `value="${category}" selected>`)
    return options
}

function selectLocationOption(locationOpt, location) {
    let options = locationOpt.replace(`value="${location}">`, `value="${location}" selected>`)
    return options
}

editPrdData = (id) => {
    let sqlUnits = `select * from satuan`
    let sqlCategory = `select * from kategori`
    let sqlLocation = `select * from lokasi`
    let sql = `select * from produk where id = ${id}`

    db.all(sqlUnits, (err, result) => {
        if(err){
            throw err
        } else {
            let unitOption
            let unitOpts = '<option></option>'
            result.forEach((item) => {
                unitOpts += `<option value="${item.satuan}">${item.satuan}</option>`
            })
            unitOption = unitOpts
            db.all(sqlCategory, (err, result) => {
                if (err) {
                    throw err
                } else {
                    let categoryOption
                    let categoryOpts = '<option></option>'
                    result.forEach((item) => {
                        categoryOpts += `<option value="${item.kategori}">${item.kategori}</option>`
                    })

                    categoryOption = categoryOpts

                    db.all(sqlLocation, (err, result) => {
                        if (err) {
                            throw err
                        } else {
                            let locationOption
                            let locationOpts = '<option></option>'
                            result.forEach((item) => {
                                locationOpts += `<option value="${item.lokasi}">${item.lokasi}</option>`
                            })

                            locationOption = locationOpts

                            db.all(sql, (err, result) => {
                                if (err) {
                                    throw err
                                } else {
                                    let row = result[0]
                                    let editForm
                                    editForm =  `
                                                <div class="mb-3">
                                                    <input type="text" value="${row.nama_produk}" id="editPrdName" placeholder="Nama Produk" class="form-control form-control-sm">
                                                    <input type="hidden" value="${row.nama_produk}" id="prevPrdName" >
                                                    <input type="hidden" value="${id}" id="rowId" >
                                                </div>
                                                <div class="mb-3">
                                                    <input type="text" value="${row.kode_produk}" id="editPrdCode" placeholder="Kode Produk" class="form-control form-control-sm">
                                                    <input type="hidden" value="${row.kode_produk}" id="prevPrdCode" >
                                                </div>
                                                <div class="mb-3">
                                                    <select id="editPrdCategory" class="form-select form-select-sm ">
                                                        ${selectCategoryOption(categoryOption, row.kategori)}
                                                    </select>
                                                </div>
                                                <div class="mb-3">
                                                    <select id="editPrdUnit" class="form-select form-select-sm ">
                                                        ${selectUnitOption(unitOption, row.satuan)}
                                                    </select>
                                                </div>
                                                <div class="mb-3">
                                                    <select id="editPrdLocation" class="form-select form-select-sm ">
                                                    ${selectLocationOption(locationOption, row.lokasi)}
                                                    </select>
                                                </div>
                                                <div class="mb-3">
                                                    <input type="text" value="${row.harga_beli}" id="editPrdBuyPrice" placeholder="Harga Beli" class="form-control form-control-sm">
                                                    <input type="hidden" value="${row.harga_beli}" id="prevPrdBuyPrice" >
                                                </div>
                                                <div class="mb-3">
                                                    <input type="text" value="${row.harga_jual}" id="editPrdSellPrice" placeholder="Harga Jual" class="form-control form-control-sm">
                                                    <input type="hidden" value="${row.harga_jual}" id="prevPrdSellPrice" >
                                                </div>
                                                <div class="mb-3">
                                                    <input type="text" value="${row.stok_awal}" id="editPrdInitialStock" placeholder="Stok AWal" class="form-control form-control-sm">
                                                    <input type="hidden" value="${row.stok_awal}" id="prevPrdInitialStock" >
                                                </div>
                                                <div class="mb-3">
                                                    <input type="text" value="${row.produk_masuk}" id="editPrdIncomingStock" placeholder="Produk Masuk" class="form-control form-control-sm">
                                                    <input type="hidden" value="${row.produk_masuk}" id="prevPrdIncomingStock" >
                                                </div>
                                                <div class="d-grid gap-2">
                                                    <button class="btn btn-sm btn-primary btn-block" onclick="submitEditPrdData(${id})" id="btn-submit-edit">
                                                        <i class="fa fa-paper-plane"></i>Submit
                                                    </button>
                                                </div>
                                                `
                                    ipcRenderer.send('load:edit', 'product-data', editForm, 300, 530, id)
                                }
                            })
                        }
                    })
                }
            })
        }

    })
}


ipcRenderer.on('update:success', (e, msg) => {
    alertSuccess(msg)
    load_data()
})