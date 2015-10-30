/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting causes an instance of this class to be created and
 * added to the Viewport container.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('DDC.view.main.Main', {
    extend: 'Ext.Panel',
    xtype: 'app-main',

    requires: [
        'DDC.view.main.MainController',
        'DDC.view.main.MainModel',
        'DDC.view.main.DeviceList'
    ],

    controller: 'main',
    viewModel: 'main',
    layout : 'fit',

    title : "Умная розетка (SkyNet 0.0.1 alpha)",

    items: [{
        reference : 'devicelist',
        xtype     : 'devicelist'
    }],

    dockedItems : [{
        xtype : 'toolbar',
        dock  : 'bottom',
        items : [{
            xtype     : 'button',
            reference : 'detect',
            text      : 'Определить устройство',
            cls       : 'detect-device-button',
            enableToggle : true
        }, '->', {
            xtype     : 'button',
            reference : 'train',
            text      : 'Тренировать сеть',
            cls       : 'train-network'
        }, '->', {
            xtype     : 'button',
            reference : 'adddevice',
            text      : 'Добавить устройство',
            cls       : 'add-device-button'
        }]
    }]
});
