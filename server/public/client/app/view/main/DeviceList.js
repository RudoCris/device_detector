/**
 * This view is an example list of people.
 */
Ext.define('DDC.view.main.DeviceList', {
    extend: 'Ext.grid.Panel',
    xtype: 'devicelist',

    requires: [
        'DDC.store.Devices'
    ],

    store: {
        type: 'devices'
    },

    columns: [
        { text: 'Устройство',  dataIndex: 'name', flex : 1 },
        { text: 'Измерить', xtype : 'actioncolumn', align : 'center', width : 150, items : [{
            icon : '/resources/icon-measure.png',
            tooltip : 'Снять измерение',
            handler : function(view, row, col, item, e, record) {
                view.up('devicelist').fireEvent('measure-device', item, record);
            }
        }]},
        { text : 'Удалить', xtype : 'actioncolumn', align : 'center', width : 150, items : [{
            icon : '/resources/icon-remove.png',
            tooltip : 'Удалить устройство',
            handler : function(view, row, col, item, e, record) {
                view.up('devicelist').fireEvent('remove-device', item, record);
            }
        }]}
    ]
});
