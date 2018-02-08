/**
 * 用户上下文信息
 */
import superagent from 'superagent';
import jsonp from 'superagent-jsonp';
import {Toast} from 'antd-mobile/lib/index';
import Cookies from 'js-cookie';
import BaseHost from './BaseHost';

// var loginProjectUrl = BaseHost + RestUrl.ROOT_PATH + "/pub/getProjectByOrgId";
// var loginUserUrl = BaseHost + RestUrl.ROOT_PATH + "/pub/getUserByID";
var loginContextUrl = BaseHost.MAURL + "/maservlet/ssoLogin/checkToken";
var esnContextUrl = BaseHost.MAURL + '/maservlet/upesn/checkUpesnToken';

function evil(fn) {
    var Fn = Function; //一个变量指向Function，防止有些前端编译工具报错
    return new Fn('return ' + fn)();
}

/**
 * 获取页面请求地址后面的参数
 */
function GetRequest() {
    var url = window.location.href; //直接获取href中的参数，不从search中获取
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.split('?')[1];
        str = str.split('#')[0];
        if (url.split('?').length > 2) {
            var str2 = url.split('?')[2];
            str = str + '&' + str2;
        }
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            var eqIndex = strs[i].indexOf("=");
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].substr(eqIndex + 1));
        }
    }
    return theRequest;
}

/**
 * 处理移动上下文
 * @param id 地址参数
 * @param module 页面模块地址
 */
function loginContextPost(url, checkParams, _success) {
    superagent.post(url).send(checkParams).end(function (err, res) {
        if (res && res.text) {
            let data = JSON.parse(res.text);
            if (data.flag == '0') {
                var resultJson = data.data;
                if (resultJson.success == true) {
                    resultJson = JSON.parse(resultJson.ext);
                    var psnInfo = resultJson.data;

                    if (psnInfo.supplier == null) {
                        if (psnInfo.staff == null || psnInfo.staff.id == null || psnInfo.staff.id == '') {
                            Toast.fail("人员信息为空，请检查人员信息");
                            return;
                        }
                        if (psnInfo.company == null || psnInfo.company.id == null || psnInfo.company.id == '') {
                            Toast.fail("人员公司信息为空，请检查人员公司信息");
                            return;
                        }
                        if (psnInfo.dept == null || psnInfo.dept.id == null || psnInfo.dept.id == '') {
                            Toast.fail("人员部门信息为空，请检查人员部门信息");
                            return;
                        }
                    }

                    let context = {
                        u_logints: psnInfo.authority.u_logints,
                        token: psnInfo.authority.token,
                        u_usercode: psnInfo.authority.u_usercode,
                        tenantid: psnInfo.authority.tenantid,
                        userId: psnInfo.authority.userId,
                        userType: psnInfo.authority.userType,
                        typeAlias: psnInfo.authority.typeAlias,
                        companyCode: psnInfo.company.companyCode,
                        companyName: psnInfo.company.companyName,
                        companyId: psnInfo.company.id,
                        staffId: psnInfo.staff.id,
                        staffCode: psnInfo.staff.credentialCode,
                        staffName: psnInfo.staff.name,
                        staffSex: psnInfo.staff.sex,
                        staffMobile: psnInfo.staff.mobile,
                        deptId: psnInfo.dept.id,
                        deptName: psnInfo.dept.deptName,
                        deptCode: psnInfo.dept.innercode,
                        _A_P_userName: psnInfo.user.userName,
                        _A_P_userCode: psnInfo.user.userCode,
                        _A_P_userId: psnInfo.user.userId,
                        _A_P_userLoginName: psnInfo.user.userName,
                    };
                    sessionStorage.setItem("icop_context", JSON.stringify(context));

                    //验证成功的回调
                    if (typeof _success === 'function') {
                        _success();
                    }
                } else {
                    Toast.fail("身份校验失败");
                }
            } else {
                Toast.fail(data.data.desc)
            }
        }
    });
}

var AuthToken = {
    CONTEXT_KEY: 'icop_context', //cookie键
    SERVER_URL: BaseHost + '/icop-workbench/getWorkbenchCookie', //获取上下文的URL
    _cacheContext: null
    /**
     * 初始化上下文信息
     * @param options 参数配置{
     *  url:获取上下文的URL
     *  success:初始化上下文成功时的回调
     *  error:初始化上下文失败时的回调
     * }
     */
    , init: function init(options) {
        //本地环境参数
        var _url = options && options.url ? options.url : this.SERVER_URL; //无URL参数则使用默认获取上下文的URL
        var _success = options && options.success ? options.success : null;
        var _error = options && options.error ? options.error : null;
        var _clear = options && options.clear !== undefined ? options.clear : true; //是否清除历史上下文
        var that = this;

        //移动端环境参数
        var urlParam = GetRequest();
        var url = null;

        if (urlParam.fromType && urlParam.fromType == 'upEsnApp') {
            url = esnContextUrl;
        } else {
            url = loginContextUrl;
        }
        if (urlParam.token) {
            //有token，表示从门户点击进入应用
            var param = {};
            param.token = urlParam.token;
            //处理从list界面进来的，传参数appid
            param.appid = urlParam.appid;
            loginContextPost(url, param, _success);
        } else if (urlParam.code) {
            var param = {};
            param.code = urlParam.code;
            //处理从list界面进来的，传参数appid
            param.appid = urlParam.appId;
            loginContextPost(url, param, _success);
        } else {
            //开发环境下
            if (_clear) {
                delete this._cacheContext; //清除内存级存储
                Cookies.remove(this.CONTEXT_KEY); //清除cookie级存储
            }
            var firstResp = false;
            superagent.get(_url).use(jsonp).end(function (err, res) {
                if (res !== null && res.body !== null && res.body !== undefined) {
                    Cookies.set(that.CONTEXT_KEY, res.body);
                    if (typeof _success === 'function') {
                        _success();
                    }
                } else {
                    if (_clear) {
                        delete this._cacheContext; //清除内存级存储
                        Cookies.remove(this.CONTEXT_KEY); //清除cookie级存储
                    }
                    if (firstResp === false) {
                        firstResp = true; //解决错误回调被执行了两次的问题
                    } else {
                        if (typeof _error === 'function') {
                            _error(err);
                        }
                    }
                }
            });
        }
    }
    /**
     * 获取上下文信息
     * @returns {String}
     */
    , getContext: function getContext() {
        if(sessionStorage.getItem(this.CONTEXT_KEY)){
            return JSON.parse(sessionStorage.getItem(this.CONTEXT_KEY));
        }else if (!this._cacheContext) {
            //内存级存储
            var context = Cookies.get(this.CONTEXT_KEY); //cookies级存储
            if (isJsonStr(context)) {
                //确保为JSON格式的字符串
                var jsTxt = '(' + decodeURIComponent(context.replace(/'/, "'")) + ')';
                var jsonObj = evil(jsTxt); //转换为JSON对象
                this._cacheContext = jsonObj;
            }
        }
        return this._cacheContext;
    }, getToken: function getToken() {
        // 获取Token
        var context = this.getContext();
        if (context === null || context === undefined) {
            return null;
        }
        return context["token"];
    }, getStaff: function getStaff() {
        var context = this.getContext();
        if (context === null || context === undefined) {
            return null;
        }
        return {
            id: context["staffId"],
            code: context["staffCode"],
            name: context["staffName"]
        };
    }, getStaffId: function getStaffId() {
        var context = this.getContext();
        if (context === null || context === undefined) {
            return null;
        }
        return context["staffId"];
    }, getStaffCode: function getStaffCode() {
        var context = this.getContext();
        if (context === null || context === undefined) {
            return null;
        }
        return context["staffCode"];
    }, getStaffName: function getStaffName() {
        var context = this.getContext();
        if (context === null || context === undefined) {
            return null;
        }
        return context["staffName"];
    }, getDept: function getDept() {
        var context = this.getContext();
        if (context === null || context === undefined) {
            return null;
        }
        return {
            id: context["deptId"],
            code: context["deptCode"],
            name: context["deptName"]
        };
    }, getDeptId: function getDeptId() {
        var context = this.getContext();
        if (context === null || context === undefined) {
            return null;
        }
        return context["deptId"];
    }, getDeptCode: function getDeptCode() {
        var context = this.getContext();
        if (context === null || context === undefined) {
            return null;
        }
        return context["deptCode"];
    }, getDeptName: function getDeptName() {
        var context = this.getContext();
        if (context === null || context === undefined) {
            return null;
        }
        return context["deptName"];
    }, getUser: function getUser() {
        var context = this.getContext();
        if (context === null || context === undefined) {
            return null;
        }
        return {
            id: context["_A_P_userId"],
            code: context["_A_P_userLoginName"],
            name: context["_A_P_userName"]
        };
    }, getUserId: function getUserId() {
        // 获取用户ID
        var context = this.getContext();
        if (context === null || context === undefined) {
            return null;
        }
        return context["_A_P_userId"];
    }, getUserCode: function getUserCode() {
        // 获取用户编码
        var context = this.getContext();
        if (context === null || context === undefined) {
            return null;
        }
        return context["_A_P_userLoginName"];
    }, getUserName: function getUserName() {
        // 获取用户名称
        var context = this.getContext();
        if (context === null || context === undefined) {
            return null;
        }
        return context["_A_P_userName"];
    }, getCurrentRoleId: function getCurrentRoleId() {
        // 获取当前角色ID
        var context = this.getContext();
        if (context === null || context === undefined) {
            return null;
        }
        return context["_A_P_currentRoleId"];
    }, getOrga: function getOrga() {
        // 获取组织ID,CODE,NAME信息
        var context = this.getContext();
        if (context === null || context === undefined) {
            return null;
        }
        return {
            id: context["companyId"],
            code: context["companyCode"],
            name: context["companyName"]
        };
    },
    getOrgaId: function getOrgaId() {
        // 获取组织ID
        var context = this.getContext();
        if (context === null || context === undefined) {
            return null;
        }
        return context["companyId"];
    }, getOrgaCode: function getOrgaCode() {
        // 获取组织编码
        var context = this.getContext();
        if (context === null || context === undefined) {
            return null;
        }
        return context["companyCode"];
    }, getOrgaName: function getOrgaName() {
        // 获取组织名称
        var context = this.getContext();
        if (context === null || context === undefined) {
            return null;
        }
        return context["companyName"];
    }, getLogints: function getLogints() {
        var context = this.getContext();
        if (context === null || context === undefined) {
            return null;
        }
        return context["u_logints"];
    }, getTenantId: function getTenantId() {
        var context = this.getContext();
        if (context === null || context === undefined) {
            return null;
        }
        return context["tenantid"];
    }, getAuthenticationStr: function getAuthenticationStr() {
        var includeFields = ["u_logints", "u_usercode", "token", "tenantid", "userId", "userType", "typeAlias" //认证需要的字段，下面为扩展字段
            , "_A_P_userLoginName", "_A_P_userName", "userType", "companyId", "companyName", "companyCode"];
        var set = new Set();
        includeFields.forEach(function (value) {
            set.add(value);
        });

        var authentication = '';
        var context = this.getContext();
        if (context) {
            for (var prop in context) {
                if (set.has(prop) && context[prop]) {
                    authentication += prop + '=' + encodeURI(context[prop]) + ';';
                }
            }
        }
        if (authentication.length > 0 && authentication[authentication.length - 1] === ';') authentication = authentication.substring(0, authentication.length - 1);
        return authentication;
    }
};

/**
 * @desc 是否为JSON对象格式的字符串形态。匹配格式:"{...}"
 */
function isJsonStr(val) {
    return typeof val === "string" && /^\{.*\}$/.test(val);
}

export default AuthToken;