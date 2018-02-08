import {resolve} from "path";

/**
 * 调用YYPlugin来处理各种与平台交互的功能
 *
 * @param {String} plugin 插件类型
 * @param {String} func 调用功能类型
 * @param {Object} params 传入参数
 */
const useYYPlus = async (plugin, func, params, callback) => {
    if (typeof params !== 'object') {
        throw new Error('传入参数值不正确！');
    }

    let useParams = new Promise((resolve, reject) => {
        YYPlugin.call(plugin, func, params, (result) => {
            resolve(result);
        });
    })
    useParams.then((result) => {
        callback(result);
    }, (err) => {
        console.err(err);
    })
}

const CONSTANT = {
    PLUGIN: 'CommonPlugin',
    BLUETOOTH_SCAN: 'bluScan',
    QRCODE_SCAN: 'scan',
}

const YYPlusUtils = {
    /**
     * 蓝牙扫描工具，
     * @param { Object } params 传入参数 其中isFilter为是否用传入的blueteeeh数组来过滤
     *          列表显示的条目。blueteeth是维护的蓝牙参数库，为对象数组。
     * params {
     *    isFilter: true,
     *    blueteeth:[{
     *        'sn': '1234567893',
     *        'id': 'a1234567894',
     *        'name': 'dev01',
     *        'code': 'a1234567894',
     *        'mac': '68:9E:19:03:AB:72',
     *    },{
     *        'sn': '1234567894',
     *        'id': 'b1234567894',
     *        'name': 'dev02',
     *        'code': 'b1234567894'
     *        'mac': '68:9E:19:03:7F:5E',
     *    }]
     * }
     * @returns { Object } 扫描后选择参数回调值, 为id,code,name,mac,sn。
     */
    blueToothScan: (params, callback) => {
        return useYYPlus(CONSTANT.PLUGIN, CONSTANT.BLUETOOTH_SCAN, params, callback);
    },

    /**
     * 二维码扫描工具
     * @param { String } type 值可为'webView' 'noDail'
     *          webView是打开一个用原生的webView打开，noDail为本应用的处理方式。
     * @returns { String } 扫描后的字符串值
     */
    qrcodeScan: (type, callback) => {
        let params = {};
        if (type && typeof type === 'string') {
            switch (type) {
                case 'webView':
                    params['command'] = 'openWebView';
                    break;
                case 'noDail':
                    params['command'] = 'noDail';
                    break;
                default:
                    params['command'] = 'noDail';
                    break;
            }
        }
        return useYYPlus(CONSTANT.PLUGIN, CONSTANT.QRCODE_SCAN, params, callback);
    }
}

export default YYPlusUtils;
