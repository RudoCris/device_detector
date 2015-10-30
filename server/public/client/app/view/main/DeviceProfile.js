Ext.define('DDC.view.main.DeviceProfile', {
    extend: 'Ext.chart.CartesianChart',
    xtype: 'deviceprofile',

    requires: [
        'DDC.store.DeviceProfile'
    ],

    
    animation : {
        easing   : 'backOut',
        duration : 500
    },

    
    axes : [{
        type           : 'numeric',
        position       : 'left',
        fields         : 'value',
        label          : {
            textAlign : 'right'
        },
        title          : 'Current',
    }, {
        type     : 'numeric',
        position : 'bottom',
        fields   : 'id'
    }],

    series       : [{
        type         : 'bar',
        xField       : 'id',
        yField       : 'value',
        label        : {
            field   : 'idx',
            display : 'insideEnd'
        }
    }],

    construct : function(config) {
        var me = this;

        me.store = DDC.store.DeviceProfile.create();
        me.callParent([config]);
    }
});
