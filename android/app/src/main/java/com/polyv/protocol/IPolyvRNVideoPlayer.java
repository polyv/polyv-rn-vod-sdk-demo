package com.polyv.protocol;

import com.polyv.view.PolyvRNVodPlayer;
import com.facebook.react.bridge.ReadableMap;

/**
 * @author df
 * @create 2019/2/20
 * @Describe
 */
public interface IPolyvRNVideoPlayer {
    void setVid(PolyvRNVodPlayer player, String vid);

    void setVid(PolyvRNVodPlayer player, ReadableMap readableMap);
}
