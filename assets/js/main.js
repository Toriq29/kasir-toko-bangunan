let doc_id = $('body').attr('id')
load_data = () => {
    switch(doc_id){
        case 'product-data':
            loadProduct()
            break
    }
}

load_data()

deleteRecord = (id) => {
    let doc_id = $('body').attr('id')
    let table
    switch (doc_id) {
        case 'product-data':
            table = 'produk'
            break;
    }
    let sql = `delete from ${table} where id = ${id}`

    db.run(sql, err => {
        if(err){
            console.log(err)
        } else{
            console.log("masuk")
            load_data()
        }
    })
}


deleteAllRecords = () => {
    let doc_id = $('body').attr('id')
    switch (doc_id) {
        case "product-data":
            table = 'produk'
            break;
    
    }

    let sql = `delete from ${table}`
    db.run(sql, err => {
        if(err){
            console.log(err)
        } else{
            load_data()
        }
    })
}

deleteMultipleRecords = (ids) => {
    let doc_id = $('body').attr('id')
    switch (doc_id) {
        case "product-data":
            table = 'produk'
            break;
    
    }
    let sql = `delete from ${table} where id in(${ids})`
    db.run(sql, err => {
        if(err){
            console.log(err)
        } else{
            load_data()
        }
    })
}