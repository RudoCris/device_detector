/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('DDC.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    requires : [
        'Ext.window.MessageBox'
    ],

    alias: 'controller.main',

    control : {
        'devicelist' : {
            'measure-device' : 'onMeasureDevice',
            'remove-device'  : 'onRemoveDevice',
            'select'         : 'onDeviceListSelect'
        },
        'button[reference=adddevice]' : {
            'click' : 'onAddDevice'
        },
        'button[reference=detect]' : {
            'toggle' : 'onDetectDeviceToggle'
        },
        'button[reference=train]' : {
            'click' : 'onTrainNetwork'
        }
    },

    detectTimerId : null,

    init : function() {
        var me = this,
            deviceList = me.lookupReference('devicelist'),
            deviceStore = deviceList.getStore();

        deviceStore.load();
    },

    onLaunch : function() {
        console.log('Launch');
    },

    onMeasureDevice : function(item, record) {
        var me = this,
            deviceList = me.lookupReference('devicelist'),
            deviceStore = deviceList.getStore();

        Ext.Ajax.request({
            url : '/sample/' + deviceStore.indexOf(record) + '/' + record.get('name'),
            success : function() {
                Ext.Msg.show({
                    title   : 'Измерение проведено',
                    message : 'Измерение для устройства ' + record.get('name') + ' успешно произведено!',
                    buttons : Ext.Msg.OK,
                    icon    : Ext.Msg.INFO
                });
            },
            failure : function() {
                Ext.Msg.show({
                    title : 'Ошибка произведения измерения',
                    message : 'При произведении измерения для устройства ' + record.get('name') + ' произошла ошибка',
                    buttons : Ext.Msg.OK,
                    icon    : Ext.Msg.ERROR
                });
            }
        });
    },

    onRemoveDevice : function(item, record) {
        var me = this,
            deviceList = me.lookupReference('devicelist'),
            deviceStore = deviceList.getStore(),
            name = record.get('name');

        Ext.Ajax.request({
            url : '/removedevice/' + name,
            success : function() {
                Ext.Msg.show({
                    title   : 'Устройство удалено',
                    message : 'Устройство ' + name + ' успешно удалено из сети.',
                    buttons : Ext.Msg.OK,
                    icon    : Ext.Msg.INFO
                });
                deviceStore.remove(record);
            },
            failure : function() {
                Ext.Msg.show({
                    title : 'Ошибка удаления устройства',
                    message : 'При удалении устройства ' + name + ' произошла ошибка',
                    buttons : Ext.Msg.OK,
                    icon    : Ext.Msg.ERROR
                });
            }
        });
    },

    onAddDevice : function() {
        var me = this,
            deviceList = me.lookupReference('devicelist'),
            deviceStore = deviceList.getStore();

        function addDeviceAjax(name, cb) {
             Ext.Ajax.request({
                url : '/adddevice/' + name,
                success : function() {
                    cb && cb();
                    Ext.Msg.show({
                        title   : 'Устройство добавлено',
                        message : 'Устройство ' + name + ' успешно добавлено в сеть.',
                        buttons : Ext.Msg.OK,
                        icon    : Ext.Msg.INFO
                    });
                },
                failure : function() {
                    Ext.Msg.show({
                        title : 'Ошибка добавления устройства',
                        message : 'При удалении устройства ' + name + ' произошла ошибка',
                        buttons : Ext.Msg.OK,
                        icon    : Ext.Msg.ERROR
                    });
                }
            });
        }

        Ext.Msg.prompt(
            "Добавление устройства",
            "Введите имя устройства",
            function(btnId, text) {
                if (btnId == 'ok' || btnId == 'yes') {
                    addDeviceAjax(Ext.String.trim(text), function() {
                        deviceStore.add({ name : text, icon : null, id : text });
                    });
                }
            }
        );
    },

    onDetectDeviceToggle : function(btn, pressed) {
        var me = this,
            deviceList = me.lookupReference('devicelist'),
            deviceStore = deviceList.getStore();

        function pollForDetection() {
            Ext.Ajax.request({
                url : '/predict/1',
                success : function(response) {
                    var json = Ext.decode(response.responseText),
                        record = deviceStore.getById(json.device),
                        item;

                    if (record) {
                        deviceList.getSelectionModel().select(record);
                        Ext.get(deviceList.getView().getRow(record)).highlight('EAB60B', {
                            duration : 500
                        });
                    }
                    else {
                        deviceList.getSelectionModel().deselectAll();
                    }
                },
                callback : function() {
                    me.detectTimerId && (me.detectTimerId = Ext.Function.defer(pollForDetection, 1000));
                }
            });
        }

        if (pressed) {
            me.detectTimerId = Ext.Function.defer(pollForDetection, 1);
        }
        else {
            clearTimeout(me.detectTimerId);
            me.detectTimerId = null;
        }
    },

    onTrainNetwork : function() {
        var me = this,
            deviceList = me.lookupReference('devicelist'),
            deviceStore = deviceList.getStore();

        Ext.Ajax.request({
            url : '/train/',
            success : function() {
                Ext.Msg.show({
                    title   : 'Тренировка проведена',
                    message : 'Тренировка нейросети по текущим достоверным данным проведена.',
                    buttons : Ext.Msg.OK,
                    icon    : Ext.Msg.INFO
                });
            },
            failure : function() {
                Ext.Msg.show({
                    title : 'Ошибка тренировки',
                    message : 'При тренировке нейросети по текущим достоверным данным произошла ошибка',
                    buttons : Ext.Msg.OK,
                    icon    : Ext.Msg.ERROR
                });
            }
        });
    },

    onDeviceListSelect : function(grid, record, index) {
        var me = this,
            deviceProfile = me.lookupReference('deviceprofile'),
            profileStore = deviceProfile.getStore();

        // Do not do it like that, use store.load() instead
        Ext.Ajax.request({
            url : '/deviceprofile/' + record.get('name'),
            success : function(response) {
                response = Ext.decode(response.responseText);
                profileStore.loadRawData(response.profile);
            }
        });

        /*
        profileStore.load({
            url : '/deviceprofile/' + record.get('name')
        });
        */
    }
});
