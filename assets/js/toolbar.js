openFormAddData = () => {
    $('#form-add-data').addClass('active')
    $('#product_name').focus()
    loadCategoryOption()
    loadUnitOption()
}


closeFormAddData = () => {
    $('#form-add-data').removeClass('active')
}

function deleteAction(id=false, data=false) {
    let msg = `Are you sure you want to delete ${data}`
    // cek apakah id ada pada parameter fungsi
    if(id){
        let dialogBox = dialog.showMessageBoxSync({
            type: 'question',
            title: 'Delete records',
            buttons: ['No', 'Yes'],
            defaultId: [0,1],
            message: msg
        })
        if(dialogBox === 0 ){
            $('input.data-checkbox').prop("checked", false)
            $('tbody#data tr').removeClass('blocked')
        } else {
            deleteRecord(id)
        }
    }
    else {
        array_ids = []
        $('input.data-checkbox:checked').each(function(){
            let ids = $(this).attr('id')
            array_ids.push(ids)
        })
        if (array_ids.length < 1) {
            dialog.showMessageBoxSync({
                title: 'Alert',
                type: 'info',
                message: 'Anda tidak memilih satupun data'
            })
        } else{
            let msgBox = dialog.showMessageBoxSync({
                type: 'question',
                title: 'Delete records',
                buttons: ['No', 'Yes'],
                defaultId: [0,1],
                message: 'Yakin untuk menghapus data yang dipilih ?'
            })
            if(msgBox === 0){
                console.log('No')
                $('input.data-checkbox').prop("checked", false)
            } else{
                join_array_ids = array_ids.join(",")
                deleteMultipleRecords(join_array_ids)
            }
        }
    }
}