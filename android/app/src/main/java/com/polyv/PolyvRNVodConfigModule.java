package com.polyv;

import android.text.TextUtils;
import android.util.Log;

import com.easefun.polyvsdk.PolyvDevMountInfo;
import com.easefun.polyvsdk.PolyvDownloaderManager;
import com.easefun.polyvsdk.PolyvSDKClient;
import com.easefun.polyvsdk.screencast.PolyvScreencastHelper;
import com.easefun.polyvsdk.util.PolyvStorageUtils;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import java.io.File;
import java.util.ArrayList;

import static com.polyv.PolyvRNVodCode.parseDataError;

/**
 * @author df
 * @create 2019/2/20
 * @Describe
 */
public class PolyvRNVodConfigModule extends ReactContextBaseJavaModule {
    private static final String TAG = "PolyvRNVodConfigModule";

    public PolyvRNVodConfigModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return TAG;
    }

    @ReactMethod
    public void setToken(String userid, String writetoken, String readtoken, String secretkey, String viewerId, String nickName, Promise promise) {
        Log.d(TAG, "setToken - start");
        int code = PolyvRNVodCode.success;
        if (TextUtils.isEmpty(userid)) {
            code = PolyvRNVodCode.noUserId;
        } else if (TextUtils.isEmpty(writetoken)) {
            code = PolyvRNVodCode.noWriteToken;
        } else if (TextUtils.isEmpty(readtoken)) {
            code = PolyvRNVodCode.noReadToken;
        } else if (TextUtils.isEmpty(secretkey)) {
            code = PolyvRNVodCode.noSecretKey;
        } else if (TextUtils.isEmpty(viewerId)) {
            code = PolyvRNVodCode.noViewId;
        }

        if (code == PolyvRNVodCode.success) {
            PolyvSDKClient client = PolyvSDKClient.getInstance();

            PolyvUserConfig.getInstance().setNickName(nickName);
            PolyvUserConfig.getInstance().setViewerId(viewerId);
            client.setViewerId(viewerId);

            //初始化sdk
            client.initSetting(getReactApplicationContext());
            client.settingsWithUserid(userid, secretkey, readtoken, writetoken);
            client.initCrashReport(getCurrentActivity());

            setDownloadDir();
            PolyvDownloaderManager.setDownloadQueueCount(1);

            WritableMap map = Arguments.createMap();
            map.putInt("code", PolyvRNVodCode.success);
            map.putString("token", PolyvSDKClient.getInstance().getReadtoken());
            map.putBoolean("isSign", PolyvSDKClient.getInstance().isSign());
            promise.resolve(map);
        } else {
            String errorCode = "" + code;
            String errorDesc = PolyvRNVodCode.getDesc(code);
            Throwable throwable = new Throwable(errorDesc);
            Log.e(TAG, "errorCode=" + errorCode + "  errorDesc=" + errorDesc);
            promise.reject(errorCode, errorDesc, throwable);
        }
        Log.d(TAG, "setToken result code: " + code);
    }

    /**
     * 建议使用{@link PolyvRNVodConfigModule#setToken(String, String, String, String, String, String, Promise)}
     */
    @Deprecated
    @ReactMethod
    public void init(String vodKey, String decodeKey, String decodeIv, String viewerId, String nickName, Promise promise) {
        Log.d(TAG, "init");
        int code = PolyvRNVodCode.success;
        if (TextUtils.isEmpty(decodeKey)) {
            code = PolyvRNVodCode.noDecodeKey;
        } else if (TextUtils.isEmpty(vodKey)) {
            code = PolyvRNVodCode.noVodKey;
        } else if (TextUtils.isEmpty(decodeIv)) {
            code = PolyvRNVodCode.noDecodeIv;
        } else if (TextUtils.isEmpty(viewerId)) {
            code = PolyvRNVodCode.noViewId;
        }

        if (code == PolyvRNVodCode.success) {

            PolyvUserConfig.getInstance().setNickName(nickName);
            PolyvUserConfig.getInstance().setViewerId(viewerId);

            initPolyvCilent(vodKey, decodeKey, decodeIv, viewerId);

            Log.d(TAG, "init: token" + PolyvSDKClient.getInstance().getReadtoken() + "  sign :" + PolyvSDKClient.getInstance().isSign());
            WritableMap map = Arguments.createMap();
            map.putInt("code", PolyvRNVodCode.success);
            map.putString("token", PolyvSDKClient.getInstance().getReadtoken());
            map.putBoolean("isSign", PolyvSDKClient.getInstance().isSign());
            promise.resolve(map);

        } else {
            String errorCode = "" + code;
            String errorDesc = PolyvRNVodCode.getDesc(code);
            Throwable throwable = new Throwable(errorDesc);
            Log.e(TAG, "errorCode=" + errorCode + "  errorDesc=" + errorDesc);
            promise.reject(errorCode, errorDesc, throwable);

        }

    }

    @ReactMethod
    public void parseEncryptData(String vid, String data, Promise promise) {
        String sourceData = PolyvSDKClient.getInstance().getDataToString(vid, data);
        if (!TextUtils.isEmpty(sourceData)) {
            WritableMap map = Arguments.createMap();
            map.putString("data", sourceData);
            promise.resolve(map);
            return;
        }
        String errorCode = "" + parseDataError;
        String errorDesc = PolyvRNVodCode.getDesc(parseDataError);
        Throwable throwable = new Throwable(errorDesc);
        Log.e(TAG, "errorCode=" + errorCode + "  errorDesc=" + errorDesc);
        promise.reject(errorCode, errorDesc, throwable);
    }


    public void initScreencast() {
        //TODO appId和appSecret需与包名绑定，获取方式请咨询Polyv技术支持
//        PolyvScreencastHelper.init("10747", "34fa2201e4e7441635ca4fa97fd4b21e");//该appId，appSecret仅能在demo中使用
        //初始化单例
        PolyvScreencastHelper.getInstance(getCurrentActivity());
    }

    public void initPolyvCilent(String vodKey, String decodeKey, String decodeIv, String viewerId) {
        //网络方式取得SDK加密串，（推荐）
        //网络获取到的SDK加密串可以保存在本地SharedPreference中，下次先从本地获取
//		new LoadConfigTask().execute();
        PolyvSDKClient client = PolyvSDKClient.getInstance();
        client.setViewerId(viewerId);
        client.initSetting(getReactApplicationContext());
        //使用SDK加密串来配置
        client.settingsWithConfigString(vodKey, decodeKey, decodeIv);
        //初始化SDK设置

        //启动Bugly
        client.initCrashReport(getCurrentActivity());
        //启动Bugly后，在学员登录时设置学员id
//		client.crashReportSetUserId(userId);
        setDownloadDir();
        // 设置下载队列总数，多少个视频能同时下载。(默认是1，设置负数和0是没有限制)
        PolyvDownloaderManager.setDownloadQueueCount(1);
    }

    /**
     * 设置下载视频目录
     */
    private void setDownloadDir() {
        String rootDownloadDirName = "polyvdownload";
        ArrayList<File> externalFilesDirs = PolyvStorageUtils.getExternalFilesDirs(getCurrentActivity());
        if (externalFilesDirs.size() == 0) {
            // TODO 没有可用的存储设备,后续不能使用视频缓存功能
            Log.e(TAG, "没有可用的存储设备,后续不能使用视频缓存功能");
            return;
        }

        //SD卡会有SD卡接触不良，SD卡坏了，SD卡的状态错误的问题。
        //我们在开发中也遇到了SD卡没有权限写入的问题，但是我们确定APP是有赋予android.permission.WRITE_EXTERNAL_STORAGE权限的。
        //有些是系统问题，有些是SD卡本身的问题，这些问题需要通过重新拔插SD卡或者更新SD卡来解决。所以如果想要保存下载视频至SD卡请了解这些情况。
        File downloadDir = new File(externalFilesDirs.get(0), rootDownloadDirName);
        PolyvSDKClient.getInstance().setDownloadDir(downloadDir);

        //兼容旧下载视频目录，如果新接入SDK，无需使用以下代码
        //获取SD卡信息
        PolyvDevMountInfo.getInstance().init(getCurrentActivity(), new PolyvDevMountInfo.OnLoadCallback() {

            @Override
            public void callback() {
                //是否有可移除的存储介质（例如 SD 卡）或内部（不可移除）存储可供使用。
                if (!PolyvDevMountInfo.getInstance().isSDCardAvaiable()) {
                    return;
                }

                //可移除的存储介质（例如 SD 卡），需要写入特定目录/storage/sdcard1/Android/data/包名/。
                //现在PolyvDevMountInfo.getInstance().getExternalSDCardPath()默认返回的目录路径就是/storage/sdcard1/Android/data/包名/。
                //跟PolyvDevMountInfo.getInstance().init(Context context, final OnLoadCallback callback)接口有区别，请保持同步修改。
                ArrayList<File> subDirList = new ArrayList<>();
                String externalSDCardPath = PolyvDevMountInfo.getInstance().getExternalSDCardPath();
                if (!TextUtils.isEmpty(externalSDCardPath)) {
                    StringBuilder dirPath = new StringBuilder();
                    dirPath.append(externalSDCardPath).append(File.separator).append("polyvdownload");
                    File saveDir = new File(dirPath.toString());
                    if (!saveDir.exists()) {
                        saveDir.mkdirs();//创建下载目录
                    }

                    //设置下载存储目录
//					PolyvSDKClient.getInstance().setDownloadDir(saveDir);
//					return;
                    subDirList.add(saveDir);
                }

                //如果没有可移除的存储介质（例如 SD 卡），那么一定有内部（不可移除）存储介质可用，都不可用的情况在前面判断过了。
                File saveDir = new File(PolyvDevMountInfo.getInstance().getInternalSDCardPath() + File.separator + "polyvdownload");
                if (!saveDir.exists()) {
                    saveDir.mkdirs();//创建下载目录
                }

                //设置下载存储目录
//				PolyvSDKClient.getInstance().setDownloadDir(saveDir);
                subDirList.add(saveDir);
                PolyvSDKClient.getInstance().setSubDirList(subDirList);
            }
        }, true);
    }
}
