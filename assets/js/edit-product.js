submitEditPrdData = (rowId) => {
    let prdName = $('#edit-form').find('#editPrdName').val()
    let prevPrdName = $('#edit-form').find('#prevPrdName').val()

    let prdCode = $('#edit-form').find('#editPrdCode').val()
    let prevPrdCode = $('#edit-form').find('#prevPrdCode').val()

    let prdCategory = $('#edit-form').find('#editPrdCategory').val()

    let prdUnit = $('#edit-form').find('#editPrdUnit').val()

    let prdLocation = $('#edit-form').find('#editPrdLocation').val()

    let prdBuyPrice = $('#edit-form').find('#editPrdBuyPrice').val()
    let prevPrdBuyPrice = $('#edit-form').find('#prevPrdBuyPrice').val()

    let prdSellPrice = $('#edit-form').find('#editPrdSellPrice').val()
    let prevPrdSellPrice = $('#edit-form').find('#prevPrdSellPrice').val()

    let prdInitialStock = $('#edit-form').find('#editPrdInitialStock').val()
    let prevPrdInitialStock = $('#edit-form').find('#prevPrdInitialStock').val()

    let prdIncomingStock = $('#edit-form').find('#editPrdIncomingStock').val()
    let prevPrdIncominglStock = $('#edit-form').find('#prevPrdIncomingStock').val()

    if (prdName === "" || prdSellPrice === "") {
        dialog.showMessageBoxSync({
            title: 'Alert',
            type: 'info',
            message: 'Nama produk dan Harga Jual harus terisi'
        })
    } 
    else {
        if (prdName === prevPrdName) {
            if (prdCode === "" || prdCode === prevPrdCode) {
                executeEditPrdData(rowId)
            } else {
                sql = `select count(*) as count from produk where kode_produk = ${prdCode}`
                db.all(sql, (err, row) => {
                    if(err) throw err
                    let rowNumber = row[0].count
                    if(rowNumber < 1){
                        executeEditPrdData(rowId)
                    } else {
                        dialog.showMessageBox({
                            title: 'Alert',
                            type: 'info',
                            message: 'Code \''+prdCode+'\' has already existed in the table'
                        })
                    }
                })
            }
        }
        else {
            let sql = `select count(*) as count from produk where nama_produk = '${prdName}'`
            db.all(sql, (err, result) => {
                if(err){
                    console.log(err)
                }
                else {
                    let rowNumber = result[0].count
                    if(rowNumber < 1){
                        if(prdCode === "" || prdCode === prevPrdCode){
                            executeEditPrdData(rowId)
                        } else {
                            let sql = `select count(*) as count from produk where kode_produk = "${prdCode}"`
                            db.all(sql, (err, row) => {
                                if (err) throw err
                                let rowNumber = row[0].count
                                if(rowNumber < 1){
                                    executeEditPrdData(rowId)
                                } else {
                                    dialog.showMessageBoxSync({
                                        title: 'Alert',
                                        type: 'info',
                                        message: 'Code \''+prdCode+'\' has already existed in the table'
                                    })
                                }
                            })
                        }
                    }
                    else {
                        dialog.showMessageBoxSync({
                            title: 'Alert',
                            type: 'info',
                            message: prdName + ' has already existed in the table'
                        })
                    }
                }
            })
        }
    }
}

executeEditPrdData = (rowId) => {

    let prdName = $('#edit-form').find('#editPrdName').val()

    let prdCode = $('#edit-form').find('#editPrdCode').val()

    let prdCategory = $('#edit-form').find('#editPrdCategory').val()

    let prdUnit = $('#edit-form').find('#editPrdUnit').val()

    let prdLocation = $('#edit-form').find('#editPrdLocation').val()

    let prdBuyPrice = $('#edit-form').find('#editPrdBuyPrice').val()

    let prdSellPrice = $('#edit-form').find('#editPrdSellPrice').val()

    let prdInitialStock = $('#edit-form').find('#editPrdInitialStock').val()

    let prdIncomingStock = $('#edit-form').find('#editPrdIncomingStock').val()

    if(prdSellPrice === ""){
        dialog.showMessageBoxSync({
            title: 'Alert',
            type: 'info',
            message: 'Harga jual harus diisi'
        })
    } else if(prdBuyPrice === ""){
        dialog.showMessageBoxSync({
            title: 'Alert',
            type: 'info',
            message: 'Harga pokok/beli harus diisi'
        })
    } else if(prdBuyPrice > prdSellPrice){
        dialog.showMessageBoxSync({
            title: 'Alert',
            type: 'info',
            message: 'Harga jual berada dibawah harga pokok/beli'
        })
    } else {

        let query = `update produk set nama_produk = '${prdName}', kode_produk = '${prdCode}', kategori = '${prdCategory}', satuan = '${prdUnit}', lokasi = '${prdLocation}', harga_beli = ${prdBuyPrice}, harga_jual = ${prdSellPrice}, stok_awal = ${prdInitialStock}, produk_masuk = ${prdIncomingStock} where id = ${rowId}`

        db.run(query, err => {
            if(err) throw err
            ipcRenderer.send('update:success', doc_id)
        })
    }
}