
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
                            <input type="checkbox" id="${row.id}" class="data-checkbox">
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
                            <button class="btn btn-sm btn-light btn-light-bordered"><i class="fa fa-edit"></i></button>
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
                        db.each(`select id from produk where nama_produk = '${nama_produk}'`, (err, row) => {
                            if(err) throw err
                            db.run(`update produk set kode_produk = 'PR'||substr('000000'||${row.id},-6,6) where nama_produk = '${nama_produk}'`, err => {
                                if(err) throw err
                                blankForm()
                                $('#product_name').focus()
                                load_data()
                            })
                        })
                        // blankForm()
                        // $('#product_name').focus()
                        // load_data()
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