const PolyvUserConfig = {
  User: {
    // 初始化所需的数据
    vodKey:
      "",
    decodeKey: "",
    decodeIv: "",

    //0.4.0起应当设置setToken来初始化。以下参数建议通过加解密获取后设置
    userid:"",
    writetoken:"",
    readtoken:"",
    secretkey:"",


    viewerId: "rn_viewerId",
    nickName: "rn_nickName",

    // 输入框默认vid
    inputVid: ""
  }
};
module.exports = PolyvUserConfig;
