package com.easefun;

import android.support.multidex.MultiDexApplication;

import com.easefun.polyvsdk.PolyvSDKClient;
import com.easefun.polyvsdk.rn.BuildConfig;
import com.easefun.polyvsdk.rn.PolyvRNVodPluginManager;
import com.easefun.polyvsdk.util.PolyvStorageUtils;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.nostra13.universalimageloader.core.ImageLoader;
import com.nostra13.universalimageloader.core.ImageLoaderConfiguration;

import java.util.Arrays;
import java.util.List;

public class PolyvRNVodApplication extends MultiDexApplication implements ReactApplication {

    private static final String TAG = "PolyvRNVodApplication";
    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new PolyvRNVodPluginManager()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }


    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
//        initPolyvClient();
    }

    public void initPolyvClient() {
        //网络方式取得SDK加密串，（推荐）
        //网络获取到的SDK加密串可以保存在本地SharedPreference中，下次先从本地获取
//		new LoadConfigTask().execute();
        PolyvSDKClient client = PolyvSDKClient.getInstance();
        //使用SDK加密串来配置
//        client.setConfig(config, aeskey, iv, getApplicationContext());

        client.setConfig("QClvoXtHPXPsLJ62lFuC0dlWunnGGO/TXtm28ow1p/q/nBQsPIBKhpYMijK4ue6nV/Bx2+Kzceq1U4NF8pfpGwMfI4bKRzlNP1QcMpYgB5GGHN0bIa9vu+IW0Xm1A05VSG/70KTUAzv0j9S9Eyj5xg==",
                "VXtlHmwfS2oYm0CZ", "2u9gDPKdX6GyQJKU", getApplicationContext());
        //初始化SDK设置
        client.initSetting(getApplicationContext());
        //启动Bugly
        client.initCrashReport(getApplicationContext());

        //初始化ImageLoader
        ImageLoaderConfiguration configuration = ImageLoaderConfiguration.createDefault(this);
        ImageLoader.getInstance().init(configuration);
    }
}
