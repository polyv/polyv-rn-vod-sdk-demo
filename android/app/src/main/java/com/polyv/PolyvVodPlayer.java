package com.polyv;

import android.support.annotation.Nullable;

import com.easefun.polyvsdk.log.PolyvCommonLog;
import com.polyv.protocol.IPolyvRNVideoPlayer;
import com.polyv.view.PolyvRNVodPlayer;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

/**
 * @author df
 * @create 2019/2/20
 * @Describe
 */
public class PolyvVodPlayer extends ViewGroupManager<PolyvRNVodPlayer> implements IPolyvRNVideoPlayer {
    private static final String POLYV_VOD_PLAYER = "PolyvVodPlayer";
    private static final int POLYVVODPLAYER_EVENT_UPDATEVID = 808;
    private static final int POLYVVODPLAYER_EVENT_START_OR_PAUSE = 809;
    private static final int POLYVVODPLAYER_EVENT_PLAY = 810;
    private static final int POLYVVODPLAYER_EVENT_PAUSE = 811;
    private static final int POLYVVODPLAYER_EVENT_RELEASE = 812;


    @Override
    public String getName() {
        return POLYV_VOD_PLAYER;
    }

    @Override
    protected PolyvRNVodPlayer createViewInstance(ThemedReactContext reactContext) {
        return new PolyvRNVodPlayer(reactContext.getCurrentActivity());
    }

    @Override
    public void onDropViewInstance(PolyvRNVodPlayer view) {
        super.onDropViewInstance(view);
//        if(view != null){
//            view.onDestroy();
//        }
    }

    @javax.annotation.Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of("updateVid", POLYVVODPLAYER_EVENT_UPDATEVID,
                "startOrPause", POLYVVODPLAYER_EVENT_START_OR_PAUSE,
                "play", POLYVVODPLAYER_EVENT_PLAY,
                "pause", POLYVVODPLAYER_EVENT_PAUSE,
                "release", POLYVVODPLAYER_EVENT_RELEASE);
    }

    @Override
    public void receiveCommand(PolyvRNVodPlayer root, int commandId, @javax.annotation.Nullable ReadableArray args) {
//        Toast.makeText(root.getContext(), "收到RN层的任务通知...:" + commandId, Toast.LENGTH_LONG).show();
        switch (commandId) {
            case POLYVVODPLAYER_EVENT_UPDATEVID:
                if (args != null) {
                    String vid = args.getString(0);
                    root.setVid(vid.trim());
                }
                break;
            case POLYVVODPLAYER_EVENT_START_OR_PAUSE:
                if(root.isPlaying()){
                    root.pause();
                }else{
                    root.start();
                }
                break;
            case POLYVVODPLAYER_EVENT_PLAY:
                if (!root.isPlaying()) {
                    root.start();
                }
                break;
            case POLYVVODPLAYER_EVENT_PAUSE:
                if (root.isPlaying()) {
                    root.pause();
                }
                break;
            case POLYVVODPLAYER_EVENT_RELEASE:
                root.onDestroy();
                break;
        }
    }

    @ReactProp(name = PolyvRNConstants.RN_VID)
    @Override
    public void setVid(PolyvRNVodPlayer player, @Nullable String vid) {
        PolyvCommonLog.d(POLYV_VOD_PLAYER, "set vid :" + vid);
        player.play(vid, 1, false, false);
    }

    @ReactProp(name = PolyvRNConstants.RN_PLAY_PARAMETERS)
    @Override
    public void setVid(PolyvRNVodPlayer player, ReadableMap readableMap) {

        String vid = readableMap.getString(PolyvRNConstants.RN_VID);
        boolean isAutoStart = readableMap.getBoolean(PolyvRNConstants.RN_IS_AUTO_START);
        player.play(vid, 1, isAutoStart, false);
    }

}
