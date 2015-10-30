Ext.define('DDC.store.DeviceProfile', {
    extend: 'Ext.data.Store',

    alias: 'store.deviceprofile',

    fields : ['id', 'value'],

    proxy: {
        type: 'ajax',
        url: '/devicesprofile/notebook',
        reader: {
            type: 'json',
            rootProperty: function(data) { return data.profile; }
        }
    }
});
