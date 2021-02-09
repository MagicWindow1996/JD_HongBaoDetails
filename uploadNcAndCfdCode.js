const $ = new Env("京喜农场和财富岛互助码提交");
const jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
$.tokens = [$.getdata('jxnc_token1') || '{}', $.getdata('jxnc_token2') || '{}'];
$.cookieArr = [];
let nickName;
let code1 = ['7C3C00120E3B3E5ED294454732EF7CF69C8209DD57553FEB29D24F901110FCA0', '9CAC003E1218FBEFADE82C2A98805F386832F2C8A7716272060BF611D316314C', '02A71D28DDEBCB4DEB9F5EAD92E3F21BE0BB63D49E0DACADAA04B6F3EE9FF6E9'];
let code2 = ['Jxcfd_GroupId_163_28714943', 'Jxcfd_GroupId_163_28723045', 'Jxcfd_GroupId_163_1099540704377'];
!(async () => {
    if (!getCookies()) return;
    for (let i = 0; i < $.cookieArr.length; i++) {
        $.currentCookie = $.cookieArr[i];
        $.currentToken = JSON.parse($.tokens[i] || '{}');
        if ($.currentCookie) {
            await TotalBean();
            await getJxnc();
            await submitNc(nickName);
            await getJxCfd();
            await submitCfd1(nickName);
            await submitCfd2(nickName);

            for (let j = 0; j < code1.length; j++) {
                if (i != j) {
                    await assist1(code1[j], nickName);
                    await assist2(code2[j], nickName);
                }
            }

        }
    }
})().catch((e) => $.logErr(e)).finally();

function TotalBean() {
    return new Promise(async resolve => {
        const options = {
            "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
            "headers": {
                "Accept": "application/json,text/plain, */*",
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-cn",
                "Connection": "keep-alive",
                "Cookie": $.currentCookie,
                "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data['retcode'] === 13) {
                            $.isLogin = false; //cookie过期
                            return
                        }
                        nickName = data['base'].nickname;
                    } else {
                        console.log(`京东服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

function getCookies() {
    if ($.isNode()) {
        $.cookieArr = Object.values(jdCookieNode);
    } else {
        $.cookieArr = [$.getdata("CookieJD") || "", $.getdata("CookieJD2") || ""];
    }
    if (!$.cookieArr[0]) {
        $.msg(
            $.name,
            "【⏰提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取",
            "https://bean.m.jd.com/", {
                "open-url": "https://bean.m.jd.com/",
            }
        );
        return false;
    }
    return true;
}

function getJxnc() {
    return new Promise(async resolve => {
        $.get({
            url: `https://wq.jd.com/cubeactive/farm/query?type=1&farm_jstoken=''&phoneid=''&timestamp=''&sceneval=2&g_login_type=1&callback=whyour&_=${Date.now()}&g_ty=ls`,
            headers: {
                Cookie: $.currentCookie,
                Accept: `*/*`,
                Connection: `keep-alive`,
                Referer: `https://st.jingxi.com/pingou/dream_factory/index.html`,
                'Accept-Encoding': `gzip, deflate, br`,
                Host: `wq.jd.com`,
                'Accept-Language': `zh-cn`,
            },
            timeout: 10000,
        }, async (err, resp, data) => {
            try {
                const res = data.match(/try\{whyour\(([\s\S]*)\)\;\}catch\(e\)\{\}/)[1];
                const {
                    detail,
                    msg,
                    task = [],
                    retmsg,
                    ...other
                } = JSON.parse(res);
                $.info = other;
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve(true);
            }
        });
    });
}

function submitNc(userName) {
    return new Promise(resolve => {
        if (!$.info || !$.info.smp) {
            resolve();
            return;
        }
        try {
            $.post({
                    url: `https://api.ninesix.cc/api/jx-nc/${$.info.smp}/${encodeURIComponent(userName)}?active=${$.info.active}&joinnum=${$.info.joinnum}`,
                    timeout: 10000
                },
                (err, resp, _data) => {
                    try {
                        const {
                            code
                        } = JSON.parse(_data);
                        if (code == 200) {
                            console.log(userName + '----京喜农场：提交成功');
                        } else {
                            console.log(userName + '----' + _data.errors.message);
                        }
                    } catch (e) {
                        $.log($.nickName + '----京喜农场：' + '邀请码提交失败 API 返回异常');
                    } finally {
                        resolve();
                    }
                },
            );
        } catch (e) {
            resolve();
        }
    });
}

function getJxCfd() {
    return new Promise(async (resolve) => {
        $.get({
            url: `https://m.jingxi.com/jxcfd/user/QueryUserInfo?strZone=jxcfd&bizCode=jxcfd&source=jxcfd&dwEnv=7&_cfd_t=${Date.now()}&ptag=138631.26.55&_ste=1&_=${Date.now()}&sceneval=2&g_login_type=1&g_ty=ls`,
            headers: {
                Cookie: $.currentCookie,
                Accept: "*/*",
                Connection: "keep-alive",
                Referer: "https://st.jingxi.com/fortune_island/index.html?ptag=138631.26.55",
                "Accept-Encoding": "gzip, deflate, br",
                Host: "m.jingxi.com",
                "User-Agent": `jdpingou;iPhone;3.15.2;14.2.1;ea00763447803eb0f32045dcba629c248ea53bb3;network/wifi;model/iPhone13,2;appBuild/100365;ADID/00000000-0000-0000-0000-000000000000;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/0;hasOCPay/0;supportBestPay/0;session/${Math.random * 98 + 1};pap/JA2015_311210;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148`,
                "Accept-Language": "zh-cn",
            },
        }, (err, resp, data) => {
            try {
                const {
                    iret,
                    SceneList = {},
                    XbStatus: {
                        XBDetail = [],
                        dwXBRemainCnt
                    } = {},
                    ddwMoney,
                    dwIsNewUser,
                    sErrMsg,
                    strMyShareId,
                    strPin,
                } = JSON.parse(data);
                $.info = {
                    ...$.info,
                    SceneList,
                    XBDetail,
                    dwXBRemainCnt,
                    ddwMoney,
                    dwIsNewUser,
                    strMyShareId,
                    strPin,
                };
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

function submitCfd1(userName) {
    return new Promise(resolve => {
        if (!$.info || !$.info.strMyShareId) {
            resolve();
            return;
        }
        $.post({
                url: `https://api.ninesix.cc/api/jx-cfd/${$.info.strMyShareId}/${encodeURIComponent(userName)}`,
            },
            async (err, resp, _data) => {
                try {
                    const {
                        code
                    } = JSON.parse(_data);
                    if (code == 200) {
                        console.log(userName + '----京喜财富岛：提交成功');
                    }
                } catch (e) {
                    $.logErr(e, resp);
                } finally {
                    resolve();
                }
            },
        );
    });
}

function submitCfd2(userName) {
    return new Promise(resolve => {
        $.get({
            url: `https://m.jingxi.com/jxcfd/user/GatherForture?strZone=jxcfd&bizCode=jxcfd&source=jxcfd&dwEnv=7&_cfd_t=${Date.now()}&ptag=138631.26.55&_ste=1&_=${Date.now()}&sceneval=2&g_login_type=1&g_ty=ls`,
            headers: {
                Cookie: $.currentCookie,
                Accept: "*/*",
                Connection: "keep-alive",
                Referer: "https://st.jingxi.com/fortune_island/index.html?ptag=138631.26.55",
                "Accept-Encoding": "gzip, deflate, br",
                Host: "m.jingxi.com",
                "User-Agent": `jdpingou;iPhone;3.15.2;14.2.1;ea00763447803eb0f32045dcba629c248ea53bb3;network/wifi;model/iPhone13,2;appBuild/100365;ADID/00000000-0000-0000-0000-000000000000;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/0;hasOCPay/0;supportBestPay/0;session/${Math.random * 98 + 1};pap/JA2015_311210;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148`,
                "Accept-Language": "zh-cn",
            },
        }, async (err, resp, g_data) => {
            try {
                const {
                    GroupInfo: {
                        strGroupId
                    },
                    strPin
                } = JSON.parse(g_data);
                if (!strGroupId) {
                    const status = await openGroup();
                    if (status === 0) {
                        await submitGroupId();
                    } else {
                        resolve();
                        return;
                    }
                } else {
                    $.post({
                            url: `https://api.ninesix.cc/api/jx-cfd-group/${strGroupId}/${encodeURIComponent(strPin)}`
                        },
                        async (err, resp, _data) => {
                            try {
                                const {
                                    data = {}, code
                                } = JSON.parse(_data);
                                if (code == 200) {
                                    console.log(userName + '----京喜财富岛寻宝大作战：提交成功');
                                }
                            } catch (e) {
                                $.logErr(e, resp);
                            } finally {
                                resolve();
                            }
                        }
                    );
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//财富岛助力自己账号
function assist1(code, nickName) {
    new Promise(resolve => {
        const sceneIds = Object.keys($.info.SceneList);
        const sceneId = Math.min(...sceneIds);
        $.get(taskUrl('user/JoinScene', `strShareId=` + code + `&dwSceneId=${sceneId}`), async (err, resp, data) => {
            try {
                const {
                    sErrMsg,
                    data: {
                        rewardMoney = 0
                    } = {}
                } = JSON.parse(data);

                //$.log(nickName + `【👬普通助力】助力：${sErrMsg}${$.showLog ? data : ''}`);
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}
//助力自己寻宝大作战
function assist2(code, nickName) {
    return new Promise(async (resolve) => {
        $.get({
            url: 'https://api.ninesix.cc/api/jx-cfd-group'
        }, (err, resp, _data) => {
            try {
                const {
                    data = {}
                } = JSON.parse(_data);
                $.get(taskUrl(`user/JoinGroup`, `strGroupId=` + code + `&dwIsNewUser=${$.info.dwIsNewUser}&pgtimestamp=${$.currentToken['timestamp']}&phoneID=${$.currentToken['phoneid']}&pgUUNum=${$.currentToken['farm_jstoken']}`), (err, resp, data) => {
                    try {
                        const {
                            sErrMsg
                        } = JSON.parse(data);
                        // $.log(nickName + `【🏝寻宝大作战】助力：${sErrMsg}${$.showLog ? data : ''}`);
                    } catch (e) {
                        $.logErr(e, resp);
                    } finally {
                        resolve();
                    }
                });
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

function taskUrl(function_path, body) {
    return {
        url: `https://m.jingxi.com/jxcfd/${function_path}?strZone=jxcfd&bizCode=jxcfd&source=jxcfd&dwEnv=7&_cfd_t=${Date.now()}&ptag=138631.26.55&${body}&_ste=1&_=${Date.now()}&sceneval=2&g_login_type=1&g_ty=ls`,
        headers: {
            Cookie: $.currentCookie,
            Accept: "*/*",
            Connection: "keep-alive",
            Referer: "https://st.jingxi.com/fortune_island/index.html?ptag=138631.26.55",
            "Accept-Encoding": "gzip, deflate, br",
            Host: "m.jingxi.com",
            "User-Agent": `jdpingou;iPhone;3.15.2;14.2.1;ea00763447803eb0f32045dcba629c248ea53bb3;network/wifi;model/iPhone13,2;appBuild/100365;ADID/00000000-0000-0000-0000-000000000000;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/0;hasOCPay/0;supportBestPay/0;session/${Math.random * 98 + 1};pap/JA2015_311210;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148`,
            "Accept-Language": "zh-cn",
        },
    };
}

// prettier-ignore
function Env(t, e) {
    class s {
        constructor(t) {
            this.env = t
        }
        send(t, e = "GET") {
            t = "string" == typeof t ? {
                url: t
            } : t;
            let s = this.get;
            return "POST" === e && (s = this.post), new Promise((e, i) => {
                s.call(this, t, (t, s, r) => {
                    t ? i(t) : e(s)
                })
            })
        }
        get(t) {
            return this.send.call(this.env, t)
        }
        post(t) {
            return this.send.call(this.env, t, "POST")
        }
    }
    return new class {
        constructor(t, e) {
            this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`)
        }
        isNode() {
            return "undefined" != typeof module && !!module.exports
        }
        isQuanX() {
            return "undefined" != typeof $task
        }
        isSurge() {
            return "undefined" != typeof $httpClient && "undefined" == typeof $loon
        }
        isLoon() {
            return "undefined" != typeof $loon
        }
        toObj(t, e = null) {
            try {
                return JSON.parse(t)
            } catch {
                return e
            }
        }
        toStr(t, e = null) {
            try {
                return JSON.stringify(t)
            } catch {
                return e
            }
        }
        getjson(t, e) {
            let s = e;
            const i = this.getdata(t);
            if (i) try {
                s = JSON.parse(this.getdata(t))
            } catch {}
            return s
        }
        setjson(t, e) {
            try {
                return this.setdata(JSON.stringify(t), e)
            } catch {
                return !1
            }
        }
        getScript(t) {
            return new Promise(e => {
                this.get({
                    url: t
                }, (t, s, i) => e(i))
            })
        }
        runScript(t, e) {
            return new Promise(s => {
                let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
                i = i ? i.replace(/\n/g, "").trim() : i;
                let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
                r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
                const [o, h] = i.split("@"), a = {
                    url: `http://${h}/v1/scripting/evaluate`,
                    body: {
                        script_text: t,
                        mock_type: "cron",
                        timeout: r
                    },
                    headers: {
                        "X-Key": o,
                        Accept: "*/*"
                    }
                };
                this.post(a, (t, e, i) => s(i))
            }).catch(t => this.logErr(t))
        }
        loaddata() {
            if (!this.isNode()) return {}; {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    i = !s && this.fs.existsSync(e);
                if (!s && !i) return {}; {
                    const i = s ? t : e;
                    try {
                        return JSON.parse(this.fs.readFileSync(i))
                    } catch (t) {
                        return {}
                    }
                }
            }
        }
        writedata() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    i = !s && this.fs.existsSync(e),
                    r = JSON.stringify(this.data);
                s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
            }
        }
        lodash_get(t, e, s) {
            const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
            let r = t;
            for (const t of i)
                if (r = Object(r)[t], void 0 === r) return s;
            return r
        }
        lodash_set(t, e, s) {
            return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t)
        }
        getdata(t) {
            let e = this.getval(t);
            if (/^@/.test(t)) {
                const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
                if (r) try {
                    const t = JSON.parse(r);
                    e = t ? this.lodash_get(t, i, "") : e
                } catch (t) {
                    e = ""
                }
            }
            return e
        }
        setdata(t, e) {
            let s = !1;
            if (/^@/.test(e)) {
                const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}";
                try {
                    const e = JSON.parse(h);
                    this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
                } catch (e) {
                    const o = {};
                    this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
                }
            } else s = this.setval(t, e);
            return s
        }
        getval(t) {
            return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null
        }
        setval(t, e) {
            return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null
        }
        initGotEnv(t) {
            this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
        }
        get(t, e = (() => {})) {
            t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
                "X-Surge-Skip-Scripting": !1
            })), $httpClient.get(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
                hints: !1
            })), $task.fetch(t).then(t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o)
            }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
                try {
                    if (t.headers["set-cookie"]) {
                        const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
                        s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
                    }
                } catch (t) {
                    this.logErr(t)
                }
            }).then(t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o)
            }, t => {
                const {
                    message: s,
                    response: i
                } = t;
                e(s, i, i && i.body)
            }))
        }
        post(t, e = (() => {})) {
            if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
                "X-Surge-Skip-Scripting": !1
            })), $httpClient.post(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            });
            else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
                hints: !1
            })), $task.fetch(t).then(t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o)
            }, t => e(t));
            else if (this.isNode()) {
                this.initGotEnv(t);
                const {
                    url: s,
                    ...i
                } = t;
                this.got.post(s, i).then(t => {
                    const {
                        statusCode: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    } = t;
                    e(null, {
                        status: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    }, o)
                }, t => {
                    const {
                        message: s,
                        response: i
                    } = t;
                    e(s, i, i && i.body)
                })
            }
        }
        time(t) {
            let e = {
                "M+": (new Date).getMonth() + 1,
                "d+": (new Date).getDate(),
                "H+": (new Date).getHours(),
                "m+": (new Date).getMinutes(),
                "s+": (new Date).getSeconds(),
                "q+": Math.floor(((new Date).getMonth() + 3) / 3),
                S: (new Date).getMilliseconds()
            };
            /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length)));
            for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length)));
            return t
        }
        msg(e = t, s = "", i = "", r) {
            const o = t => {
                if (!t) return t;
                if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {
                    "open-url": t
                } : this.isSurge() ? {
                    url: t
                } : void 0;
                if ("object" == typeof t) {
                    if (this.isLoon()) {
                        let e = t.openUrl || t.url || t["open-url"],
                            s = t.mediaUrl || t["media-url"];
                        return {
                            openUrl: e,
                            mediaUrl: s
                        }
                    }
                    if (this.isQuanX()) {
                        let e = t["open-url"] || t.url || t.openUrl,
                            s = t["media-url"] || t.mediaUrl;
                        return {
                            "open-url": e,
                            "media-url": s
                        }
                    }
                    if (this.isSurge()) {
                        let e = t.url || t.openUrl || t["open-url"];
                        return {
                            url: e
                        }
                    }
                }
            };
            if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) {
                let t = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];
                t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t)
            }
        }
        log(...t) {
            t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
        }
        logErr(t, e) {
            const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
            s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t)
        }
        wait(t) {
            return new Promise(e => setTimeout(e, t))
        }
        done(t = {}) {
            const e = (new Date).getTime(),
                s = (e - this.startTime) / 1e3;
            this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
        }
    }(t, e)
}