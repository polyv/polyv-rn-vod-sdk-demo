package com.easefun.polyvsdk;

/**
 * @author df
 * @create 2019/2/20
 * @Describe
 */
public class PolyvUserConfig {
    private static final PolyvUserConfig ourInstance = new PolyvUserConfig();

    public static PolyvUserConfig getInstance() {
        return ourInstance;
    }

    private PolyvUserConfig() {
    }

    private static  String nickName = "";
    private static  String avatar = "";
    private static  String viewerId ;

    public static String getNickName() {
        return nickName;
    }

    public  void setNickName(String nickName) {
        PolyvUserConfig.nickName = nickName;
    }

    public  String getAvatar() {
        return avatar;
    }

    public  void setAvatar(String avatar) {
        PolyvUserConfig.avatar = avatar;
    }


    public  String getViewerId() {
        return viewerId;
    }

    public  void setViewerId(String viewerId) {
        PolyvUserConfig.viewerId = viewerId;
    }
}
