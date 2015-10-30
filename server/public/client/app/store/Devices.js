Ext.define('DDC.store.Devices', {
    extend: 'Ext.data.Store',

    alias: 'store.devices',

    model: 'DDC.model.Device',

    sorters : {
        property : 'name',
        dir : 'ASC'
    },

    proxy: {
        type: 'ajax',
        url: '/listdevices',
        reader: {
            type: 'json',
            rootProperty: function(data) { return data.devices; }
        }
    }
});
