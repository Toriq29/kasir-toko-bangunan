let doc_id
let id

ipcRenderer.on('res:form', (e, editDocId, editForm, rowId) => {
    $('#edit-form').html(editForm)
    doc_id = editDocId
    id = rowId
})